
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/apiClient";
import "./AdminNewPost.css";

const TAGS = [
    { id: 1, name: "Redes" },
    { id: 2, name: "Segurança" },
    { id: 3, name: "Algoritmos" },
    { id: 4, name: "Lógica" },
    { id: 5, name: "Estrutura de Dados" },
    { id: 6, name: "Sistemas Operacionais" },
    { id: 7, name: "Performance" },
    { id: 8, name: "Inteligência Artificial" },
    { id: 9, name: "Autenticação" },
    { id: 10, name: "Arquitetura" },
    { id: 11, name: "System Design" },
    { id: 12, name: "Banco de Dados" },
    { id: 13, name: "UX/UI" },
    { id: 14, name: "Deploy" },
    { id: 15, name: "Protocolos" },
    { id: 16, name: "Nuvem" },
];

const emptyLink = { title: "", url: "", type: "" };

export default function AdminNewPost() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [tldr, setTldr] = useState("");
    const [summary, setSummary] = useState("");
    const [fieldNotes, setFieldNotes] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [links, setLinks] = useState([]);

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    function toggleTag(id) {
        setSelectedTags((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    }

    function addLink() {
        setLinks((prev) => [...prev, { ...emptyLink }]);
    }

    function updateLink(index, field, value) {
        setLinks((prev) =>
            prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
        );
    }

    function removeLink(index) {
        setLinks((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({});
        setGeneralError("");
        setSubmitting(true);

        try {
            let imagePath = null;

            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const imageRes = await apiFetch("api/uploads/image", {
                    method: "POST",
                    body: formData,
                });

                if (!imageRes.ok) {
                    setGeneralError(imageRes.data.message || "Falha ao enviar a imagem.");
                    setSubmitting(false);
                    return;
                }

                imagePath = imageRes.data.path;
            }

            const payload = {
                title,
                tldr,
                summary,
                field_notes: fieldNotes || null,
                image_path: imagePath,
                tags: selectedTags,
                links: links.filter((l) => l.title && l.url),
            };

            const conceptRes = await apiFetch("api/concepts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!conceptRes.ok) {
                setGeneralError(conceptRes.data.message || "Não foi possível criar o conceito.");
                if (conceptRes.data.errors) {
                    setErrors(conceptRes.data.errors);
                }
                setSubmitting(false);
                return;
            }

            navigate("/", { replace: true });
        } catch {
            setGeneralError("Erro ao conectar com o servidor. Tente novamente.");
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="new-post-form" noValidate>
            <h1>Novo conceito</h1>

            {generalError && <p className="form-error">{generalError}</p>}

            <div className="field">
                <label htmlFor="title">Título</label>
                <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={submitting}
                />
                {errors.title && <p className="field-error">{errors.title[0]}</p>}
            </div>

            <div className="field">
                <label htmlFor="tldr">TL;DR</label>
                <input
                    id="tldr"
                    value={tldr}
                    onChange={(e) => setTldr(e.target.value)}
                    disabled={submitting}
                    maxLength={255}
                />
                {errors.tldr && <p className="field-error">{errors.tldr[0]}</p>}
            </div>

            <div className="field">
                <label htmlFor="summary">Resumo</label>
                <textarea
                    id="summary"
                    rows={10}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    disabled={submitting}
                />
                {errors.summary && <p className="field-error">{errors.summary[0]}</p>}
            </div>

            <div className="field">
                <label htmlFor="fieldNotes">Notas de campo</label>
                <textarea
                    id="fieldNotes"
                    rows={5}
                    value={fieldNotes}
                    onChange={(e) => setFieldNotes(e.target.value)}
                    disabled={submitting}
                />
            </div>

            <div className="field">
                <label htmlFor="image">Imagem</label>
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0] ?? null)}
                    disabled={submitting}
                />
            </div>

            <div className="field">
                <label>Tags</label>
                <div className="tag-pills">
                    {TAGS.map((tag) => (
                        <button
                            type="button"
                            key={tag.id}
                            className={"tag-pill" + (selectedTags.includes(tag.id) ? " active" : "")}
                            onClick={() => toggleTag(tag.id)}
                            disabled={submitting}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="field">
                <label>Links úteis</label>
                {links.map((link, index) => (
                    <div className="link-row" key={index}>
                        <input
                            placeholder="Título"
                            value={link.title}
                            onChange={(e) => updateLink(index, "title", e.target.value)}
                            disabled={submitting}
                        />
                        <input
                            placeholder="URL"
                            value={link.url}
                            onChange={(e) => updateLink(index, "url", e.target.value)}
                            disabled={submitting}
                        />
                        <input
                            placeholder="Tipo (opcional)"
                            value={link.type}
                            onChange={(e) => updateLink(index, "type", e.target.value)}
                            disabled={submitting}
                        />
                        <button
                            type="button"
                            onClick={() => removeLink(index)}
                            disabled={submitting}
                            className="remove-link"
                        >
                            Remover
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addLink} disabled={submitting} className="add-link">
                    + Adicionar link
                </button>
            </div>

            <button type="submit" disabled={submitting} className="submit-button">
                {submitting ? "Salvando..." : "Publicar conceito"}
            </button>
        </form>
    );
}