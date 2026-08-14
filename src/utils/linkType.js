// src/utils/linkType.js
export function normalizeLinkType(type) {
  if (!type) return "";
  return type
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s]/g, "")     // remove pontuação
    .trim();
}

export const LINK_TYPE_STYLES = {
  rfc: { label: "RFC", color: "#211A1D", bg: "rgba(33,26,29,0.08)" },
  youtube: { label: "YouTube", color: "#FF0000", bg: "rgba(255,0,0,0.08)" },
  artigo: { label: "Artigo", color: "#08AEEF", bg: "rgba(8,174,239,0.08)" },
  documentacao: { label: "Documentação", color: "#386150", bg: "rgba(56,97,80,0.08)" },
};

export const DEFAULT_LINK_STYLE = {
  label: "Link",
  color: "#5A5359",
  bg: "rgba(90,83,89,0.08)",
};

export function getLinkStyle(type) {
  const normalized = normalizeLinkType(type);
  return LINK_TYPE_STYLES[normalized] || DEFAULT_LINK_STYLE;
}