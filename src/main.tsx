import { createRoot } from "react-dom/client";
import { createHead, UnheadProvider } from "@unhead/react/client";
import "./index.css";
import Build from "./App.tsx";

const head = createHead();

createRoot(document.getElementById("root") as HTMLElement).render(
  <UnheadProvider head={head}>
    <Build />
  </UnheadProvider>,
);
