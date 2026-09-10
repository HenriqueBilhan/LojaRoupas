import { useEffect, useState } from "react";
import { api, Category } from "../../api/client";

// Upload de uma única foto (capa do quadradinho de categoria na home)
function CategoryImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite selecionar o mesmo arquivo de novo depois
    if (!file) return;

    const formData = new FormData();
    formData.append("images", file);

    setUploading(true);
    setError("");
    try {
      const { data } = await api.post("/uploads", formData);
      onChange(data.urls[0]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha ao enviar a foto.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="shrink-0">
      <div className="flex items-center gap-2">
        <div className="relative w-14 h-14 rounded-sm overflow-hidden border border-base-border bg-base shrink-0">
          {value ? (
            <img src={value} alt="Capa da categoria" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-muted text-[9px] text-center px-1">
              sem foto
            </div>
          )}
        </div>
        <label className="text-xs text-accent hover:underline cursor-pointer whitespace-nowrap">
          {uploading ? "Enviando..." : value ? "Trocar foto" : "+ Adicionar foto"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            onChange={handleFile}
            className="hidden"
          />
        </label>
        {value && !uploading && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-sale hover:underline whitespace-nowrap">
            Remover
          </button>
        )}
      </div>
      {error && <p className="text-sale text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", imageUrl: "" });
  const [editSaving, setEditSaving] = useState(false);

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
      await api.post("/categories", { name, description, imageUrl: imageUrl || undefined });
      setName("");
      setDescription("");
      setImageUrl("");
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

  function startEdit(c: Category) {
    setEditingId(c.id);
    setEditForm({ name: c.name, description: c.description || "", imageUrl: c.imageUrl || "" });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleEditSubmit(e: React.FormEvent, id: string) {
    e.preventDefault();
    setEditSaving(true);
    try {
      await api.put(`/categories/${id}`, {
        name: editForm.name,
        description: editForm.description || undefined,
        imageUrl: editForm.imageUrl || undefined,
      });
      setEditingId(null);
      await load();
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">CATEGORIAS</h1>

      <form onSubmit={handleSubmit} className="bg-base-surface border border-base-border rounded-sm p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <input required placeholder="Nome da categoria" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Descrição (opcional)" className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} />
        <CategoryImageUploader value={imageUrl} onChange={setImageUrl} />
        <button type="submit" disabled={saving} className="btn-primary whitespace-nowrap">
          {saving ? "Salvando..." : "Adicionar"}
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((c) =>
          editingId === c.id ? (
            <form
              key={c.id}
              onSubmit={(e) => handleEditSubmit(e, c.id)}
              className="bg-base-surface border border-accent/60 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <input
                required
                placeholder="Nome"
                className="input-field"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <input
                placeholder="Descrição"
                className="input-field"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
              <CategoryImageUploader
                value={editForm.imageUrl}
                onChange={(url) => setEditForm({ ...editForm, imageUrl: url })}
              />
              <div className="flex gap-2 shrink-0">
                <button type="submit" disabled={editSaving} className="btn-primary whitespace-nowrap">
                  {editSaving ? "Salvando..." : "Salvar"}
                </button>
                <button type="button" onClick={cancelEdit} className="btn-outline whitespace-nowrap">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div key={c.id} className="flex items-center gap-4 bg-base-surface border border-base-border rounded-sm p-4">
              <div className="w-14 h-14 rounded-sm overflow-hidden bg-base border border-base-border shrink-0">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-muted text-[10px] text-center px-1">
                    sem foto
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{c.name}</p>
                {c.description && <p className="text-xs text-ink-muted">{c.description}</p>}
              </div>
              <button onClick={() => startEdit(c)} className="text-accent text-sm hover:underline shrink-0">
                Editar
              </button>
              <button onClick={() => handleDelete(c.id)} className="text-sale text-sm hover:underline shrink-0">
                Excluir
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
