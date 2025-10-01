import React from "react";

/* ==== Iconitos (stroke, neutrales, sin libs) ==== */
const IconChat = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-4.5A4 4 0 0 1 4 6h13a4 4 0 0 1 4 4v5Z"/>
  </svg>
);
const IconMail = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>
    <path d="M22 6 12 13 2 6"/>
  </svg>
);
const IconPhone = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h2a2 2 0 0 1 2 1.72c.12.9.32 1.78.58 2.64a2 2 0 0 1-.45 2.11L7.1 9.9a16 16 0 0 0 6 6l1.43-1.13a2 2 0 0 1 2.11-.45c.86.26 1.74.46 2.64.58A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconCalendar = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);

/* ===== Tabla de acciones ===== */
export default function ActionTable({ rows = [] }) {
  return (
    <section className="cx-card">
      <h3 className="cx-card__title">Gestión de feedback</h3>

      <table className="cx-table">
        <thead>
          <tr>
            <th>Prioridad</th>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Responsable</th>
            <th>Etiquetas</th>
            <th className="text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr className="cx-empty-row">
              <td colSpan={6}>
                <div className="cx-empty">
                  <p className="cx-empty__title">No hay datos para mostrar</p>
                  <p className="cx-empty__hint">
                    Cuando lleguen respuestas, las verás aquí para contactarlas por
                    WhatsApp, mail o teléfono, y podrás agendar el seguimiento.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.id || i}>
                <td>
                  <span className={`prio prio-${r.priority || "low"}`} />
                </td>
                <td>{r.user || "—"}</td>
                <td>{r.date || "—"}</td>
                <td>{r.owner || "—"}</td>
                <td className="labels">
                  {(r.labels || []).map((t, j) => (
                    <span className="tag" key={j}>{t}</span>
                  ))}
                </td>
                <td className="cx-actions">
                  <button className="act" title="WhatsApp"><IconChat /></button>
                  <button className="act" title="Email"><IconMail /></button>
                  <button className="act" title="Llamar"><IconPhone /></button>
                  <button className="act" title="Agendar"><IconCalendar /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
