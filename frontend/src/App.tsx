import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import { RequireAuth, RequireAdmin } from "./components/ProtectedRoute";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/produtos"
              element={
                <Layout>
                  <ProductList />
                </Layout>
              }
            />
            <Route
              path="/produto/:slug"
              element={
                <Layout>
                  <ProductDetail />
                </Layout>
              }
            />
            <Route
              path="/carrinho"
              element={
                <Layout>
                  <Cart />
                </Layout>
              }
            />
            <Route
              path="/checkout"
              element={
                <Layout>
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/registrar"
              element={
                <Layout>
                  <Register />
                </Layout>
              }
            />
            <Route
              path="/conta/pedidos"
              element={
                <Layout>
                  <RequireAuth>
                    <Orders />
                  </RequireAuth>
                </Layout>
              }
            />

            <Route
              path="/admin"
              element={
                <Layout>
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                </Layout>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="produtos" element={<AdminProducts />} />
              <Route path="categorias" element={<AdminCategories />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="usuarios" element={<AdminUsers />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
