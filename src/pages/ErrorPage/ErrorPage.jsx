
import { useRouteError, Link } from "react-router-dom";
import "./ErrorPage.css";

export default function ErrorPage() {
  const error = useRouteError();

  const status = error?.status;
  const message =
    status === 404
      ? "Página não encontrada."
      : error?.statusText || error?.message || "Algo deu errado.";

  return (
    <div className="error-page">
      <span className="error-code">{status ?? "erro"}</span>
      <h1>{message}</h1>
      <p>Volte para a home e tente novamente.</p>
      
      <Link to="/" className="error-link">
        Voltar para a home
      </Link>
    </div>
  );
}