// src/api.ts
import type { Car, Brand, Owner, NewCar, UpdateCar } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

// Função genérica de requisição
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

//
// -------------------- CARS --------------------
//
export async function getCars(): Promise<Car[]> {
  return request<Car[]>("/cars");
}

export async function createCar(data: NewCar): Promise<Car> {
  return request<Car>("/cars", { method: "POST", body: JSON.stringify(data) });
}

export async function updateCar(id: number, data: UpdateCar): Promise<Car> {
  return request<Car>(`/cars/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteCar(id: number): Promise<void> {
  await request<void>(`/cars/${id}`, { method: "DELETE" });
}

//
// -------------------- BRANDS --------------------
//
export async function getBrands(): Promise<Brand[]> {
  return request<Brand[]>("/brands");
}

export async function createBrand(data: { name: string }): Promise<Brand> {
  return request<Brand>("/brands", { method: "POST", body: JSON.stringify(data) });
}

export async function updateBrand(id: number, data: { name: string }): Promise<Brand> {
  return request<Brand>(`/brands/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteBrand(id: number): Promise<void> {
  await request<void>(`/brands/${id}`, { method: "DELETE" });
}

//
// -------------------- OWNERS --------------------
//

export async function getOwners(): Promise<Owner[]> {
  return request<Owner[]>("/owners");
}

export async function createOwner(data: { name: string; email: string }): Promise<Owner> {
  return request<Owner>("/owners", { method: "POST", body: JSON.stringify(data) });
}

export async function updateOwner(id: number, data: { name: string; email: string }): Promise<Owner> {
  return request<Owner>(`/owners/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteOwner(id: number): Promise<void> {
  await request<void>(`/owners/${id}`, { method: "DELETE" });
}