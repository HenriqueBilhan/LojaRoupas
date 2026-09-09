import { Router } from "express";
import { AppDataSource } from "../data-source";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

// Retorna o carrinho do usuário autenticado
router.get("/", async (req: AuthRequest, res) => {
  const repo = AppDataSource.getRepository(CartItem);
  const items = await repo.find({
    where: { userId: req.user!.userId },
    relations: ["product", "variant"],
    order: { createdAt: "DESC" },
  });
  res.json(items);
});

// Adiciona (ou incrementa) um item no carrinho
router.post("/", async (req: AuthRequest, res) => {
  const { productId, variantId, quantity = 1 } = req.body;
  const productRepo = AppDataSource.getRepository(Product);
  const cartRepo = AppDataSource.getRepository(CartItem);

  const product = await productRepo.findOne({ where: { id: productId } });
  if (!product) return res.status(404).json({ message: "Produto não encontrado." });

  let item = await cartRepo.findOne({
    where: { userId: req.user!.userId, productId, variantId: variantId || undefined },
  });

  if (item) {
    item.quantity += Number(quantity);
  } else {
    item = cartRepo.create({
      userId: req.user!.userId,
      productId,
      variantId,
      quantity: Number(quantity),
    });
  }

  await cartRepo.save(item);
  res.status(201).json(item);
});

router.put("/:id", async (req: AuthRequest, res) => {
  const cartRepo = AppDataSource.getRepository(CartItem);
  const item = await cartRepo.findOne({ where: { id: req.params.id, userId: req.user!.userId } });
  if (!item) return res.status(404).json({ message: "Item não encontrado no carrinho." });

  const { quantity } = req.body;
  if (quantity <= 0) {
    await cartRepo.remove(item);
    return res.status(204).send();
  }
  item.quantity = quantity;
  await cartRepo.save(item);
  res.json(item);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const cartRepo = AppDataSource.getRepository(CartItem);
  const result = await cartRepo.delete({ id: req.params.id, userId: req.user!.userId });
  if (result.affected === 0) return res.status(404).json({ message: "Item não encontrado." });
  res.status(204).send();
});

export default router;
