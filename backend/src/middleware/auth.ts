import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

// Exige um token JWT válido no header Authorization: Bearer <token>
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não informado." });
  }
  const token = header.replace("Bearer ", "");
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

// Exige que o usuário autenticado tenha papel de administrador
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso restrito a administradores." });
  }
  next();
}
