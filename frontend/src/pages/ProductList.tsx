import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, Product } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [params] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const featured = params.get("featured") || "";

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (category) query.set("category", category);
    if (search) query.set("search", search);
    if (featured) query.set("featured", featured);
    query.set("limit", "48");

    api
      .get(`/products?${query.toString()}`)
      .then((r) => setProducts(r.data.items))
      .finally(() => setLoading(false));
  }, [category, search, featured]);

  const title = search ? `Resultados para "${search}"` : category ? category.toUpperCase() : "TODOS OS PRODUTOS";

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl mb-8">{title}</h1>

      {loading ? (
        <p className="text-ink-muted">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="text-ink-muted">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
