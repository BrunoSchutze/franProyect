import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import FranLogo from "./FranLogo";
import "./topbar.css";

export default function Topbar() {
  const navigate = useNavigate();
  const { code = "" } = useParams();

  const branchName = useMemo(
    () =>
      code
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase()),
    [code]
  );

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const goMenu = () =>
    navigate(`/sucursal/${encodeURIComponent(code)}/menu`, { replace: true });

  return (
    <header className="topbar">
      <div className="topbar__inner">
        {/* Izquierda: logo */}
        <div className="topbar__left">
          <div
            className="topbar__brand"
            onClick={() => navigate("/dashboard")}
            role="button"
            title="Ir al dashboard"
          >
            <FranLogo wordmarkHeight={32} compact />
          </div>
        </div>

        {/* Derecha: chip Sucursal + Menú + Salir */}
        <div className="topbar__right">
          <span className="topbar__chip">
            Sucursal: <strong>{branchName || "—"}</strong>
          </span>
          <button className="topbar__back" onClick={goMenu}>← Menú</button>
          <button
            className="topbar__logout topbar__logout--rose"
            onClick={handleLogout}
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
