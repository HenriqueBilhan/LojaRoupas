import { useEffect, useState } from "react";
import { api, Product, Category, formatPrice } from "../../api/client";

const MAX_IMAGES = 5;

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
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

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
    setImageError("");
  }

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // permite selecionar o mesmo arquivo de novo depois
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - form.images.length;
    if (remaining <= 0) {
      setImageError(`Você já tem ${MAX_IMAGES} fotos. Remova alguma para adicionar outra.`);
      return;
    }

    const toUpload = files.slice(0, remaining);
    if (files.length > remaining) {
      setImageError(`Só dá pra adicionar mais ${remaining} foto(s) (máximo ${MAX_IMAGES}). As demais foram ignoradas.`);
    } else {
      setImageError("");
    }

    const formData = new FormData();
    toUpload.forEach((file) => formData.append("images", file));

    setUploading(true);
    try {
      const { data } = await api.post("/uploads", formData);
      setForm((f) => ({ ...f, images: [...f.images, ...data.urls] }));
    } catch (err: any) {
      setImageError(err?.response?.data?.message || "Falha ao enviar as imagens.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
    setImageError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.images.length === 0) {
      setImageError("Adicione pelo menos 1 foto do produto.");
      return;
    }
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
        <div className="sm:col-span-2">
          <p className="text-sm text-ink-muted mb-2">
            Fotos do produto ({form.images.length}/{MAX_IMAGES}) — envie de 1 a {MAX_IMAGES}, JPG/PNG/WEBP até 5MB cada
          </p>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url, i) => (
              <div key={url + i} className="relative w-20 h-20 rounded-sm overflow-hidden border border-base-border group">
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Remover foto"
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-sale transition-colors"
                >
                  ×
                </button>
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] text-center py-0.5">
                    capa
                  </span>
                )}
              </div>
            ))}

            {form.images.length < MAX_IMAGES && (
              <label className="w-20 h-20 rounded-sm border border-dashed border-base-border hover:border-accent flex items-center justify-center text-ink-muted hover:text-accent text-xs cursor-pointer transition-colors text-center px-1">
                {uploading ? "Enviando..." : "+ Adicionar"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  disabled={uploading}
                  onChange={handleFilesSelected}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {imageError && <p className="text-sale text-xs mt-2">{imageError}</p>}
        </div>
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
