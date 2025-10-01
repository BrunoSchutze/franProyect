// src/components/DailyGoalsByBranch.jsx
import React, { useMemo } from "react";
import "./daily-goals.css";

const AR = new Intl.NumberFormat("es-AR");
const ARS = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default function DailyGoalsByBranch({ title = "Objetivo diario por sucursal", items = [] }) {
  // Enriquecemos cada ítem con % calculado y width de la barra
  const data = useMemo(
    () =>
      items.map((it) => {
        const pct = Math.max(0, Math.min(100, (it.value / (it.goal || 1)) * 100));
        return { ...it, pct, width: `${pct.toFixed(0)}%` };
      }),
    [items]
  );

  return (
    <section className="card shadow-3d daily-goals" aria-labelledby="dailyGoalsTitle">
      <h3 id="dailyGoalsTitle" className="section-title">
        {title}
      </h3>

      <div className="progress-list" role="list">
        {data.map((row) => (
          <div className="progress-row" role="listitem" key={row.name}>
            <span className="progress-branch">{row.name}</span>

            <div
              className="progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(row.pct)}
              aria-label={`Avance de ${row.name}`}
              title={`${Math.round(row.pct)}%`}
            >
              <div className="progress-fill" style={{ width: row.width }} />
            </div>

            <span className="progress-value">{ARS.format(row.value)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
