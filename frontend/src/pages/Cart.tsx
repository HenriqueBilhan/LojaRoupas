import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, totalCents, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-ink-muted mb-4">Faça login para ver seu carrinho.</p>
        <Link to="/login" className="btn-primary">
          Entrar
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-ink-muted mb-4">Seu carrinho está vazio.</p>
        <Link to="/produtos" className="btn-primary">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="font-display text-2xl mb-6">SEU CARRINHO</h1>
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-base-surface border border-base-border rounded-sm p-4">
            <div className="w-20 h-24 bg-[#1F1F22] rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
              {item.product.images?.[0] ? (
                <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-ink-muted px-1 text-center">{item.product.name}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm mb-1">{item.product.name}</p>
              {item.variant?.size && <p className="text-xs text-ink-muted mb-2">Tamanho: {item.variant.size}</p>}
              <p className="text-accent font-semibold">{formatPrice(item.product.priceCents)}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border border-base-border rounded-sm">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 hover:text-accent"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 hover:text-accent"
                  >
                    +
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-xs text-ink-muted hover:text-sale">
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-base-surface border border-base-border rounded-sm p-6 h-fit">
        <h2 className="font-semibold mb-4">Resumo</h2>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ink-muted">Subtotal</span>
          <span>{formatPrice(totalCents)}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-ink-muted">Frete</span>
          <span className="text-accent">Calculado no checkout</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mb-6 border-t border-base-border pt-4">
          <span>Total</span>
          <span>{formatPrice(totalCents)}</span>
        </div>
        <button onClick={() => navigate("/checkout")} className="btn-primary w-full">
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
