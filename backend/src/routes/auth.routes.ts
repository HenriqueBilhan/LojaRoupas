import { Router } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import { signToken } from "../utils/jwt";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// Cadastro de novo usuário (cliente)
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Informe seu nome."),
    body("email").isEmail().withMessage("E-mail inválido."),
    body("password").isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres."),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ message: "Já existe uma conta com este e-mail." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = userRepo.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: UserRole.CUSTOMER,
    });
    await userRepo.save(user);

    const token = signToken({ userId: user.id, role: user.role });
    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  }
);

// Login
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "E-mail ou senha inválidos." });
    }

    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email: email.toLowerCase() } });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    const token = signToken({ userId: user.id, role: user.role });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  }
);

// Retorna os dados do usuário autenticado
router.get("/me", requireAuth, async (req: AuthRequest, res: any) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id: req.user!.userId } });
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  });
});

// Atualiza dados do próprio perfil
router.put("/me", requireAuth, async (req: AuthRequest, res: any) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id: req.user!.userId } });
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

  const { name, phone } = req.body;
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  await userRepo.save(user);

  return res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone });
});

export default router;
