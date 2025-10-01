import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Topbar from "../components/Topbar";
import "./BranchHub.css";

export default function BranchHub() {
  const navigate = useNavigate();
  const { code: codeFromUrl } = useParams();
  const [email, setEmail] = useState("");
  const [branchCode, setBranchCode] = useState(codeFromUrl || "");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setEmail(data.user?.email || "");
      if (!branchCode) {
        const uid = data.user?.id;
        if (uid) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("branch_code")
            .eq("id", uid)
            .maybeSingle();
          setBranchCode(profile?.branch_code || "belgrano");
        }
      }
    });
  }, []);

  const goFacturacion = () => navigate(`/sucursal/${branchCode}`);
  const goExperience  = () => navigate(`/sucursal/${branchCode}/experience`);

  return (
    <div>
      <Topbar userEmail={email} />
      <main className="hubMain">
        <h1 className="hubTitle">¿Qué deseás ver?</h1>

        <p className="hubSubtitle">
          Sucursal: <strong className="hubBranch">{branchCode}</strong>
        </p>

        <div className="hubGrid">
          <button className="hubCard" onClick={goFacturacion}>
            <span className="hubIcon hubIcon--green"><BarsIcon /></span>
            <div className="hubText">
              <div className="hubCardTitle">Facturación</div>
              <div className="hubCardDesc">KPIs, metas y evolución diaria.</div>
            </div>
          </button>

          <button className="hubCard" onClick={goExperience}>
            <span className="hubIcon hubIcon--peach"><SmileIcon /></span>
            <div className="hubText">
              <div className="hubCardTitle">Experiencia</div>
              <div className="hubCardDesc">NPS, contactabilidad y encuesta.</div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

/* =================== ICONOS =================== */

function BarsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <rect x="3" y="14" width="4" height="7" rx="1" fill="#063d32" />
      <rect x="10" y="10" width="4" height="11" rx="1" fill="#0b5a49" />
      <rect x="17" y="6" width="4" height="15" rx="1" fill="#0f6a55" />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#7a4e2b" strokeWidth="1.8"/>
      <circle cx="9" cy="10" r="1.2" fill="#7a4e2b" />
      <circle cx="15" cy="10" r="1.2" fill="#7a4e2b" />
      <path d="M8 14c1.2 1.4 2.6 2.1 4 2.1S14.8 15.4 16 14" fill="none" stroke="#7a4e2b" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
