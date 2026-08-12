// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = `${API_URL}storage/`;

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

export default function Home() {
  const [latest, setLatest] = useState([]);
  const [total, setTotal] = useState(null);
  const [loadingLatest, setLoadingLatest] = useState(true);

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetch(
          `${API_URL}api/concepts?order_by=created_at&order=desc&per_page=10`
        );
        const data = await res.json();
        if (res.ok) {
          setLatest(data.data);
          setTotal(data.total);
        }
      } finally {
        setLoadingLatest(false);
      }
    }

    loadLatest();
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <span className="eyebrow eyebrow-light">DEVCONCEPTS</span>
        <h1>Olá, O que você vai revisar hoje?</h1>
        <p className="hero-subtitle">
          Resumos rápidos, TL;DRs e notas de campo sobre conceitos de
          desenvolvimento, pra revisar antes de uma entrevista, relembrar algo
          que você já viu, ou ter a primeira noção sobre um tema novo.
        </p>
        <div className="hero-actions">
          <Link to="/concepts" className="btn-primary">
            Ver Conceitos
          </Link>
          {total !== null && (
            <span className="hero-stat">{total} conceitos catalogados</span>
          )}
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="overview">
        <div className="section-inner">
          <span className="eyebrow">SOBRE</span>
          <h2>Sobre o DevConcepts</h2>
          <p>
            O DevConcepts é um catálogo de conceitos do mundo dev: de redes e
            segurança a system design e estrutura de dados. Cada conceito é
            pensado pra leitura rápida, não pra teste: sem quiz, sem desafio,
            só revisão direta.
          </p>
          <div className="overview-grid">
            <div className="overview-item">
              <span className="overview-icon">TL;DR</span>
              <p>Resumo de uma frase pra você decidir se vale aprofundar.</p>
            </div>
            <div className="overview-item">
              <span className="overview-icon">MD</span>
              <p>Resumo completo em markdown, direto ao ponto.</p>
            </div>
            <div className="overview-item">
              <span className="overview-icon">↗</span>
              <p>Links úteis: artigos, RFCs e vídeos pra ir mais fundo.</p>
            </div>
            <div className="overview-item">
              <span className="overview-icon">✎</span>
              <p>Notas de campo com observações práticas de uso real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ÚLTIMOS CONCEITOS */}
      <section className="latest">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <span className="eyebrow">RECENTES</span>
              <h2>Os Últimos 10 conceitos postados</h2>
            </div>
            <Link to="/concepts" className="see-all-link">
              Ver todos →
            </Link>
          </div>

          {loadingLatest ? (
            <p className="loading-text">Carregando...</p>
          ) : (
            <div className="carousel">
              {latest.map((concept) => (
                <Link
                  to={`/concept/${concept.slug}`}
                  key={concept.id}
                  className="carousel-card"
                >
                  <div className="carousel-card-image">
                    {concept.image_path ? (
                      <img
                        src={`${STORAGE_URL}${concept.image_path}`}
                        alt={concept.title}
                      />
                    ) : (
                      <div className="carousel-card-placeholder" />
                    )}
                  </div>
                  <div className="carousel-card-body">
                    <h3>{concept.title}</h3>
                    <p>{concept.tldr}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TEMAS */}
      <section className="topics">
        <div className="section-inner">
          <span className="eyebrow eyebrow-light">EXPLORAR</span>
          <h2>Explore algum tema específico</h2>
          <div className="topic-pills">
            {TAGS.map((tag) => (
              <Link
                to={`/concepts?tag=${tag.slug}`}
                key={tag.id}
                className="topic-pill"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AVISO DOCUMENTAÇÃO */}
      <section className="docs-section">
        <div className="section-inner">
          <div className="docs-callout">
            <span className="docs-icon">!</span>
            <p>
              <strong>Lembrete:</strong> este catálogo é um ponto de partida,
              não substitui a documentação oficial de cada tecnologia. Use pra
              revisar e refrescar a memória. Para aprofundar, sempre vale
              voltar à fonte.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}