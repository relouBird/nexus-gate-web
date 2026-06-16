import { createRoot } from "react-dom/client";
import { createHead, UnheadProvider } from "@unhead/react/client";
import "./index.css";
import Build from "./App.tsx";
import { StrictMode } from "react";

const head = createHead();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <UnheadProvider head={head}>
      <Build />
    </UnheadProvider>
  </StrictMode>,
);
