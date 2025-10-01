import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Topbar from "../components/Topbar";
import DailyGoalsByBranch from "../components/DailyGoalsByBranch.jsx";

const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
const PCT = new Intl.NumberFormat("es-AR", { style: "percent", minimumFractionDigits: 0, maximumFractionDigits: 0 });

function KpiCard({ title, value, subtitle }) {
  return (
    <section className="card shadow-3d" style={{ padding: "18px 20px", display: "grid", gap: 6 }}>
      <div style={{ fontSize: 15, color: "#567" }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#000" }}>{value}</div>
      {subtitle && <div style={{ fontSize: 14, color: "#7a8", fontWeight: 600 }}>{subtitle}</div>}
    </section>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email || ""));
  }, []);

  const OBJ_DIARIO = 1_252_635;
  const OBJ_SEMANAL = 1_467_210;
  const OBJ_MENSUAL = 3_467_210;
  const TICKET_PROM = 22_300;

  const dailyByBranch = useMemo(
    () => [
      { code: "belgrano", name: "Av. Belgrano",       value: 946_633, goal: OBJ_DIARIO },
      { code: "torreon",  name: "Estación Torreón",   value: 760_556, goal: OBJ_DIARIO },
      { code: "piazza",   name: "Galería Piazza",     value: 905_115, goal: OBJ_DIARIO },
      { code: "mendoza",  name: "Mendoza Shopping",   value: 763_551, goal: OBJ_DIARIO },
      { code: "tunuyan",  name: "La bodega Tunuyán",  value: 849_859, goal: OBJ_DIARIO },
    ],
    []
  );

  const dailyTable = useMemo(
    () => dailyByBranch.map((b) => ({ ...b, pct: Math.max(0, Math.min(1, b.value / (b.goal || 1))) })),
    [dailyByBranch]
  );

  return (
    <>
      <Topbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 16px 40px" }}>
        <h1 style={{ margin: "10px 0 16px", fontSize: 32, color: "#ffff" }}>Web Facturación</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 18 }}>
          <KpiCard
            title="Objetivo Semanal"
            value={ARS.format(OBJ_SEMANAL)}
            subtitle={`de ${ARS.format(OBJ_MENSUAL)} · ${PCT.format(0.33)}`}
          />
          <KpiCard
            title="Objetivo Mensual"
            value={ARS.format(OBJ_MENSUAL)}
            subtitle={`de ${ARS.format(OBJ_MENSUAL * 2.15)} · ${PCT.format(0.55)}`}
          />
          <KpiCard title="Ticket Promedio" value={ARS.format(TICKET_PROM)} />
        </div>

        <DailyGoalsByBranch items={dailyByBranch} />

        <section className="card shadow-3d" style={{ marginTop: 18, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 120px 100px",
              gap: 12,
              padding: "14px 18px",
              borderBottom: "1px solid #eef1f0",
              fontWeight: 700,
              color: "#cf7c8d",
            }}
          >
            <div>Sucursal</div>
            <div>Hoy</div>
            <div>%</div>
            <div />
          </div>

          {dailyTable.map((row, idx) => (
            <div
              key={row.code}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 120px 100px",
                gap: 12,
                padding: "14px 18px",
                borderBottom: idx === dailyTable.length - 1 ? "none" : "1px solid #f1f3f2",
                alignItems: "center",
              }}
            >
              <div style={{ color: "#cf7c8d", fontWeight: 600 }}>{row.name}</div>
              <div style={{ color: "#cf7c8d", fontWeight: 700 }}>{ARS.format(row.value)}</div>
              <div style={{ color: "#cf7c8d" }}>{PCT.format(row.pct)}</div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => navigate(`/sucursal/${row.code}`)}
                  style={{
                    border: "none",
                    background: "#cf7c8d",
                    color: "#fff",
                    padding: "8px 14px",
                    borderRadius: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 8px 22px rgba(2,48,37,.18)",
                  }}
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </section>

        <div style={{ marginTop: 16, color: "#7c8", fontSize: 12 }}>
          Sesión: <strong style={{ color: "#ffff" }}>{userEmail}</strong>
        </div>
      </div>
    </>
  );
}
