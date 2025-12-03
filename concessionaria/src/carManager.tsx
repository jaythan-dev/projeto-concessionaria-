// src/Manager.tsx
import React, { useEffect, useState } from "react";
import type { Car, Brand, Owner, NewCar } from "./types";
import { getCars, createCar, updateCar, deleteCar, getBrands, getOwners } from "./api";
import "./Painel.css";

export default function Manager() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [form, setForm] = useState({ model: "", year: "", brandId: "", ownerId: "" });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ model: "", year: "", brandId: "", ownerId: "" });

  useEffect(() => {
    (async () => {
      const [carsData, brandsData, ownersData] = await Promise.all([
        getCars(),
        getBrands(),
        getOwners(),
      ]);
      setCars(carsData);
      setBrands(brandsData);
      setOwners(ownersData);
    })();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const payload: NewCar = {
      model: form.model,
      year: Number(form.year),
      brandId: Number(form.brandId),
      ownerId: Number(form.ownerId),
    };
    const newCar = await createCar(payload);
    setCars([newCar, ...cars]);
    setForm({ model: "", year: "", brandId: "", ownerId: "" });
  }

  function startEdit(car: Car) {
    setEditingId(car.id);
    setEditForm({
      model: car.model,
      year: String(car.year),
      brandId: String(car.brandId),
      ownerId: String(car.ownerId),
    });
  }

  async function saveEdit(id: number) {
    const payload = {
      model: editForm.model,
      year: Number(editForm.year),
      brandId: Number(editForm.brandId),
      ownerId: Number(editForm.ownerId),
    };
    const updated = await updateCar(id, payload);
    setCars(cars.map((c) => (c.id === id ? updated : c)));
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    await deleteCar(id);
    setCars(cars.filter((c) => c.id !== id));
  }

  return (
    <div className="cd-root">
      <div className="cd-container">
        <div className="cd-main">
          {/* Lista de carros */}
          <div className="cd-list">
            <div className="cd-list-top">
              <h2 className="cd-section-title">Carros cadastrados</h2>
              <form onSubmit={handleCreate} className="cd-controlsManager">
                <input
                  className="cd-input"
                  placeholder="Modelo"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
                <input
                  className="cd-input"
                  placeholder="Ano"
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
                <select
                  className="cd-select"
                  value={form.brandId}
                  onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                >
                  <option value="">Marca</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <select
                  className="cd-select"
                  value={form.ownerId}
                  onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                >
                  <option value="">Proprietário</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                  ))}
                </select>
                <button type="submit" className="cd-btn cd-btn-primary">Criar</button>
              </form>
            </div>

            <div className="cd-list-body">
              <ul className="cd-cards">
                {cars.map((car) => (
                  <li key={car.id} className="cd-card">
                    {editingId === car.id ? (
                      <>
                        <div className="cd-info">
                          <input
                            className="cd-input"
                            value={editForm.model}
                            onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                          />
                          <input
                            className="cd-input"
                            type="number"
                            value={editForm.year}
                            onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                          />
                          <select
                            className="cd-select"
                            value={editForm.brandId}
                            onChange={(e) => setEditForm({ ...editForm, brandId: e.target.value })}
                          >
                            {brands.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                          <select
                            className="cd-select"
                            value={editForm.ownerId}
                            onChange={(e) => setEditForm({ ...editForm, ownerId: e.target.value })}
                          >
                            {owners.map((o) => (
                              <option key={o.id} value={o.id}>{o.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="cd-detail-actions">
                          <button className="cd-btn cd-btn-primary" onClick={() => saveEdit(car.id)}>Salvar</button>
                          <button className="cd-btn cd-btn-outline" onClick={cancelEdit}>Cancelar</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="cd-info">
                          <span className="cd-brand">{brands.find(b => b.id === car.brandId)?.name}</span>
                          <span className="cd-model">{car.model}</span>
                          <span className="cd-year">{car.year}</span>
                        </div>
                        <div className="cd-meta">
                          <div className="cd-owner">
                            <span>{owners.find(o => o.id === car.ownerId)?.name}</span>
                          </div>
                          <div>
                            <button className="cd-btn cd-btn-outline" onClick={() => startEdit(car)}>Editar</button>
                            <button className="cd-btn cd-btn-ghost" onClick={() => handleDelete(car.id)}>Excluir</button>
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {cars.length === 0 && <div className="cd-no-results">Nenhum carro cadastrado.</div>}
            </div>
          </div>   
        </div>
      </div>
    </div>
  );
}
