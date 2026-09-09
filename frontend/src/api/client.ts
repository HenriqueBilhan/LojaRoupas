import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("loja_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  children?: Category[];
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  comparePriceCents?: number;
  images: string[];
  stock: number;
  isFeatured: boolean;
  category?: Category;
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
