import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";
import { Category } from "../entities/Category";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { slugify } from "../utils/slugify";

const router = Router();

// Lista pública de produtos, com filtros por categoria, busca e paginação
router.get("/", async (req, res) => {
  const repo = AppDataSource.getRepository(Product);
  const { category, search, featured, page = "1", limit = "24" } = req.query as Record<string, string>;

  const qb = repo
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.variants", "variants")
    .where("product.isActive = :active", { active: true });

  if (category) {
    qb.andWhere("category.slug = :category", { category });
  }
  if (search) {
    // MySQL não tem ILIKE (isso é sintaxe do Postgres) — LOWER()+LIKE faz a busca case-insensitive
    qb.andWhere("LOWER(product.name) LIKE LOWER(:search)", { search: `%${search}%` });
  }
  if (featured === "true") {
    qb.andWhere("product.isFeatured = true");
  }

  const take = Math.min(Number(limit) || 24, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  qb.orderBy("product.createdAt", "DESC").skip(skip).take(take);

  try {
    const [items, total] = await qb.getManyAndCount();
    res.json({ items, total, page: Number(page), limit: take });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
});

router.get("/:slug", async (req, res) => {
  const repo = AppDataSource.getRepository(Product);
  const product = await repo.findOne({
    where: { slug: req.params.slug },
    relations: ["category", "variants"],
  });
  if (!product) return res.status(404).json({ message: "Produto não encontrado." });
  res.json(product);
});

// --- Rotas de administrador ---

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const repo = AppDataSource.getRepository(Product);
  const {
    name,
    description,
    priceCents,
    comparePriceCents,
    images,
    stock,
    categoryId,
    isFeatured,
    variants,
  } = req.body;

  if (!name || !priceCents) {
    return res.status(400).json({ message: "Nome e preço são obrigatórios." });
  }

  const product = repo.create({
    name,
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    description,
    priceCents,
    comparePriceCents,
    images: images || [],
    stock: stock || 0,
    categoryId: categoryId || undefined, // "" (nenhuma categoria selecionada) não é um id válido
    isFeatured: !!isFeatured,
    variants: (variants || []).map((v: any) =>
      Object.assign(new ProductVariant(), { size: v.size, color: v.color, stock: v.stock || 0, sku: v.sku })
    ),
  });

  try {
    await repo.save(product);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Não foi possível criar o produto. Verifique os dados enviados." });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const repo = AppDataSource.getRepository(Product);
  const product = await repo.findOne({ where: { id: req.params.id }, relations: ["variants"] });
  if (!product) return res.status(404).json({ message: "Produto não encontrado." });

  const {
    name,
    description,
    priceCents,
    comparePriceCents,
    images,
    stock,
    categoryId,
    isFeatured,
    isActive,
  } = req.body;

  if (name) {
    product.name = name;
  }
  if (description !== undefined) product.description = description;
  if (priceCents !== undefined) product.priceCents = priceCents;
  if (comparePriceCents !== undefined) product.comparePriceCents = comparePriceCents;
  if (images !== undefined) product.images = images;
  if (stock !== undefined) product.stock = stock;
  if (categoryId !== undefined) product.categoryId = categoryId || undefined; // "" não é um id válido
  if (isFeatured !== undefined) product.isFeatured = isFeatured;
  if (isActive !== undefined) product.isActive = isActive;

  try {
    await repo.save(product);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Não foi possível salvar o produto. Verifique os dados enviados." });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const repo = AppDataSource.getRepository(Product);
  const result = await repo.delete(req.params.id);
  if (result.affected === 0) return res.status(404).json({ message: "Produto não encontrado." });
  res.status(204).send();
});

export default router;
