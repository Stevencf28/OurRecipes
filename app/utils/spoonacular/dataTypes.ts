/**
 * Types returned by the Spoonacular API
 *
 * This file is here for some unfortunate reasons...
 */

// --------------------- Recipe Information Types ------------------------------

/**
 * Minimal information about the recipe
 *
 * There are some fields that are optionally returned by specifying in the query
 * options. You should create a separate interface that extends this interface
 * for that if you want to use one.
 */
export interface RecipeCore {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

// This is not all of the fields, but I just picked the ones that didn't look
// totally useless
export interface RecipeDetails extends RecipeCore {
  servings: number;
  readyInMinutes: number;
  license: string;
  creditsText: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  spoonacularSourceUrl: string;
  aggregateLikes: number;
  healthScore: number;
  spoonacularScore: number;
  pricePerServing: number;
  cheap: boolean;
  diets: string[];
  gaps: string;
  dairyFree: boolean;
  glutenFree: boolean;
  ketogenic: boolean;
  lowFodmap: boolean;
  sustainable: boolean;
  vegan: boolean;
  vegetarian: boolean;
  whole30: boolean;
  analyzedInstructions: AnalyzedInstruction[];
}

/**
 * The structure for recipe information returned from recipe search with
 * ingredients filters
 */
export interface RecipeFromIngredients
  extends RecipeDetails,
    RecipeFillIngredients {}

// This is NOT a stand-alone type that can describe a recipe.
// Use `RecipeFromIngredients` instead.
interface RecipeFillIngredients {
  missedIngredientCount: number;
  usedIngredientCount: number;
  missedIngredients: IngredientInRecipeSearch[];
  usedIngredients: IngredientInRecipeSearch[];
  unusedIngredients: IngredientInRecipeSearch[];
}

// -------------------------- Instruction Types --------------------------------

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  number: number;
  step: string;
  ingredients: IngredientInInstruction[];
  equiment: EquipmentInInstruction[];
}

// -------------------------- Ingredient Types ---------------------------------

export interface IngredientCore {
  id: number;
  name: string;
}

export interface IngredientWithImage extends IngredientCore {
  image: string;
}

export interface IngredientInInstruction extends IngredientWithImage {
  localizedName: string;
}

export interface IngredientInRecipeSearch extends IngredientWithImage {
  amount: number;
  aisle: string;
  original: string;
  originalName: string;
  unit: string;
  unitLong: string;
  unitShort: string;
  meta: string[];
}

// -------------------------- Equipment Types ----------------------------------

export interface EquipmentCore {
  id: number;
  name: string;
}

export interface EquipmentInInstruction extends EquipmentCore {
  localizedName: string;
  image: string;
}
