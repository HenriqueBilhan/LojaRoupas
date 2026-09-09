import { useEffect, useState } from "react";
import { api, formatPrice } from "../../api/client";

const STATUS_OPTIONS = ["pending", "paid", "shipped", "delivered", "canceled"];
const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
};

interface OrderRow {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string;
  user?: { name: string; email: string };
  items: { id: string; productName: string; quantity: number }[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  async function load() {
    const { data } = await api.get("/orders");
    setOrders(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await api.put(`/orders/${id}/status`, { status });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">PEDIDOS</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-base-surface border border-base-border rounded-sm p-4">
            <div className="flex flex-wrap justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-medium">#{order.id.slice(0, 8)}</p>
                <p className="text-xs text-ink-muted">
                  {order.user?.name || "Cliente removido"} · {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="input-field py-1 text-sm w-auto"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-ink-muted mb-1">
              {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ")}
            </p>
            <p className="font-semibold text-accent">{formatPrice(order.totalCents)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
