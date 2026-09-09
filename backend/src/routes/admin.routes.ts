import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();
router.use(requireAuth, requireAdmin);

// Lista de usuários cadastrados (para o admin)
router.get("/users", async (_req, res) => {
  const repo = AppDataSource.getRepository(User);
  const users = await repo.find({
    select: ["id", "name", "email", "phone", "role", "isActive", "createdAt"],
    order: { createdAt: "DESC" },
  });
  res.json(users);
});

router.put("/users/:id/role", async (req, res) => {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
  user.role = req.body.role;
  await repo.save(user);
  res.json({ id: user.id, role: user.role });
});

router.put("/users/:id/status", async (req, res) => {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
  user.isActive = req.body.isActive;
  await repo.save(user);
  res.json({ id: user.id, isActive: user.isActive });
});

// Métricas simples para o dashboard do admin
router.get("/dashboard", async (_req, res) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const userRepo = AppDataSource.getRepository(User);
  const productRepo = AppDataSource.getRepository(Product);

  const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
    orderRepo.count(),
    userRepo.count(),
    productRepo.count(),
    orderRepo.find(),
  ]);

  const totalRevenueCents = orders
    .filter((o) => o.status !== "canceled")
    .reduce((sum, o) => sum + o.totalCents, 0);

  res.json({ totalOrders, totalUsers, totalProducts, totalRevenueCents });
});

export default router;
