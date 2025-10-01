import { useEffect, useMemo, useState } from "react";
import Topbar from "../components/Topbar";
import MiniBars from "../components/MiniBars";
import ActionTable from "../components/ActionTable";
import "./customer-experience.css";

/* ================= helpers ================= */
const API_URL = import.meta.env.VITE_ENCUESTA_API || "";

const nf = (n) =>
  new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );

const pct = (n) =>
  `${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0)}%`;

const money = (n) =>
  `$ ${new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0)}`;

/* ====== íconos “clásicos” para caritas ====== */
const FaceVeryBad = (p) => (
  <svg viewBox="0 0 48 48" width="28" height="28" className="face-icon" {...p}>
    <circle cx="24" cy="24" r="20" />
    <circle cx="17" cy="20" r="2.2" />
    <circle cx="31" cy="20" r="2.2" />
    <path d="M14 34c3-4 17-4 20 0" />
  </svg>
);
const FaceBad = (p) => (
  <svg viewBox="0 0 48 48" width="28" height="28" className="face-icon" {...p}>
    <circle cx="24" cy="24" r="20" />
    <circle cx="17" cy="20" r="2.2" />
    <circle cx="31" cy="20" r="2.2" />
    <path d="M16 33h16" />
  </svg>
);
const FaceNeutral = (p) => (
  <svg viewBox="0 0 48 48" width="28" height="28" className="face-icon" {...p}>
    <circle cx="24" cy="24" r="20" />
    <circle cx="17" cy="20" r="2.2" />
    <circle cx="31" cy="20" r="2.2" />
    <path d="M16 33h16" />
  </svg>
);
const FaceGood = (p) => (
  <svg viewBox="0 0 48 48" width="28" height="28" className="face-icon" {...p}>
    <circle cx="24" cy="24" r="20" />
    <circle cx="17" cy="20" r="2.2" />
    <circle cx="31" cy="20" r="2.2" />
    <path d="M14 31c3 4 17 4 20 0" />
  </svg>
);
const FaceGreat = (p) => (
  <svg viewBox="0 0 48 48" width="28" height="28" className="face-icon" {...p}>
    <circle cx="24" cy="24" r="20" />
    <circle cx="17" cy="20" r="2.2" />
    <circle cx="31" cy="20" r="2.2" />
    <path d="M12 30c4 6 20 6 24 0" />
  </svg>
);

/* ================= component ================= */
export default function CustomerExperience() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState({
    count: 0,
    nps: { score: 0, promoters: 0, detractors: 0, neutrals: 0 },
    contact: { rate: 0, withEmail: 0 },
    last: [],
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        if (!API_URL) throw new Error("Falta VITE_ENCUESTA_API");
        const r = await fetch(API_URL, { mode: "cors" });
        if (!r.ok) throw new Error(await r.text());
        const json = await r.json();
        if (!ignore) setData(json);
      } catch (e) {
        if (!ignore) setErr(e?.message || "No se pudo cargar");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const dist = useMemo(() => {
    const total =
      (data?.nps?.promoters || 0) +
      (data?.nps?.detractors || 0) +
      (data?.nps?.neutrals || 0);

    const veryBad = data?.nps?.veryBad || 0; // por si en el futuro separás 1–2
    const bad = data?.nps?.detractors || 0;
    const neutral = data?.nps?.neutrals || 0;
    const good = data?.nps?.promoters || 0;
    const great = data?.nps?.great || 0; // por si en el futuro separás 5

    const sum = veryBad + bad + neutral + good + great || total || 1;

    return {
      veryBad,
      bad,
      neutral,
      good,
      great,
      pct: {
        veryBad: (veryBad / sum) * 100,
        bad: (bad / sum) * 100,
        neutral: (neutral / sum) * 100,
        good: (good / sum) * 100,
        great: (great / sum) * 100,
      },
      total: sum,
    };
  }, [data]);

  const bars = useMemo(
    () => [
      { label: "Muy insatisfecho", value: Math.round(dist.pct.veryBad || 0) },
      { label: "Insatisfecho", value: Math.round(dist.pct.bad || 0) },
      { label: "Neutral", value: Math.round(dist.pct.neutral || 0) },
      { label: "Satisfecho", value: Math.round(dist.pct.good || 0) },
      { label: "Muy satisfecho", value: Math.round(dist.pct.great || 0) },
    ],
    [dist]
  );

  const faces = [
    {
      key: "veryBad",
      label: "Muy insatisfecho",
      icon: FaceVeryBad,
      count: dist.veryBad,
      pct: dist.pct.veryBad,
    },
    {
      key: "bad",
      label: "Insatisfecho",
      icon: FaceBad,
      count: dist.bad,
      pct: dist.pct.bad,
    },
    {
      key: "neutral",
      label: "Neutral",
      icon: FaceNeutral,
      count: dist.neutral,
      pct: dist.pct.neutral,
    },
    {
      key: "good",
      label: "Satisfecho",
      icon: FaceGood,
      count: dist.good,
      pct: dist.pct.good,
    },
    {
      key: "great",
      label: "Muy satisfecho",
      icon: FaceGreat,
      count: dist.great,
      pct: dist.pct.great,
    },
  ];

  return (
    <>
      <Topbar />
      <main className="cx-wrap">
        <header className="cx-header">
          <h1>Experiencia del Cliente</h1>
          <div className="cx-chip">
            Con email: <strong>{nf(data?.contact?.withEmail || 0)}</strong>
          </div>
        </header>

        {!!err && (
          <div className="cx-alert">
            <strong>No se pudo cargar:</strong> {err}
          </div>
        )}

        <section className="cx-grid3">
          <div className="cx-card">
            <h3 className="cx-title">NPS</h3>
            <div className="cx-number">{nf(data?.nps?.score || 0)}</div>
            <div className="cx-sub">Semana actual</div>
          </div>

          <div className="cx-card">
            <h3 className="cx-title">Contactabilidad</h3>
            <div className="cx-number">{pct(data?.contact?.rate || 0)}</div>
            <div className="cx-sub">Clientes contactados</div>
          </div>

          <div className="cx-card">
            <h3 className="cx-title">Ticket Promedio</h3>
            <div className="cx-number">{money(22300)}</div>
            <div className="cx-sub">&nbsp;</div>
          </div>
        </section>

        <section className="cx-card">
          <h3 className="cx-title">Satisfacción general</h3>
          <div className="cx-faces">
            {faces.map(({ key, label, count, pct: p, icon: Icon }) => (
              <div className="cx-face" key={key}>
                <div className="cx-face-top">
                  <Icon />
                  <div className="cx-face-val">{nf(count || 0)}</div>
                </div>
                <div className="cx-face-pct">{pct(p || 0)}</div>
                <div className="cx-face-label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cx-grid2">
          <div className="cx-card">
            <h3 className="cx-title">Satisfacción por categoría (%)</h3>
            <MiniBars data={bars} unit="%" labelWidth={190} />
          </div>

          <div className="cx-card">
            <h3 className="cx-title">Gestión de feedback</h3>
            <ActionTable rows={data?.last || []} />
          </div>
        </section>

        {loading && <div className="cx-loading">Cargando…</div>}
      </main>
    </>
  );
}
