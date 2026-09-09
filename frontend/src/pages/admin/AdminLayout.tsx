import { NavLink, Outlet } from "react-router-dom";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/produtos", label: "Produtos" },
  { to: "/admin/categorias", label: "Categorias" },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/usuarios", label: "Usuários" },
];

export default function AdminLayout() {
  return (
    <div className="container-page py-10 grid lg:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-1">
        <h2 className="font-display text-lg mb-4">PAINEL ADMIN</h2>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-sm text-sm ${
                isActive ? "bg-accent text-base font-semibold" : "text-ink-muted hover:bg-base-surface"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
