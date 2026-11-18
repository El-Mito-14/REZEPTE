import { openDB } from "idb";
import type { Ingredient, Recipe, RecipeItem } from "./types";

const DB_NAME = "recipePwaDB";
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("ingredients")) {
      db.createObjectStore("ingredients", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("recipes")) {
      db.createObjectStore("recipes", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("recipeItems")) {
      const store = db.createObjectStore("recipeItems", { keyPath: "id" });
      store.createIndex("recipeId", "recipeId", { unique: false });
    }
  }
});

export async function listIngredients(): Promise<Ingredient[]> {
  const db = await dbPromise;
  return db.getAll("ingredients");
}

export async function upsertIngredient(ingredient: Ingredient): Promise<void> {
  const db = await dbPromise;
  await db.put("ingredients", ingredient);
}

export async function deleteIngredient(ingredientId: string): Promise<void> {
  const db = await dbPromise;
  await db.delete("ingredients", ingredientId);

  const tx = db.transaction(["recipeItems"], "readwrite");
  const all = await tx.objectStore("recipeItems").getAll();
  for (const it of all) {
    if (it.ingredientId === ingredientId) {
      await tx.objectStore("recipeItems").delete(it.id);
    }
  }
  await tx.done;
}

export async function listRecipes(): Promise<Recipe[]> {
  const db = await dbPromise;
  return db.getAll("recipes");
}

export async function upsertRecipe(recipe: Recipe): Promise<void> {
  const db = await dbPromise;
  await db.put("recipes", recipe);
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  const db = await dbPromise;

  const tx = db.transaction(["recipeItems"], "readwrite");
  const store = tx.objectStore("recipeItems");
  const index = store.index("recipeId");
  const items = await index.getAll(recipeId);
  for (const it of items) {
    await store.delete(it.id);
  }
  await tx.done;

  await db.delete("recipes", recipeId);
}

export async function listRecipeItems(recipeId: string): Promise<RecipeItem[]> {
  const db = await dbPromise;
  const tx = db.transaction("recipeItems", "readonly");
  const idx = tx.objectStore("recipeItems").index("recipeId");
  return idx.getAll(recipeId);
}

export async function upsertRecipeItem(item: RecipeItem): Promise<void> {
  const db = await dbPromise;
  await db.put("recipeItems", item);
}

export async function deleteRecipeItem(itemId: string): Promise<void> {
  const db = await dbPromise;
  await db.delete("recipeItems", itemId);
}
