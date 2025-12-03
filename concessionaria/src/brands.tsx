// src/BrandManager.tsx
import React, { useEffect, useState } from "react";
import type { Brand } from "./types";
import { getBrands, createBrand, updateBrand, deleteBrand } from "./api";
import "./Painel.css";

export default function BrandManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState({ name: "" });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "" });

  useEffect(() => {
    (async () => {
      const brandsData = await getBrands();
      setBrands(brandsData);
    })();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newBrand = await createBrand({ name: form.name });
    setBrands([newBrand, ...brands]);
    setForm({ name: "" });
  }

  function startEdit(brand: Brand) {
    setEditingId(brand.id);
    setEditForm({ name: brand.name });
  }

  async function saveEdit(id: number) {
    const updated = await updateBrand(id, editForm);
    setBrands(brands.map((b) => (b.id === id ? updated : b)));
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    await deleteBrand(id);
    setBrands(brands.filter((b) => b.id !== id));
  }

  return (
    <div className="cd-root">
      
      <div className="cd-container">
        <div className="cd-main">
          {/* Lista de marcas */}
          <div className="cd-list">
            <div className="cd-list-top">
              <h2 className="cd-section-title">Marcas cadastradas</h2>
              <form onSubmit={handleCreate} className="cd-controls">
                <input
                  className="cd-input"
                  placeholder="Nome da marca"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <button type="submit" className="cd-btn cd-btn-primary">Criar</button>
              </form>
            </div>

            <div className="cd-list-body">
              <ul className="cd-cards">
                {brands.map((brand) => (
                  <li key={brand.id} className="cd-card">
                    {editingId === brand.id ? (
                      <>
                        <div className="cd-info">
                          <input
                            className="cd-input"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        <div className="cd-detail-actions">
                          <button className="cd-btn cd-btn-primary" onClick={() => saveEdit(brand.id)}>Salvar</button>
                          <button className="cd-btn cd-btn-outline" onClick={cancelEdit}>Cancelar</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="cd-info">
                          <span className="cd-model">{brand.name}</span>
                        </div>
                        <div className="cd-meta">
                          <div>
                            <button className="cd-btn cd-btn-outline" onClick={() => startEdit(brand)}>Editar</button>
                            <button className="cd-btn cd-btn-ghost" onClick={() => handleDelete(brand.id)}>Excluir</button>
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {brands.length === 0 && <div className="cd-no-results">Nenhuma marca cadastrada.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
