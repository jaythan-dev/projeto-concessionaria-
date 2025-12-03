// src/OwnerManager.tsx
import React, { useEffect, useState } from "react";
import type { Owner } from "./types";
import { getOwners, createOwner, updateOwner, deleteOwner } from "./api";
import "./Painel.css";

export default function OwnerManager() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [form, setForm] = useState({ name: "", email: "" });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  useEffect(() => {
    (async () => {
      const ownersData = await getOwners();
      setOwners(ownersData);
    })();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newOwner = await createOwner({ name: form.name, email: form.email });
    setOwners([newOwner, ...owners]);
    setForm({ name: "", email: "" });
  }

  function startEdit(owner: Owner) {
    setEditingId(owner.id);
    setEditForm({ name: owner.name, email: owner.email });
  }

  async function saveEdit(id: number) {
    const updated = await updateOwner(id, editForm);
    setOwners(owners.map((o) => (o.id === id ? updated : o)));
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    await deleteOwner(id);
    setOwners(owners.filter((o) => o.id !== id));
  }

  return (
    <div className="cd-root">   
      <div className="cd-container">
        <div className="cd-main">
          {/* Lista de donos */}
          <div className="cd-list">
            <div className="cd-list-top">
              <h2 className="cd-section-title">Proprietários cadastrados</h2>
              <form onSubmit={handleCreate} className="cd-controls">
                <input
                  className="cd-input"
                  placeholder="Nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="cd-input"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <button type="submit" className="cd-btn cd-btn-primary">Criar</button>
              </form>
            </div>

            <div className="cd-list-body">
              <ul className="cd-cards">
                {owners.map((owner) => (
                  <li key={owner.id} className="cd-card">
                    {editingId === owner.id ? (
                      <>
                        <div className="cd-info">
                          <input
                            className="cd-input"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                          <input
                            className="cd-input"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          />
                        </div>
                        <div className="cd-detail-actions">
                          <button className="cd-btn cd-btn-primary" onClick={() => saveEdit(owner.id)}>Salvar</button>
                          <button className="cd-btn cd-btn-outline" onClick={cancelEdit}>Cancelar</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="cd-info">
                          <span className="cd-model">{owner.name}</span>
                          <span className="cd-year">{owner.email}</span>
                        </div>
                        <div className="cd-meta">
                          <div>
                            <button className="cd-btn cd-btn-outline" onClick={() => startEdit(owner)}>Editar</button>
                            <button className="cd-btn cd-btn-ghost" onClick={() => handleDelete(owner.id)}>Excluir</button>
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {owners.length === 0 && <div className="cd-no-results">Nenhum proprietário cadastrado.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
