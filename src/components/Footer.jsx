
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>
        © {year} DevConcepts — Desenvolvido por Eduardo Botelho
      </p>
    </footer>
    
  );
}