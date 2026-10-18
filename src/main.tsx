import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

if (window.location.hash.startsWith("#/")) {
  const legacyRoute = new URL(window.location.hash.slice(1), window.location.origin);
  const existingSearch = new URLSearchParams(window.location.search);
  existingSearch.forEach((value, key) => {
    if (!legacyRoute.searchParams.has(key)) {
      legacyRoute.searchParams.set(key, value);
    }
  });
  window.history.replaceState(
    null,
    "",
    `${legacyRoute.pathname}${legacyRoute.search}`,
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
