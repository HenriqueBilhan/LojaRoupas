import { useEffect, useState } from "react";
import { api, Category } from "../../api/client";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await api.get("/categories");
    setCategories(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/categories", { name, description });
      setName("");
      setDescription("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta categoria?")) return;
    await api.delete(`/categories/${id}`);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">CATEGORIAS</h1>

      <form onSubmit={handleSubmit} className="bg-base-surface border border-base-border rounded-sm p-6 mb-8 flex flex-col sm:flex-row gap-4">
        <input required placeholder="Nome da categoria" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Descrição (opcional)" className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit" disabled={saving} className="btn-primary whitespace-nowrap">
          {saving ? "Salvando..." : "Adicionar"}
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-base-surface border border-base-border rounded-sm p-4">
            <div>
              <p className="font-medium text-sm">{c.name}</p>
              {c.description && <p className="text-xs text-ink-muted">{c.description}</p>}
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-sale text-sm hover:underline">
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
