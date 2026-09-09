import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, CartItem } from "../api/client";
import { useAuth } from "./AuthContext";

interface CartContextValue {
  items: CartItem[];
  loading: boolean;
  count: number;
  totalCents: number;
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function addToCart(productId: string, variantId?: string, quantity = 1) {
    await api.post("/cart", { productId, variantId, quantity });
    await refresh();
  }

  async function updateQuantity(itemId: string, quantity: number) {
    await api.put(`/cart/${itemId}`, { quantity });
    await refresh();
  }

  async function removeItem(itemId: string) {
    await api.delete(`/cart/${itemId}`);
    await refresh();
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + i.quantity * i.product.priceCents, 0);

  return (
    <CartContext.Provider value={{ items, loading, count, totalCents, addToCart, updateQuantity, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return ctx;
}
