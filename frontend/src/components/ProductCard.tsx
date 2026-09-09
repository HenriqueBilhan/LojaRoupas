import { Link } from "react-router-dom";
import { Product, formatPrice } from "../api/client";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.comparePriceCents && product.comparePriceCents > product.priceCents;
  const discountPct = hasDiscount
    ? Math.round(100 - (product.priceCents / product.comparePriceCents!) * 100)
    : 0;
  const outOfStock = product.stock <= 0;

  return (
    <Link
      to={`/produto/${product.slug}`}
      className="group block bg-base-surface border border-base-border rounded-sm overflow-hidden hover:border-accent/60 transition-colors"
    >
      <div className="relative aspect-[4/5] bg-[#1F1F22] flex items-center justify-center overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-ink-muted text-xs px-4 text-center">{product.name}</span>
        )}

        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-sale text-white text-[11px] font-bold px-2 py-1 rounded-sm">
            -{discountPct}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-2 right-2 bg-base/90 text-ink-muted text-[11px] font-semibold px-2 py-1 rounded-sm border border-base-border">
            ESGOTADO
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs text-ink-muted uppercase tracking-wide mb-1">
          {product.category?.name || "Produto"}
        </p>
        <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-accent font-semibold">{formatPrice(product.priceCents)}</span>
          {hasDiscount && (
            <span className="text-ink-muted text-xs line-through">
              {formatPrice(product.comparePriceCents!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
