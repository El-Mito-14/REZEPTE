import type { CatalogIngredient } from "../types";

export const catalog: CatalogIngredient[] = [
  { id: "chicken_breast", name: "Hähnchenbrust", nutrientsPer100g: { energyKcal: 120, proteinG: 22, carbsG: 0, fatG: 2.5 } },
  { id: "rice_cooked", name: "Reis gekocht", nutrientsPer100g: { energyKcal: 130, proteinG: 2.7, carbsG: 28, fatG: 0.3 } },
  { id: "olive_oil", name: "Olivenöl", nutrientsPer100g: { energyKcal: 884, proteinG: 0, carbsG: 0, fatG: 100 } },
  { id: "banana", name: "Banane", nutrientsPer100g: { energyKcal: 89, proteinG: 1.1, carbsG: 23, fatG: 0.3 } },
  { id: "egg", name: "Ei", nutrientsPer100g: { energyKcal: 143, proteinG: 12.6, carbsG: 1.1, fatG: 9.5 } }
];
