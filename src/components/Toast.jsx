import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import FranLogo from "./FranLogo";
import "./topbar.css";

export default function Topbar() {
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(true); // empieza expandido
  const collapseTimer = useRef(null);
  const scrollTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ""));
  }, []);

  // Mostrar por 5s al iniciar, luego colapsar
  useEffect(() => {
    clearTimeout(collapseTimer.current);
    collapseTimer.current = setTimeout(() => setExpanded(false), 5000);
    return () => clearTimeout(collapseTimer.current);
  }, []);

  // Expandir al scrollear y colapsar si no hay actividad por 1.5s
  useEffect(() => {
    const onScroll = () => {
      setExpanded(true);
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setExpanded(false), 1500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimer.current);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div
          className="topbar__left"
          onClick={() => navigate("/dashboard")}
          role="button"
          aria-label="Ir al dashboard"
        >
          {/* Logo: texto 28px y vaso más chico */}
          <FranLogo wordmarkHeight={28} compact />
        </div>

        <div className="topbar__right">
          {/* Pill del usuario con animación expandir/colapsar */}
          <button
            type="button"
            className={`user-pill ${expanded ? "expanded" : "collapsed"}`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            onClick={() => setExpanded((v) => !v)} // móvil: tap para alternar
            aria-label="Usuario"
          >
            <AvatarIcon />
            <span className="user-pill__label">{email || "—"}</span>
          </button>

          <button className="topbar__logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}

/* Icono de persona */
function AvatarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="user-pill__avatar"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
