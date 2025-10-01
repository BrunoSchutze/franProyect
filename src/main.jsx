import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Si tienes estilos globales (index.css), déjalo.
// Si no existe, puedes borrar esta línea sin problemas.
import "./index.css";

const rootEl = document.getElementById("root");
createRoot(rootEl).render(
  // Evitamos StrictMode para que no se dupliquen efectos ni
  // se vea "reinicio" durante el desarrollo.
  <App />
);
