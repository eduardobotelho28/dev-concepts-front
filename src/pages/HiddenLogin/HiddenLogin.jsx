
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HiddenLogin.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function HiddenLogin() {

  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("A senha é obrigatória.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        setError(data.message || "Não foi possível autenticar.");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      navigate("/", { replace: true });
    } catch {
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hidden-login">

      <form onSubmit={handleSubmit} className="hidden-login-form" noValidate>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoFocus
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

    </div>
  );
}