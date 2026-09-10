import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, Product, Category } from "../api/client";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import HeroCarousel from "../components/HeroCarousel";

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
      <HeroCarousel />

      {categories.length > 0 && (
        <section className="container-page py-12">
          <h2 className="font-display text-xl mb-6">CATEGORIAS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((c, i) => (
              <CategoryCard key={c.id} category={c} index={i} />
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
