// src/components/Menu.tsx
import { Link } from "react-router-dom";
import "../Painel.css";

export default function Menu() {
  return (
    <nav style={{ padding: "12px", background: "var(--bg-2)", borderRadius: "10px", marginBottom: "20px" }}>
      <Link to="/" className="cd-btn cd-btn-outline" style={{ marginRight: "10px" }}>🏠 Home</Link>
      <Link to="/cars" className="cd-btn cd-btn-outline" style={{ marginRight: "10px" }}>🚗 Carros</Link>
      <Link to="/owners" className="cd-btn cd-btn-outline" style={{ marginRight: "10px" }}>👤 Donos</Link>
      <Link to="/brands" className="cd-btn cd-btn-outline">🏷️ Marcas</Link>
    </nav>
  );
}
