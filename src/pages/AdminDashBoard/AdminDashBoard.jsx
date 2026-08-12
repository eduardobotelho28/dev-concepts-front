
import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../utils/apiClient";
import "./AdminDashBoard.css";
import { replace, useNavigate } from "react-router-dom";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashBoard() {

  const navigate = useNavigate();

  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });

  const [deletingId, setDeletingId] = useState(null);

  const loadConcepts = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);

    const res = await apiFetch(`api/concepts?${params.toString()}`);

    if (!res.ok) {
      setError(res.data.message || "Não foi possível carregar os conceitos.");
      setLoading(false);
      return;
    }

    setConcepts(res.data.data);
    setMeta({ current_page: res.data.current_page, last_page: res.data.last_page });
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    loadConcepts();
  }, [loadConcepts]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function handleDelete(id) {
    if (!window.confirm("Excluir este conceito? Essa ação não pode ser desfeita.")) {
      return;
    }

    setDeletingId(id);

    const res = await apiFetch(`api/concepts/${id}`, { method: "DELETE" });

    if (!res.ok) {
      setError(res.data.message || "Não foi possível excluir o conceito.");
      setDeletingId(null);
      return;
    }

    setConcepts((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  }

  return (

    <div className="admin-dashboard">
      <div className="dashboard-header">

        <h1>Conceitos</h1>

        <div className="search-container">

          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>

          <button
            onClick={() => {
              setPage(1)
              setSearchInput("")
              setSearch("")
            }}
            className="clean-button"
          >
            Limpar
          </button>
          
        </div>

        <button className="new-concept-button" onClick={() => navigate("/admin/new", { replace: true })}>Novo Conceito +

        </button>

      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : concepts.length === 0 ? (
        <p>Nenhum conceito encontrado.</p>
      ) : (
        <div className="concept-grid">
          {concepts.map((concept) => (
            <div className="concept-card" key={concept.id}>
              <div className="concept-card-image">
                {concept.image_path ? (
                  <img
                    src={`${STORAGE_URL}${concept.image_path}`}
                    alt={concept.title}
                  />
                ) : (
                  <div className="concept-card-placeholder" />
                )}
              </div>
              <div className="concept-card-body">
                <h2>{concept.title}</h2>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(concept.id)}
                  disabled={deletingId === concept.id}
                >
                  {deletingId === concept.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta.last_page > 1 && (
        <div className="pagination">

          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={meta.current_page === 1}
          >
            Anterior
          </button>

          <span>
            Página {meta.current_page} de {meta.last_page}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
            disabled={meta.current_page === meta.last_page}
          >
            Próxima
          </button>

        </div>
      )}

    </div>
  );
}