import { useEffect, useState } from "react";
import { api, formatPrice } from "../../api/client";

interface Metrics {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenueCents: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((r) => setMetrics(r.data));
  }, []);

  const cards = metrics
    ? [
        { label: "Pedidos", value: metrics.totalOrders },
        { label: "Usuários", value: metrics.totalUsers },
        { label: "Produtos", value: metrics.totalProducts },
        { label: "Faturamento", value: formatPrice(metrics.totalRevenueCents) },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">DASHBOARD</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-base-surface border border-base-border rounded-sm p-6">
            <p className="text-sm text-ink-muted mb-2">{c.label}</p>
            <p className="text-2xl font-semibold text-accent">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
