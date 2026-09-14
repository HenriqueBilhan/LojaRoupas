import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
const CATEGORIES = [
  { name: "Camisetas", slug: "camisetas" },
  { name: "Calças", slug: "calcas" },
  { name: "Tênis", slug: "tenis" },
  { name: "Shorts", slug: "shorts" },
  { name: "Moletons", slug: "moletons" },
  { name: "Bonés", slug: "bones" },
  { name: "Conjuntos", slug: "conjuntos" },
  {name: "Chinelos", slug: "chinelos"},
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) navigate(`/produtos?search=${encodeURIComponent(search.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-base/95 backdrop-blur border-b border-base-border">
      <div className="bg-accent text-base text-center text-xs font-semibold py-1.5">
        FRETE GRÁTIS PARA TODO BRASIL EM COMPRAS ACIMA DE R$ 299
      </div>

      <div className="container-page flex items-center gap-4 py-4">
        <button
          className="lg:hidden text-ink"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          ☰
        </button>

        <Link to="/" className="h-10 flex items-center">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-6 text-sm text-ink-muted">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/produtos?category=${c.slug}`} className="hover:text-accent transition-colors">
              {c.name}
            </Link>
          ))}
          
        </nav>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm ml-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="input-field text-sm py-2"
          />
        </form>

        <div className="flex items-center gap-4 ml-auto lg:ml-4 text-sm">
          {user ? (
            <div className="relative group">
              <button className="hover:text-accent transition-colors">Olá, {user.name.split(" ")[0]}</button>
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                <div className="bg-base-surface border border-base-border rounded-sm shadow-xl w-44 py-2">
                  <Link to="/conta/pedidos" className="block px-4 py-2 hover:bg-base-border/40">
                    Meus pedidos
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-base-border/40">
                      Painel admin
                    </Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-base-border/40">
                    Sair
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hover:text-accent transition-colors">
              Entrar
            </Link>
          )}

         <Link
  to="/carrinho"
  className="relative flex items-center gap-2 hover:text-accent transition-colors"
>
  <ShoppingCart size={21} />
  <span>Carrinho</span>

  {count > 0 && (
    <span className="absolute -top-2 left-3 bg-accent text-base text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
      {count}
    </span>
  )}
</Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="lg:hidden container-page pb-4 flex flex-col gap-3 text-sm text-ink-muted">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/produtos?category=${c.slug}`} onClick={() => setMenuOpen(false)}>
              {c.name}
            </Link>
          ))}
          <Link to="/politica-de-privacidade" onClick={() => setMenuOpen(false)}>
            Política de Privacidade
          </Link>
        </nav>
      )}
    </header>
  );
}
