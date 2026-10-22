import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "@fontsource-variable/fraunces/standard.css";
import "@fontsource-variable/inter/index.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@/styles/index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element (#root) not found in index.html");
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
