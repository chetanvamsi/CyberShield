import { NavLink } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/detect", label: "Detection" },
  { to: "/about", label: "About the Research" },
  { to: "/performance", label: "Model Performance" },
  { to: "/dataset", label: "Dataset & Methodology" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__row">
        <NavLink to="/" className="navbar__brand">
          <ShieldMark />
          <span>CyberShield</span>
        </NavLink>
        <nav className="navbar__links">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                "navbar__link" + (isActive ? " navbar__link--active" : "")
              }
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function ShieldMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5L4 5.5V11.5C4 16.5 7.2 20 12 21.5C16.8 20 20 16.5 20 11.5V5.5L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
      <path d="M8.5 12L11 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
