// src/types.ts
export type Brand = {
  id: number;
  name: string;
};

export type Owner = {
  id: number;
  name: string;
  email: string;
};

export type Car = {
  id: number;
  model: string;
  year: number;
  brandId: number;
  ownerId: number;
  brand?: Brand;
  owner?: Owner;
};

export type NewCar = {
  model: string;
  year: number;
  brandId: number;
  ownerId: number;
};

export type UpdateCar = Partial<NewCar>;
