import { Link, useParams } from "react-router-dom";
import "./branch-menu.css"; // ← estilos locales para esta página

export default function BranchMenu() {
  const { code } = useParams();

  return (
    <div className="login-wrap login-center">
      <div className="login-card branch-menu">
        <h1 className="login-title">¿Qué deseas ver?</h1>

        <div className="login-form menu-list">
          {/* FACTURACIÓN */}
          <Link className="btn menu-opt" to={`/sucursal/${encodeURIComponent(code)}`}>
            <span className="menu-icon" aria-hidden="true">
              {/* chart bar icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <rect x="6" y="10" width="3" height="7" rx="1" />
                <rect x="11" y="6" width="3" height="11" rx="1" />
                <rect x="16" y="13" width="3" height="4" rx="1" />
              </svg>
            </span>
            <span className="menu-copy">
              <span className="menu-title">Estadísticas de facturación</span>
              <span className="menu-desc">
                Ventas, tickets, comparativas por día/mes, top productos y cumplimiento de objetivos.
              </span>
            </span>
          </Link>

          {/* EXPERIENCIA */}
          <Link className="btn menu-opt" to={`/sucursal/${encodeURIComponent(code)}/experience`}>
            <span className="menu-icon" aria-hidden="true">
              {/* smile / feedback icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </span>
            <span className="menu-copy">
              <span className="menu-title">Experiencia del usuario en la sucursal</span>
              <span className="menu-desc">
                Encuestas, NPS, tiempos de espera y comentarios de clientes para mejorar el servicio.
              </span>
            </span>
          </Link>
        </div>

        <p className="login-legal login-disclaimer" style={{ marginTop: 12 }}>
          Sucursal: <strong>{code}</strong>
        </p>
      </div>
    </div>
  );
}
