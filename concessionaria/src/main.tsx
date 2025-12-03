// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./components/menu";
import CarManager from "./carManager";
import OwnerManager from "./PainelDonos";
import BrandManager from "./brands";

function Home() {
  return (
    <div className="cd-root">
      <div className="cd-container">
        <p style={{ textAlign: "center", padding: "20px" }}>
          Sistema de gestão da concessionária 1.0.  
          Use o menu para navegar entre Carros, Donos e Marcas.
        </p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarManager />} />
        <Route path="/owners" element={<OwnerManager />} />
        <Route path="/brands" element={<BrandManager />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
