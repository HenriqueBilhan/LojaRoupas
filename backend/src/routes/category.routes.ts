import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entities/Category";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { slugify } from "../utils/slugify";

const router = Router();

// Lista pública de categorias (usada no menu do site)
router.get("/", async (_req, res) => {
  const repo = AppDataSource.getRepository(Category);
  const categories = await repo.find({ order: { sortOrder: "ASC", name: "ASC" }, relations: ["children"] });
  res.json(categories);
});

router.get("/:slug", async (req, res) => {
  const repo = AppDataSource.getRepository(Category);
  const category = await repo.findOne({ where: { slug: req.params.slug } });
  if (!category) return res.status(404).json({ message: "Categoria não encontrada." });
  res.json(category);
});

// --- Rotas de administrador ---

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const repo = AppDataSource.getRepository(Category);
  const { name, description, imageUrl, parentId, sortOrder } = req.body;
  if (!name) return res.status(400).json({ message: "Nome é obrigatório." });

  const category = repo.create({
    name,
    slug: slugify(name),
    description,
    imageUrl,
    parentId: parentId || undefined,
    sortOrder: sortOrder || 0,
  });

  try {
    await repo.save(category);
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Não foi possível criar a categoria. Talvez já exista uma com esse nome." });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const repo = AppDataSource.getRepository(Category);
  const category = await repo.findOne({ where: { id: req.params.id } });
  if (!category) return res.status(404).json({ message: "Categoria não encontrada." });

  const { name, description, imageUrl, parentId, sortOrder } = req.body;
  if (name) {
    category.name = name;
    category.slug = slugify(name);
  }
  if (description !== undefined) category.description = description;
  if (imageUrl !== undefined) category.imageUrl = imageUrl;
  if (parentId !== undefined) category.parentId = parentId || undefined; // "" não é um id válido
  if (sortOrder !== undefined) category.sortOrder = sortOrder;

  try {
    await repo.save(category);
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Não foi possível salvar a categoria. Talvez já exista uma com esse nome." });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const repo = AppDataSource.getRepository(Category);
  const result = await repo.delete(req.params.id);
  if (result.affected === 0) return res.status(404).json({ message: "Categoria não encontrada." });
  res.status(204).send();
});

export default router;
