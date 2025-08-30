import { createRoot } from 'react-dom/client'
import { FloorPlanProvider } from "@/contexts/FloorPlanContext";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <FloorPlanProvider>
    <App />
  </FloorPlanProvider>
);
