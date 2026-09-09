import { useEffect, useState } from "react";
import { api } from "../../api/client";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);

  async function load() {
    const { data } = await api.get("/admin/users");
    setUsers(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRole(user: UserRow) {
    const newRole = user.role === "admin" ? "customer" : "admin";
    await api.put(`/admin/users/${user.id}/role`, { role: newRole });
    await load();
  }

  async function toggleActive(user: UserRow) {
    await api.put(`/admin/users/${user.id}/status`, { isActive: !user.isActive });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">USUÁRIOS CADASTRADOS</h1>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 bg-base-surface border border-base-border rounded-sm p-4">
            <div>
              <p className="font-medium text-sm">
                {u.name} {u.role === "admin" && <span className="text-accent text-xs ml-1">(admin)</span>}
              </p>
              <p className="text-xs text-ink-muted">
                {u.email} · Cadastrado em {new Date(u.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => toggleRole(u)} className="text-accent hover:underline">
                {u.role === "admin" ? "Remover admin" : "Tornar admin"}
              </button>
              <button onClick={() => toggleActive(u)} className={u.isActive ? "text-sale hover:underline" : "text-ink-muted hover:underline"}>
                {u.isActive ? "Desativar" : "Ativar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
