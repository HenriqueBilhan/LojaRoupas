import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = ALLOWED_MIME[file.mimetype] || path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME[file.mimetype]) {
      return cb(new Error("Formato não suportado. Use JPG, PNG, WEBP ou GIF."));
    }
    cb(null, true);
  },
});

// Upload de imagens de produto (até 5 por vez, form-data com o campo "images").
// Retorna as URLs públicas dos arquivos salvos, prontas pra guardar em Product.images.
router.post("/", requireAuth, requireAdmin, (req, res) => {
  upload.array("images", 5)(req, res, (err: any) => {
    if (err) {
      let message = "Não foi possível enviar as imagens.";
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") message = "Cada imagem deve ter no máximo 5MB.";
        else if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE")
          message = "Envie no máximo 5 imagens por vez.";
      } else if (err.message) {
        message = err.message;
      }
      return res.status(400).json({ message });
    }

    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) {
      return res.status(400).json({ message: "Nenhuma imagem enviada." });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const urls = files.map((f) => `${baseUrl}/uploads/${f.filename}`);
    res.status(201).json({ urls });
  });
});

export default router;
