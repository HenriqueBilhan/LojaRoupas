import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="font-display text-2xl mb-8 text-center">ENTRAR</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sale text-sm">{error}</p>}
        <input required type="email" placeholder="E-mail" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Senha" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="text-sm text-ink-muted text-center mt-6">
        Não tem conta?{" "}
        <Link to="/registrar" className="text-accent hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
