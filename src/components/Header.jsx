
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
        
      <NavLink to="/" className="logo" aria-label="Dev Concepts, ir para home">
        <span className="logo-bracket">{"<"}</span>
        <span className="logo-bracket">DevConcepts</span>
        <span className="logo-bracket">{" />"}</span>
      </NavLink>

      <nav className="site-nav">

        <NavLink
          to="/"
          end
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Home
        </NavLink>

        <NavLink
          to="/concepts"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Conceitos
        </NavLink>
        
      </nav>
    </header>
  );
}