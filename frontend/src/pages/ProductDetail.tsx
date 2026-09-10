import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Product, formatPrice } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProductGallery from "../components/ProductGallery";

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!slug) return;
    api.get(`/products/${slug}`).then((r) => {
      setProduct(r.data);
      if (r.data.variants?.length) setSelectedVariant(r.data.variants[0].id);
    });
  }, [slug]);

  async function handleAddToCart() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;
    setAdding(true);
    setMessage("");
    try {
      await addToCart(product.id, selectedVariant, 1);
      setMessage("Produto adicionado ao carrinho!");
    } catch {
      setMessage("Não foi possível adicionar. Tente novamente.");
    } finally {
      setAdding(false);
    }
  }

  if (!product) {
    return <div className="container-page py-16 text-ink-muted">Carregando...</div>;
  }

  const hasDiscount = product.comparePriceCents && product.comparePriceCents > product.priceCents;

  return (
    <div className="container-page py-10 grid lg:grid-cols-2 gap-10">
      <ProductGallery images={product.images} name={product.name} />

      <div>
        <p className="text-xs text-ink-muted uppercase tracking-wide mb-2">
          {product.category?.name || "Produto"}
        </p>
        <h1 className="font-display text-2xl mb-4">{product.name}</h1>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-accent text-2xl font-semibold">{formatPrice(product.priceCents)}</span>
          {hasDiscount && (
            <span className="text-ink-muted line-through">{formatPrice(product.comparePriceCents!)}</span>
          )}
        </div>

        {product.description && (
          <p className="text-ink-muted leading-relaxed mb-6">{product.description}</p>
        )}

        {product.variants?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold mb-2">Tamanho</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  disabled={v.stock <= 0}
                  className={`px-4 py-2 text-sm border rounded-sm transition-colors ${
                    selectedVariant === v.id
                      ? "border-accent text-accent"
                      : "border-base-border text-ink-muted hover:border-ink"
                  } ${v.stock <= 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleAddToCart} disabled={adding || product.stock <= 0} className="btn-primary w-full sm:w-auto">
          {product.stock <= 0 ? "Esgotado" : adding ? "Adicionando..." : "Adicionar ao carrinho"}
        </button>

        {message && <p className="text-sm text-ink-muted mt-3">{message}</p>}
      </div>
    </div>
  );
}
