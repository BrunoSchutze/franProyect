import React from "react";
import { useParams } from "react-router-dom";
import Topbar from "../components/Topbar";          // ← añadimos el Topbar
import "./branch-dashboard.css";

/* Utilidades */
const fmtMoney = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(
    Number(n || 0)
  );

const pct = (n, d) => Math.max(0, Math.min(100, Math.round(((n || 0) / (d || 1)) * 100)));

/* ====== Donut simple con SVG ====== */
function DonutChart({ title, data, colors }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  const radius = 110;
  const circumference = 2 * Math.PI * radius;

  let acc = 0;
  const arcs = data.map((d, i) => {
    const frac = d.value / total;
    const dash = circumference * frac;
    const gap = 6;
    const dasharray = `${dash} ${circumference - dash + gap}`;
    const dashoffset = circumference - (acc * circumference) - dash;
    acc += frac;
    return { dasharray, dashoffset, color: colors[i] || "#E9CDCB", key: i };
  });

  return (
    <div className="viz-box kpi-card donut">
      <div className="viz-title">{title}</div>
      <div className="donut-wrap">
        <svg viewBox="0 0 300 300" width="300" height="300" aria-hidden>
          <g transform="translate(150,150)">
            <circle
              r={radius}
              className="donut-track"
              strokeWidth="26"
              strokeLinecap="round"
              transform="rotate(-90)"
            />
            {arcs.map((a, i) => (
              <circle
                key={i}
                r={radius}
                fill="none"
                stroke={a.color}
                strokeWidth="26"
                strokeLinecap="round"
                strokeDasharray={a.dasharray}
                strokeDashoffset={a.dashoffset}
                transform="rotate(-90)"
              />
            ))}
          </g>
        </svg>

        <ul className="donut-legend">
          {data.map((d, i) => (
            <li key={i}>
              <span className="dot" style={{ background: colors[i] || "#E9CDCB" }} />{" "}
              {d.label} <strong>{d.value}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ====== Gauge (semicírculo) con SVG ====== */
function Gauge({ title, value }) {
  const v = Math.max(0, Math.min(100, value));
  const size = 300;
  const cx = size / 2;
  const cy = size / 2 + 80;
  const r = 190;
  const startAngle = Math.PI;
  const endAngle = 0;

  const describeArc = (val, color, strokeWidth) => {
    const a = startAngle + (val / 100) * (endAngle - startAngle);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(a);
    const y2 = cy + r * Math.sin(a);
    const largeArc = val > 50 ? 1 : 0;

    const track = `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`;
    const fillArc = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;

    return { track, fillArc, color, strokeWidth };
  };

  const track = describeArc(100, "#f4e9e7", 26);
  const fill = describeArc(v, "#E9CDCB", 26);

  return (
    <div className="viz-box kpi-card gauge">
      <div className="viz-title">{title}</div>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" aria-hidden>
        <path d={track.track} className="gauge-track" fill="none" strokeWidth={track.strokeWidth} strokeLinecap="round" />
        <path d={fill.fillArc} className="gauge-fill" fill="none" stroke={fill.color} strokeWidth={fill.strokeWidth} strokeLinecap="round" />
      </svg>
      <div className="gauge-value">
        <strong>{v}%</strong>
      </div>
    </div>
  );
}

/* =======================================================
   Página
   ======================================================= */
export default function BranchDashboard() {
  // Si la ruta es /sucursal/:code mostramos ese nombre en el Topbar
  const params = useParams?.() || {};
  const branchSlug = (params.code || "").trim();
  const branchName = branchSlug ? branchSlug.replace(/-/g, " ") : "Belgrano";

  // Datos “mock” (dejá tus fetch reales si ya los tenías)
  const dailyNow = 746536;
  const dailyTotal = 1252635;
  const dailyPct = 47;

  const weeklyCollected = 1467210;
  const weeklyGoal = 3467210;

  const monthlyCollected = 3467210;
  const monthlyGoal = 7467210;

  const ticketPromedio = 22300;

  const donutData = [
    { label: "Bebidas", value: 45 },
    { label: "Alimentos", value: 35 },
    { label: "Otros", value: 20 },
  ];
  const donutColors = ["#E9CDCB", "#1d2421", "#efe4e2"];

  const recFriend = 70;
  const satisfaction = 55;

  return (
    <>
      {/* === Topbar visible otra vez === */}
      <Topbar branchName={branchName} />   {/* si tu Topbar no usa prop, no pasa nada */}

      <div className="dash-wrap">
        <div className="dash-container">

          {/* ===== KPIs DIARIOS ===== */}
          <div
            className="panel-3d"
            style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="kpi-card" key={i}>
                <div className="kpi-title">Objetivo diario</div>
                <div className="card-kicker">
                  <span className="bar b1" />
                  <span className="bar b2" />
                  <span className="bar b3" />
                </div>

                <div className="row"><span>Ahora</span> <strong>{fmtMoney(dailyNow)}</strong></div>
                <div className="row"><span>Total</span> <strong>{fmtMoney(dailyTotal)}</strong></div>
                <div className="row"><span>%</span> <strong>{dailyPct}%</strong></div>
              </div>
            ))}
          </div>

          {/* ===== OBJETIVOS SEMANAL / MENSUAL ===== */}
          <div
            className="panel-3d"
            style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {/* Semanal */}
            <div className="kpi-card">
              <div className="kpi-title">Objetivo Semanal</div>
              <div className="card-kicker">
                <span className="bar b1" />
                <span className="bar b2" />
                <span className="bar b3" />
              </div>

              <div className="bars">
                <div className="bar-row">
                  <div className="bar-label">Recaudado</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct(weeklyCollected, weeklyGoal)}%` }} />
                  </div>
                  <div className="bar-value">{fmtMoney(weeklyCollected)}</div>
                </div>

                <div className="bar-row">
                  <div className="bar-label">Objetivo</div>
                  <div className="bar-track">
                    <div className="bar-fill is-goal" style={{ width: "100%" }} />
                  </div>
                  <div className="bar-value">{fmtMoney(weeklyGoal)}</div>
                </div>
              </div>

              <div className="row" style={{ marginTop: 10 }}>
                Porcentaje recaudado <strong style={{ marginLeft: 8 }}>
                  {pct(weeklyCollected, weeklyGoal)}%
                </strong>
              </div>
            </div>

            {/* Mensual */}
            <div className="kpi-card">
              <div className="kpi-title">Objetivo Mensual</div>
              <div className="card-kicker">
                <span className="bar b1" />
                <span className="bar b2" />
                <span className="bar b3" />
              </div>

              <div className="bars">
                <div className="bar-row">
                  <div className="bar-label">Recaudado</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct(monthlyCollected, monthlyGoal)}%` }} />
                  </div>
                  <div className="bar-value">{fmtMoney(monthlyCollected)}</div>
                </div>

                <div className="bar-row">
                  <div className="bar-label">Objetivo</div>
                  <div className="bar-track">
                    <div className="bar-fill is-goal" style={{ width: "100%" }} />
                  </div>
                  <div className="bar-value">{fmtMoney(monthlyGoal)}</div>
                </div>
              </div>

              <div className="row" style={{ marginTop: 10 }}>
                Porcentaje recaudado <strong style={{ marginLeft: 8 }}>
                  {pct(monthlyCollected, monthlyGoal)}%
                </strong>
              </div>
            </div>
          </div>

          {/* ===== VISUALIZACIONES (donut + gauges) ===== */}
          <div className="viz-grid panel-3d kpi-card" style={{ marginTop: 12 }}>
            <DonutChart title="Distribución de ventas" data={donutData} colors={donutColors} />
            <Gauge title="Recomendación a un amigo" value={recFriend} />
            <Gauge title="Satisfacción general" value={satisfaction} />
          </div>

          {/* ===== TICKET PROMEDIO (DEBAJO DE LOS DONUTS) ===== */}
          <div className="kpi-card" style={{ marginTop: 12 }}>
            <div className="kpi-title">Ticket promedio</div>
            <div className="kicker-row">
              <span className="bar b1" />
              <span className="bar b2" />
              <span className="bar b3" />
            </div>
            <div className="ticket-amount">
              <span className="currency">$</span>
              <strong>{new Intl.NumberFormat("es-AR").format(ticketPromedio)}</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
