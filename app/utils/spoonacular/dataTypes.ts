/**
 * Types returned by the Spoonacular API
 *
 * This file is here for some unfortunate reasons...
 */

// --------------------- Recipe Information Types ------------------------------

/**
 * Minimal information about the recipe
 */
export interface RecipeCore {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

/**
 * Information returned by the `complexSearch` endpoint
 *
 * There are some fields that are optionally returned by specifying in the query
 * options. You should create a separate interface that extends this interface
 * for that if you want to use one.
 */
export interface RecipeSearch extends RecipeCore {
  calories: number;
  carbs: string;
  fat: string;
  protein: string;
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

// -------------------------- Equipment Types ----------------------------------

export interface EquipmentCore {
  id: number;
  name: string;
}

export interface EquipmentInInstruction extends EquipmentCore {
  localizedName: string;
  image: string;
}
