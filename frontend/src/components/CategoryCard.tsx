import { Link } from "react-router-dom";
import { Category } from "../api/client";

// Tons usados quando a categoria ainda não tem foto cadastrada (ver Painel admin > Categorias)
const FALLBACK_GRADIENTS = [
  "from-accent/40 to-base-surface",
  "from-purple-900/50 to-base-surface",
  "from-accent-dark/40 to-base-surface",
  "from-base-border to-base-surface",
];

export default function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <Link
      to={`/produtos?category=${category.slug}`}
      className="group relative aspect-square overflow-hidden rounded-sm border border-base-border hover:border-accent/60 transition-colors"
    >
      {category.imageUrl ? (
        <img
          src={category.imageUrl}
          alt={category.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]} group-hover:scale-110 transition-transform duration-500`}
        />
      )}

      {/* Sombra escura concentrada embaixo, pra ler o nome sobre qualquer foto (clara ou escura) */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      <span className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 font-display text-sm sm:text-[1rem] text-white tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
        {category.name}
      </span>
    </Link>
  );
}
