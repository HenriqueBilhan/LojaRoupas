import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api, Product, formatPrice } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProductGallery from "../components/ProductGallery";
import ProductCard from "../components/ProductCard";
import { Minus, Plus, ShieldCheck, RefreshCcw, Share2 } from "lucide-react";

const PIX_DISCOUNT = 0.05; // 5% de desconto pagando com Pix
const INSTALLMENTS = 12;

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");
  const [cep, setCep] = useState("");
  const [shippingMsg, setShippingMsg] = useState("");

  useEffect(() => {
    if (!slug) return;
    setProduct(null);
    setQuantity(1);
    setMessage("");
    setShippingMsg("");
    api.get(`/products/${slug}`).then((r) => {
      setProduct(r.data);
      if (r.data.variants?.length) setSelectedVariant(r.data.variants[0].id);
    });
  }, [slug]);

  useEffect(() => {
    if (!product?.category?.slug) {
      setRelated([]);
      return;
    }
    api
      .get(`/products?category=${product.category.slug}&limit=8`)
      .then((r) => setRelated(r.data.items.filter((p: Product) => p.id !== product.id).slice(0, 4)));
  }, [product]);

  async function handleAddToCart() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;
    setAdding(true);
    setMessage("");
    try {
      await addToCart(product.id, selectedVariant, quantity);
      setMessage("Produto adicionado ao carrinho!");
    } catch {
      setMessage("Não foi possível adicionar. Tente novamente.");
    } finally {
      setAdding(false);
    }
  }

  async function handleBuyNow() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;
    setBuying(true);
    setMessage("");
    try {
      await addToCart(product.id, selectedVariant, quantity);
      navigate("/carrinho");
    } catch {
      setMessage("Não foi possível concluir. Tente novamente.");
      setBuying(false);
    }
  }

  function handleCalcularFrete(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}-?\d{3}$/.test(cep.trim())) {
      setShippingMsg("Digite um CEP válido.");
      return;
    }
    setShippingMsg("Frete e prazo de entrega são calculados no carrinho, no próximo passo.");
  }

  async function handleShare() {
    const shareData = { title: product?.name, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* usuário cancelou */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Link copiado!");
    }
  }

  if (!product) {
    return <div className="container-page py-16 text-ink-muted">Carregando...</div>;
  }

  const hasDiscount = product.comparePriceCents && product.comparePriceCents > product.priceCents;
  const pixPriceCents = Math.round(product.priceCents * (1 - PIX_DISCOUNT));
  const installmentCents = Math.round(product.priceCents / INSTALLMENTS);
  const lowStock = product.stock > 0 && product.stock <= 3;
  const outOfStock = product.stock <= 0;

  return (
    <div className="container-page py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-muted mb-6 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:text-accent transition-colors">
          Início
        </Link>
        {product.category && (
          <>
            <span>›</span>
            <Link
              to={`/produtos?category=${product.category.slug}`}
              className="hover:text-accent transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>›</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs text-ink-muted uppercase tracking-wide mb-2">
            {product.category?.name || "Produto"}
          </p>
          <h1 className="font-display text-2xl mb-4">{product.name}</h1>

          {/* Preço */}
          <div className="mb-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold">{formatPrice(product.priceCents)}</span>
              {hasDiscount && (
                <span className="text-ink-muted line-through">{formatPrice(product.comparePriceCents!)}</span>
              )}
            </div>
            <p className="text-accent font-medium mt-1">
              {formatPrice(pixPriceCents)} <span className="font-normal">com Pix</span>
            </p>
          </div>

          <p className="text-sm text-ink-muted mb-1">
            {INSTALLMENTS}x de {formatPrice(installmentCents)}
          </p>
          <p className="text-xs text-ink-muted mb-6">
            {Math.round(PIX_DISCOUNT * 100)}% de desconto pagando com Pix · não acumulável com outras promoções
          </p>

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

          {lowStock && (
            <p className="text-sale text-sm font-semibold mb-4">
              Atenção, restam apenas {product.stock} {product.stock === 1 ? "peça" : "peças"}!
            </p>
          )}

          {/* Quantidade + Comprar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex items-center border border-base-border rounded-sm w-fit">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={outOfStock}
                aria-label="Diminuir quantidade"
                className="w-10 h-11 flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                disabled={outOfStock}
                aria-label="Aumentar quantidade"
                className="w-10 h-11 flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={buying || adding || outOfStock}
              className="btn-primary flex-1 sm:flex-none sm:px-10"
            >
              {outOfStock ? "Esgotado" : buying ? "Processando..." : "Comprar"}
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || buying || outOfStock}
            className="btn-outline w-full sm:w-auto mb-2"
          >
            {adding ? "Adicionando..." : "Adicionar ao carrinho"}
          </button>

          {message && <p className="text-sm text-ink-muted mb-4">{message}</p>}

          {/* Selos de confiança */}
          <div className="mt-6 space-y-4 border-t border-base-border pt-6">
            <div className="flex gap-3">
              <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Compra protegida</p>
                <p className="text-xs text-ink-muted">Seus dados cuidados durante toda a compra.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <RefreshCcw size={20} className="text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Trocas e devoluções</p>
                <p className="text-xs text-ink-muted">Se não gostar, você pode trocar ou devolver.</p>
              </div>
            </div>
          </div>

          {/* Calcular frete */}
          <div className="mt-6 border-t border-base-border pt-6">
            <p className="text-sm font-semibold mb-2">Meios de envio</p>
            <form onSubmit={handleCalcularFrete} className="flex gap-2 max-w-sm">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Seu CEP"
                className="input-field py-2 text-sm"
              />
              <button type="submit" className="btn-outline px-4 py-2 text-sm whitespace-nowrap">
                Calcular
              </button>
            </form>
            {shippingMsg && <p className="text-xs text-ink-muted mt-2">{shippingMsg}</p>}
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-accent hover:underline inline-block mt-2"
            >
              Não sei meu CEP
            </a>
          </div>

          {/* Compartilhar */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-xs text-ink-muted hover:text-accent transition-colors mt-6"
          >
            <Share2 size={16} />
            Compartilhar
          </button>
        </div>
      </div>

      {/* Produtos similares */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl mb-6">PRODUTOS SIMILARES</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
