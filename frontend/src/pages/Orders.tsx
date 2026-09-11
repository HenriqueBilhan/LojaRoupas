import { useEffect, useState } from "react";
import { api, formatPrice } from "../api/client";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
};

// Só pode cancelar enquanto o pedido ainda não foi enviado/entregue
const CANCELABLE_STATUSES = ["pending", "paid"];

interface OrderItem {
  id: string;
  productName: string;
  size?: string;
  unitPriceCents: number;
  quantity: number;
}

interface OrderData {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .get("/orders/my")
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(orderId: string) {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) return;
    setCancelingId(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      // Remove o pedido cancelado da lista imediatamente
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Não foi possível cancelar o pedido.");
    } finally {
      setCancelingId(null);
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl mb-8">MEUS PEDIDOS</h1>

      {loading ? (
        <p className="text-ink-muted">Carregando...</p>
      ) : orders.length === 0 ? (
        <p className="text-ink-muted">Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-base-surface border border-base-border rounded-sm p-5">
              <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <div>
                  <p className="text-sm text-ink-muted">Pedido #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-ink-muted">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full border border-accent text-accent">
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-ink-muted">
                    {item.quantity}x {item.productName} {item.size ? `(${item.size})` : ""}
                  </p>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{formatPrice(order.totalCents)}</p>
                {CANCELABLE_STATUSES.includes(order.status) && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={cancelingId === order.id}
                    className="text-xs font-semibold text-red-600 border border-red-600 rounded-full px-3 py-1 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {cancelingId === order.id ? "Cancelando..." : "Cancelar pedido"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
