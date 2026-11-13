import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Canonical hostname enforcement (ensures Google OAuth origin consistency)
if (typeof window !== "undefined" && window.location.hostname === "www.thetoyzdept.in") {
  window.location.replace("https://thetoyzdept.in" + window.location.pathname + window.location.search + window.location.hash);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
