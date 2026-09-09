import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Não foi possível criar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="font-display text-2xl mb-8 text-center">CRIAR CONTA</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sale text-sm">{error}</p>}
        <input required placeholder="Nome completo" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
        <input required type="email" placeholder="E-mail" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Senha (mín. 6 caracteres)" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
      <p className="text-sm text-ink-muted text-center mt-6">
        Já tem conta?{" "}
        <Link to="/login" className="text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
