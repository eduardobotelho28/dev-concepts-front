
import { useEffect, useState }   from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./ConceptList.css";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
const API_URL = import.meta.env.VITE_API_URL;

const TAGS = [
    { id: 1, name: "Redes", slug: "redes" },
    { id: 2, name: "Segurança", slug: "seguranca" },
    { id: 3, name: "Algoritmos", slug: "algoritmos" },
    { id: 4, name: "Lógica", slug: "logica" },
    { id: 5, name: "Estrutura de Dados", slug: "estrutura-de-dados" },
    { id: 6, name: "Sistemas Operacionais", slug: "sistemas-operacionais" },
    { id: 7, name: "Performance", slug: "performance" },
    { id: 8, name: "Inteligência Artificial", slug: "inteligencia-artificial" },
    { id: 9, name: "Autenticação", slug: "autenticacao" },
    { id: 10, name: "Arquitetura", slug: "arquitetura" },
    { id: 11, name: "System Design", slug: "system-design" },
    { id: 12, name: "Banco de Dados", slug: "banco-de-dados" },
    { id: 13, name: "UX/UI", slug: "uxui" },
    { id: 14, name: "Deploy", slug: "deploy" },
    { id: 15, name: "Protocolos", slug: "protocolos" },
    { id: 16, name: "Nuvem", slug: "nuvem" },
];

const SORT_OPTIONS = [
    { label: "Mais recentes", order_by: "created_at", order: "desc" },
    { label: "Mais antigos", order_by: "created_at", order: "asc" },
    { label: "A–Z", order_by: "title", order: "asc" },
    { label: "Z–A", order_by: "title", order: "desc" },
];

export default function ConceptList() {

    const [searchParams, setSearchParams] = useSearchParams();

    const search   = searchParams.get("search")       || "";
    const tag      = searchParams.get("tag")          || "";
    const orderBy  = searchParams.get("order_by")     || "created_at";
    const order    = searchParams.get("order")        || "desc";
    const page     = Number(searchParams.get("page")) || 1;

    const [searchInput, setSearchInput] = useState(search);
    const [concepts, setConcepts]       = useState([]);
    const [meta, setMeta]               = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState("");

    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    useEffect(() => {
        async function loadConcepts() {
            setLoading(true);
            setError("");

            const params = new URLSearchParams({
                page: String(page),
                per_page: "15",
                order_by: orderBy,
                order,
            });
            if (search) params.set("search", search);
            if (tag) params.set("tag", tag);

            try {
                const res = await fetch(`${API_URL}api/concepts?${params.toString()}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.message || "Não foi possível carregar os conceitos.");
                    return;
                }

                setConcepts(data.data);
                setMeta({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    total: data.total,
                });
            } catch {
                setError("Erro ao conectar com o servidor.");
            } finally {
                setLoading(false);
            }
        }

        loadConcepts();
    }, [search, tag, orderBy, order, page]);

    function updateParams(updates) {
        const next = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                next.set(key, value);
            } else {
                next.delete(key);
            }
        });
        next.delete("page"); // qualquer mudança de filtro reseta a página
        setSearchParams(next);
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        updateParams({ search: searchInput.trim() });
    }

    function handleClearSearch() {
        setSearchInput("");
        updateParams({ search: "" });
    }

    function handleSort(option) {
        updateParams({ order_by: option.order_by, order: option.order });
    }

    function handleTagClick(tagSlug) {
        updateParams({ tag: tag === tagSlug ? "" : tagSlug });
    }

    function goToPage(newPage) {
        const next = new URLSearchParams(searchParams);
        next.set("page", String(newPage));
        setSearchParams(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const isActiveSort = (option) =>
        option.order_by === orderBy && option.order === order;

    return (

        <div className="concept-list-page">

            <div className="concept-list-header">
                <Link to="/" className="back-link">
                    ← Voltar para a home
                </Link>
                <span className="eyebrow">CATÁLOGO COMPLETO</span>
                <p className="results-count">
                    {loading ? "Carregando..." : `${meta.total} conceitos encontrados`}
                </p>
            </div>

            <div className="controls">

                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        placeholder="Buscar por título ou TL;DR..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit">Buscar</button>
                    {search && (
                        <button type="button" className="clear-button" onClick={handleClearSearch}>
                            Limpar
                        </button>
                    )}
                </form>

                <div className="sort-buttons">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.label}
                            className={"sort-button" + (isActiveSort(option) ? " active" : "")}
                            onClick={() => handleSort(option)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

            </div>

            <span className="filters-label">Filtrar por tema</span>
            
            <div className="tag-filters">
                {TAGS.map((t) => (
                    <button
                        key={t.id}
                        className={"concept-tag-pill" + (tag === t.slug ? " active" : "")}
                        onClick={() => handleTagClick(t.slug)}
                    >
                        {t.name}
                    </button>
                ))}
            </div>

            {error && <p className="form-error">{error}</p>}

            {loading ? (
                <p className="loading-text">Carregando conceitos...</p>
            ) : concepts.length === 0 ? (
                <p className="empty-text">Nenhum conceito encontrado com esses filtros.</p>
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
                                <p>{concept.tldr}</p>
                                <Link to={`/concept/${concept.slug}`} className="access-button">
                                    Acessar
                                </Link>
                            </div>

                        </div>

                    ))}
                </div>
            )}

            {meta.last_page > 1 && (
                <div className="pagination-concept">
                    <button onClick={() => goToPage(page - 1)} disabled={page === 1}>
                        Anterior
                    </button>
                    <span>
                        Página {meta.current_page} de {meta.last_page}
                    </span>
                    <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page === meta.last_page}
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}