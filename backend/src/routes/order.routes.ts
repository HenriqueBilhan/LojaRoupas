import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

// Cria um pedido a partir do carrinho atual do usuário (checkout)
router.post("/", async (req: AuthRequest, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  if (!shippingAddress) {
    return res.status(400).json({ message: "Endereço de entrega é obrigatório." });
  }

  const cartRepo = AppDataSource.getRepository(CartItem);
  const orderRepo = AppDataSource.getRepository(Order);

  const cartItems = await cartRepo.find({
    where: { userId: req.user!.userId },
    relations: ["product", "variant"],
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Carrinho vazio." });
  }

  const items = cartItems.map((ci) =>
    Object.assign(new OrderItem(), {
      productId: ci.productId,
      productName: ci.product.name,
      size: ci.variant?.size,
      color: ci.variant?.color,
      unitPriceCents: ci.product.priceCents,
      quantity: ci.quantity,
    })
  );

  const totalCents = items.reduce((sum, it) => sum + it.unitPriceCents * it.quantity, 0);

  const order = orderRepo.create({
    userId: req.user!.userId,
    status: OrderStatus.PENDING,
    paymentMethod: paymentMethod || "pix",
    totalCents,
    shippingAddress,
    items,
  });

  await orderRepo.save(order);
  await cartRepo.remove(cartItems);

  res.status(201).json(order);
});

// Lista os pedidos do próprio usuário
router.get("/my", async (req: AuthRequest, res) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const orders = await orderRepo.find({
    where: { userId: req.user!.userId },
    relations: ["items"],
    order: { createdAt: "DESC" },
  });
  res.json(orders);
});

router.get("/:id", async (req: AuthRequest, res) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const order = await orderRepo.findOne({ where: { id: req.params.id }, relations: ["items"] });
  if (!order) return res.status(404).json({ message: "Pedido não encontrado." });
  if (order.userId !== req.user!.userId && req.user!.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado." });
  }
  res.json(order);
});

// --- Rotas de administrador ---

router.get("/", requireAdmin, async (_req, res) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const orders = await orderRepo.find({ relations: ["items", "user"], order: { createdAt: "DESC" } });
  res.json(orders);
});

router.put("/:id/status", requireAdmin, async (req, res) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const order = await orderRepo.findOne({ where: { id: req.params.id } });
  if (!order) return res.status(404).json({ message: "Pedido não encontrado." });

  const { status } = req.body;
  if (!Object.values(OrderStatus).includes(status)) {
    return res.status(400).json({ message: "Status inválido." });
  }
  order.status = status;
  await orderRepo.save(order);
  res.json(order);
});

export default router;
