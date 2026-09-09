import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, Product, Category } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get("/products?featured=true&limit=8").then((r) => setFeatured(r.data.items));
    api.get("/products?limit=12").then((r) => setRecent(r.data.items));
    api.get("/categories").then((r) => setCategories(r.data));
  }, []);

  return (
    <div>
      <section className="border-b border-base-border">
        <div className="container-page py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-accent text-sm font-semibold tracking-wide mb-4">NOVA COLEÇÃO</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
              STREETWEAR
              <br />
              SEM FILTRO
            </h1>
            <p className="text-ink-muted max-w-md mb-8">
              Peças pensadas pra rua: conforto, atitude e aquele drip que ninguém tem igual.
              Envio rápido pra todo o Brasil.
            </p>
            <div className="flex gap-4">
              <Link to="/produtos" className="btn-primary">
                Ver produtos
              </Link>
              <Link to="/produtos?category=camisetas" className="btn-outline">
                Camisetas
              </Link>
            </div>
          </div>
          <div className="aspect-square bg-base-surface border border-base-border rounded-sm flex items-center justify-center p-12">
            <img src="/logo.png" alt="JW" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="container-page py-12">
          <h2 className="font-display text-xl mb-6">CATEGORIAS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((c) => (
              <Link
                key={c.id}
                to={`/produtos?category=${c.slug}`}
                className="bg-base-surface border border-base-border rounded-sm py-8 text-center hover:border-accent transition-colors"
              >
                <span className="text-sm font-medium">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="container-page py-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-xl">DESTAQUES</h2>
            <Link to="/produtos?featured=true" className="text-sm text-accent hover:underline">
              Ver tudo
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="container-page py-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-xl">NOVIDADES</h2>
            <Link to="/produtos" className="text-sm text-accent hover:underline">
              Ver tudo
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recent.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
