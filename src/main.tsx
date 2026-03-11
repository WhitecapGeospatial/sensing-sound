
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { applyColorPalette } from "./app/config/applyColorPalette";
  import "./styles/index.css";

  applyColorPalette();
  createRoot(document.getElementById("root")!).render(<App />);
  
