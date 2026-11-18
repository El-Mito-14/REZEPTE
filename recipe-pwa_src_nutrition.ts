import type { Ingredient, NutritionTotals, Recipe, RecipeItem } from "./types";

export function calculateRecipeNutrition(params: {
  recipe: Recipe;
  ingredientsById: Map<string, Ingredient>;
  items: RecipeItem[];
}): NutritionTotals | null {
  const { recipe, ingredientsById, items } = params;

  const target = Math.max(0.0001, Number(recipe.servingsTarget) || 1);
  const base = Math.max(0.0001, Number(recipe.servingsBase) || 1);
  const scale = target / base;

  let energyKcalTotal = 0;
  let proteinGTotal = 0;
  let carbsGTotal = 0;
  let fatGTotal = 0;

  for (const item of items) {
    const ing = ingredientsById.get(item.ingredientId);
    if (!ing) continue;

    const gramsBase = Math.max(0, Number(item.gramsBase) || 0);
    const gramsScaled = gramsBase * scale;

    energyKcalTotal += Math.max(0, ing.nutrientsPer100g.energyKcal) * (gramsScaled / 100);
    proteinGTotal += Math.max(0, ing.nutrientsPer100g.proteinG) * (gramsScaled / 100);
    carbsGTotal += Math.max(0, ing.nutrientsPer100g.carbsG) * (gramsScaled / 100);
    fatGTotal += Math.max(0, ing.nutrientsPer100g.fatG) * (gramsScaled / 100);
  }

  return {
    energyKcalTotal,
    proteinGTotal,
    carbsGTotal,
    fatGTotal,

    energyKcalPerServing: energyKcalTotal / target,
    proteinGPerServing: proteinGTotal / target,
    carbsGPerServing: carbsGTotal / target,
    fatGPerServing: fatGTotal / target
  };
}
