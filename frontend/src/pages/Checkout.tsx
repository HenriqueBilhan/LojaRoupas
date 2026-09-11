import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatPrice } from "../api/client";
import { useCart } from "../context/CartContext";
import { fetchAddressByCep } from "../services/viacep";

export default function Checkout() {
  const { items, totalCents, refresh } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    recipientName: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  function updateField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  useEffect(() => {
    const digits = form.zipCode.replace(/\D/g, "");
    if (digits.length !== 8) {
      setCepError("");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setCepLoading(true);
      setCepError("");
      try {
        const address = await fetchAddressByCep(digits, controller.signal);
        if (!address) {
          setCepError("CEP não encontrado. Preencha o endereço manualmente.");
          return;
        }
        setForm((f) => ({
          ...f,
          street: address.logradouro,
          neighborhood: address.bairro,
          city: address.localidade,
          state: address.uf,
        }));
      } catch (err: any) {
        if (axios.isCancel(err) || err?.code === "ERR_CANCELED") return;
        setCepError("Não foi possível buscar o CEP. Preencha manualmente.");
      } finally {
        setCepLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.zipCode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/orders", { shippingAddress: form, paymentMethod });
      await refresh();
      navigate(`/conta/pedidos?novo=${data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao finalizar pedido.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <div className="container-page py-16 text-center text-ink-muted">Seu carrinho está vazio.</div>;
  }

  return (
    <div className="container-page py-10 grid lg:grid-cols-3 gap-10">
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
        <h1 className="font-display text-2xl mb-6">ENDEREÇO DE ENTREGA</h1>

        {error && <p className="text-sale text-sm">{error}</p>}

        <input required placeholder="Nome do destinatário" className="input-field" value={form.recipientName} onChange={(e) => updateField("recipientName", e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="CEP" className="input-field" value={form.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} />
          <input required placeholder="Número" className="input-field" value={form.number} onChange={(e) => updateField("number", e.target.value)} />
        </div>
        {cepLoading && <p className="text-ink-muted text-xs">Buscando endereço...</p>}
        {cepError && <p className="text-sale text-xs">{cepError}</p>}
        <input required placeholder="Rua" className="input-field" value={form.street} onChange={(e) => updateField("street", e.target.value)} />
        <input placeholder="Complemento (opcional)" className="input-field" value={form.complement} onChange={(e) => updateField("complement", e.target.value)} />
        <input required placeholder="Bairro" className="input-field" value={form.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="Cidade" className="input-field" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
          <input required maxLength={2} placeholder="UF" className="input-field" value={form.state} onChange={(e) => updateField("state", e.target.value.toUpperCase())} />
        </div>

        <div>
          <p className="text-sm font-semibold mb-2 mt-6">Forma de pagamento</p>
          <div className="flex gap-3">
            {[
              { id: "pix", label: "Pix" },
              { id: "credit_card", label: "Cartão" },
              { id: "boleto", label: "Boleto" },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setPaymentMethod(opt.id)}
                className={`px-4 py-2 text-sm border rounded-sm ${
                  paymentMethod === opt.id ? "border-accent text-accent" : "border-base-border text-ink-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto mt-6">
          {loading ? "Processando..." : "Confirmar pedido"}
        </button>
      </form>

      <div className="bg-base-surface border border-base-border rounded-sm p-6 h-fit">
        <h2 className="font-semibold mb-4">Resumo do pedido</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span className="text-ink-muted">
              {item.quantity}x {item.product.name}
            </span>
            <span>{formatPrice(item.product.priceCents * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-lg mt-4 border-t border-base-border pt-4">
          <span>Total</span>
          <span>{formatPrice(totalCents)}</span>
        </div>
      </div>
    </div>
  );
}
