import { useEffect, useState } from "react";
import { api, Product, Category, formatPrice } from "../../api/client";

const emptyForm = {
  name: "",
  description: "",
  priceCents: 0,
  comparePriceCents: undefined as number | undefined,
  categoryId: "",
  stock: 0,
  isFeatured: false,
  images: [] as string[],
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const [p, c] = await Promise.all([api.get("/products?limit=100"), api.get("/categories")]);
    setProducts(p.data.items);
    setCategories(c.data);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      priceCents: p.priceCents,
      comparePriceCents: p.comparePriceCents,
      categoryId: p.category?.id || "",
      stock: p.stock,
      isFeatured: p.isFeatured,
      images: p.images || [],
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post("/products", form);
      }
      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este produto?")) return;
    await api.delete(`/products/${id}`);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">PRODUTOS</h1>

      <form onSubmit={handleSubmit} className="bg-base-surface border border-base-border rounded-sm p-6 mb-8 grid sm:grid-cols-2 gap-4">
        <input required placeholder="Nome do produto" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="input-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
          <option value="">Selecione a categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          placeholder="Preço (R$)"
          className="input-field"
          value={form.priceCents ? form.priceCents / 100 : ""}
          onChange={(e) => setForm({ ...form, priceCents: Math.round(Number(e.target.value) * 100) })}
        />
        <input
          type="number"
          placeholder="Preço antigo / de comparação (opcional)"
          className="input-field"
          value={form.comparePriceCents ? form.comparePriceCents / 100 : ""}
          onChange={(e) =>
            setForm({ ...form, comparePriceCents: e.target.value ? Math.round(Number(e.target.value) * 100) : undefined })
          }
        />
        <input
          type="number"
          placeholder="Estoque"
          className="input-field"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        />
        <input
          placeholder="URL da imagem (opcional)"
          className="input-field"
          value={form.images[0] || ""}
          onChange={(e) => setForm({ ...form, images: e.target.value ? [e.target.value] : [] })}
        />
        <textarea
          placeholder="Descrição"
          className="input-field sm:col-span-2"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          Produto em destaque
        </label>

        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Criar produto"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-outline">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-base-surface border border-base-border rounded-sm p-4">
            <div>
              <p className="font-medium text-sm">{p.name}</p>
              <p className="text-xs text-ink-muted">
                {formatPrice(p.priceCents)} · Estoque: {p.stock} · {p.category?.name || "Sem categoria"}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => startEdit(p)} className="text-accent hover:underline">
                Editar
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-sale hover:underline">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
