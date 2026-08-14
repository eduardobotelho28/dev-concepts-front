// src/pages/ConceptDetail/ConceptDetail.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getLinkStyle } from "../../utils/linkType";
import "./ConceptDetail.css";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
const API_URL = import.meta.env.VITE_API_URL;

export default function ConceptDetail() {
  const { slug } = useParams();
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const sectionRefs = useRef({});

  useEffect(() => {
    async function loadConcept() {
      setLoading(true);
      setError("");
      setNotFound(false);

      try {
        const res = await fetch(`${API_URL}api/concepts/${encodeURIComponent(slug)}`);

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Não foi possível carregar o conceito.");
          return;
        }

        setConcept(data);
      } catch {
        setError("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    }

    loadConcept();
  }, [slug]);

  const navItems = concept
    ? [
        { id: "header", label: "Início" },
        { id: "tldr", label: "TL;DR" },
        { id: "summary", label: "Resumo" },
        ...(concept.field_notes ? [{ id: "field-notes", label: "Notas de campo" }] : []),
        ...(concept.links?.length > 0 ? [{ id: "links", label: "Links úteis" }] : []),
      ]
    : [];

  function handleNavClick(id) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (loading) {
    return <p className="detail-loading">Carregando...</p>;
  }

  if (notFound) {
    return (
      <div className="detail-not-found">
        <p>Esse conceito não existe ou foi removido.</p>
        <Link to="/concepts" className="back-link">
          ← Voltar para os conceitos
        </Link>
      </div>
    );
  }

  if (error) {
    return <p className="detail-error">{error}</p>;
  }

  return (
    <div className="concept-detail-page">
      {/* NAV LATERAL FIXA */}
      <nav className="detail-side-nav" aria-label="Navegação do conceito">
        <Link to="/concepts" className="side-nav-back">
          ← Voltar para os conceitos
        </Link>
        <span className="side-nav-title">Neste conceito</span>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button className="side-nav-item" onClick={() => handleNavClick(item.id)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* TÍTULO + IMAGEM */}
      <header
        className="detail-header"
        id="header"
        ref={(el) => (sectionRefs.current.header = el)}
      >

        <h1>{concept.title}</h1>
        {concept.image_path && (
          <div className="detail-image">
            <img
              src={`${STORAGE_URL}${concept.image_path}`}
              alt={concept.title}
            />
          </div>
        )}
      </header>

      {/* TAGS */}
      {concept.tags?.length > 0 && (
        <div className="detail-tags">
          {concept.tags.map((tag) => (
            <span key={tag.id} className="detail-tag-pill">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* TL;DR */}
      <div className="detail-tldr" id="tldr" ref={(el) => (sectionRefs.current.tldr = el)}>
        <span className="detail-tldr-label">TL;DR</span>
        <p>{concept.tldr}</p>
      </div>

      {/* RESUMO EM MARKDOWN */}
      <section
        className="detail-summary"
        id="summary"
        ref={(el) => (sectionRefs.current.summary = el)}
      >
        <ReactMarkdown>{concept.summary}</ReactMarkdown>
      </section>

      {/* NOTAS DE CAMPO */}
      {concept.field_notes && (
        <section
          className="detail-field-notes"
          id="field-notes"
          ref={(el) => (sectionRefs.current["field-notes"] = el)}
        >
          <span className="detail-field-notes-label">Notas de campo</span>
          <p>{concept.field_notes}</p>
        </section>
      )}

      {/* LINKS ÚTEIS */}
      {concept.links?.length > 0 && (
        <section
          className="detail-links"
          id="links"
          ref={(el) => (sectionRefs.current.links = el)}
        >
          <h2>Links úteis</h2>
          <div className="detail-links-list">
            {concept.links.map((link) => {
              const style = getLinkStyle(link.type);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-link-item"
                  style={{ "--link-color": style.color, "--link-bg": style.bg }}
                >
                  <span className="detail-link-badge">{style.label}</span>
                  <span className="detail-link-title">{link.title}</span>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}