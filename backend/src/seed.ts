import "reflect-metadata";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { AppDataSource } from "./data-source";
import { User, UserRole } from "./entities/User";
import { Category } from "./entities/Category";
import { Product } from "./entities/Product";
import { ProductVariant } from "./entities/ProductVariant";
import { slugify } from "./utils/slugify";

dotenv.config();

async function seed() {
  await AppDataSource.initialize();
  console.log("📦 Conectado ao banco. Iniciando seed...");

  const userRepo = AppDataSource.getRepository(User);
  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo = AppDataSource.getRepository(Product);

  // 1) Usuário admin
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@loja.com").toLowerCase();
  let admin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!admin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 10);
    admin = userRepo.create({
      name: process.env.ADMIN_NAME || "Administrador",
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log(`✅ Admin criado: ${adminEmail}`);
  } else {
    console.log("ℹ️  Admin já existe, pulando.");
  }

  // 2) Categorias
  // As imageUrl abaixo são fotos de banco (Unsplash) só pra loja não ficar sem foto —
  // troque pelas fotos reais dos produtos em Painel admin > Categorias quando quiser.
  const categoriesData = [
    {
      name: "Camisetas",
      description: "Camisetas premium, oversized e básicas",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=70",
    },
    {
      name: "Calças",
      description: "Jeans, cargo e moletom",
      imageUrl: "https://images.unsplash.com/photo-1515459961680-58264ee27219?auto=format&fit=crop&w=600&q=70",
    },
    {
      name: "Tênis",
      description: "Os tênis mais desejados do streetwear",
      imageUrl: "https://images.unsplash.com/photo-1676379827610-c380c52db0c6?auto=format&fit=crop&w=600&q=70",
    },
    {
      name: "Shorts",
      description: "Shorts tactel, moletom e cargo",
      imageUrl: "https://images.unsplash.com/photo-1558631098-8235a5cd982c?auto=format&fit=crop&w=600&q=70",
    },
    {
      name: "Moletons",
      description: "Moletons canguru, careca e ziper",
      imageUrl: "https://images.unsplash.com/photo-1587930658880-481927aafb00?auto=format&fit=crop&w=600&q=70",
    },
    {
      name: "Bonés",
      description: "Bonés e acessórios pra completar o fit",
      imageUrl: "https://images.unsplash.com/photo-1691256676359-20e5c6d4bc92?auto=format&fit=crop&w=600&q=70",
    },
    {
      name: "Conjuntos",
      description: "Conjuntos completos moletom e verão",
      imageUrl: "https://images.unsplash.com/photo-1522897355400-c4fdec73d979?auto=format&fit=crop&w=600&q=70",
    },
    {
      name: "Acessórios",
      description: "Óculos, correntes, bolsas e mais",
      imageUrl: "https://images.unsplash.com/photo-1563122833-352e87c29410?auto=format&fit=crop&w=600&q=70",
    },
  ];

  const categories: Record<string, Category> = {};
  for (const [i, c] of categoriesData.entries()) {
    let cat = await categoryRepo.findOne({ where: { slug: slugify(c.name) } });
    if (!cat) {
      cat = categoryRepo.create({
        name: c.name,
        slug: slugify(c.name),
        description: c.description,
        imageUrl: c.imageUrl,
        sortOrder: i,
      });
      await categoryRepo.save(cat);
    } else if (!cat.imageUrl) {
      // Categoria já existia de um seed anterior (sem foto) — completa com a foto padrão
      cat.imageUrl = c.imageUrl;
      await categoryRepo.save(cat);
    }
    categories[c.name] = cat;
  }
  console.log(`✅ ${categoriesData.length} categorias prontas.`);

  // 3) Produtos de exemplo (conteúdo genérico/ilustrativo)
  const existingCount = await productRepo.count();
  if (existingCount === 0) {
    const productsData = [
      { name: "Camiseta Oversized Essencial - Preta", price: 79.9, compare: 99.9, cat: "Camisetas", sizes: ["P", "M", "G", "GG"] },
      { name: "Camiseta Oversized Essencial - Branca", price: 79.9, compare: undefined, cat: "Camisetas", sizes: ["P", "M", "G", "GG"] },
      { name: "Camiseta Dri-Fit Pro - Vermelha", price: 99.9, compare: undefined, cat: "Camisetas", sizes: ["P", "M", "G"] },
      { name: "Calça Jeans Skinny - Preta", price: 199.9, compare: undefined, cat: "Calças", sizes: ["38", "40", "42", "44"] },
      { name: "Calça Cargo Ripstop - Caqui", price: 179.9, compare: 229.9, cat: "Calças", sizes: ["38", "40", "42"] },
      { name: "Tênis Street Runner - Branco", price: 259.9, compare: 299.9, cat: "Tênis", sizes: ["38", "39", "40", "41", "42"] },
      { name: "Tênis Urban Classic - Preto", price: 279.9, compare: undefined, cat: "Tênis", sizes: ["38", "39", "40", "41", "42", "43"] },
      { name: "Shorts Tactel Training - Cinza", price: 89.9, compare: undefined, cat: "Shorts", sizes: ["P", "M", "G", "GG"] },
      { name: "Shorts Cargo Ripstop - Verde", price: 99.9, compare: 129.9, cat: "Shorts", sizes: ["P", "M", "G"] },
      { name: "Moletom Canguru Essential - Preto", price: 219.9, compare: undefined, cat: "Moletons", sizes: ["P", "M", "G", "GG"] },
      { name: "Moletom Careca Icon - Cinza", price: 179.9, compare: 219.9, cat: "Moletons", sizes: ["P", "M", "G"] },
      { name: "Boné Street Classic - Preto", price: 59.9, compare: 79.9, cat: "Bonés", sizes: ["Único"] },
      { name: "Boné Aba Reta Logo - Branco", price: 54.9, compare: undefined, cat: "Bonés", sizes: ["Único"] },
      { name: "Conjunto Moletom Duo - Azul", price: 299.9, compare: 349.9, cat: "Conjuntos", sizes: ["P", "M", "G", "GG"] },
      { name: "Óculos Street Vision - Preto", price: 69.9, compare: undefined, cat: "Acessórios", sizes: ["Único"] },
    ];

    for (const p of productsData) {
      const product = productRepo.create({
        name: p.name,
        slug: `${slugify(p.name)}-${Math.random().toString(36).slice(2, 7)}`,
        description: `${p.name} — peça de alta qualidade, confortável e feita para o dia a dia. Confira as opções de tamanho disponíveis.`,
        priceCents: Math.round(p.price * 100),
        comparePriceCents: p.compare ? Math.round(p.compare * 100) : undefined,
        images: [],
        stock: 50,
        isActive: true,
        isFeatured: Math.random() > 0.6,
        categoryId: categories[p.cat].id,
        variants: p.sizes.map((size) =>
          Object.assign(new ProductVariant(), { size, stock: 15 })
        ),
      });
      await productRepo.save(product);
    }
    console.log(`✅ ${productsData.length} produtos de exemplo criados.`);
  } else {
    console.log("ℹ️  Já existem produtos no banco, pulando criação de exemplos.");
  }

  console.log("🎉 Seed finalizado com sucesso!");
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("Erro ao rodar o seed:", err);
  process.exit(1);
});
