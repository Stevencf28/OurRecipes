import mongoose from "mongoose";
import { API_CACHE_MAX_AGE } from "~/config/cache.server";
import { RecipeCore, RecipeInfo } from "~/utils/spoonacular.server";

export type RecipeDataInput = RecipeCore & Partial<RecipeInfo>;

type RecipeDataArrayFields = "analyzedInstructions" | "extendedIngredients";
type RecipeDataType = RecipeDataInput & Pick<RecipeInfo, RecipeDataArrayFields>;

/**
 * Structure of the recipe information we have
 */
export interface RecipeData extends RecipeDataType {
  updatedAt: Date;
}

export interface RecipeInstanceMethods {
  // isFresh: () => boolean;
}

type RecipeModelType = mongoose.Model<RecipeData, {}, RecipeInstanceMethods>;

const RecipeSchema = new mongoose.Schema<
  RecipeData,
  RecipeModelType,
  RecipeInstanceMethods
>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: { type: String },
    imageType: { type: String },
    servings: { type: Number },
    readyInMinutes: { type: Number },
    license: { type: String },
    creditsText: { type: String },
    summary: { type: String },
    sourceName: { type: String },
    sourceUrl: { type: String },
    spoonacularSourceUrl: { type: String },
    aggregateLikes: { type: Number },
    healthScore: { type: Number },
    spoonacularScore: { type: Number },
    pricePerServing: { type: Number },
    cheap: { type: Boolean },
    diets: [{ type: String }],
    gaps: { type: String },
    dairyFree: { type: Boolean },
    glutenFree: { type: Boolean },
    ketogenic: { type: Boolean },
    lowFodmap: { type: Boolean },
    sustainable: { type: Boolean },
    vegan: { type: Boolean },
    vegetarian: { type: Boolean },
    whole30: { type: Boolean },
    analyzedInstructions: [{ type: Object }],
    extendedIngredients: [{ type: Object }],
  },
  {
    id: false,
    timestamps: {
      createdAt: false,
      updatedAt: true,
    },
  },
);

// Set a TTL to automatically purge stale cache from the database
RecipeSchema.index(
  { updatedAt: -1 },
  { expireAfterSeconds: API_CACHE_MAX_AGE },
);

const modelName = "recipe";

// Remove the previous version of the model that is already registered. While
// inefficient, this ensures that any changes made to the models are applied.
if (process.env.NODE_ENV !== "production" && mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

/**
 * Mongoose model for cached recipe data
 */
const Recipe = mongoose.model<RecipeData, RecipeModelType>(
  modelName,
  RecipeSchema,
);
export default Recipe;

/**
 * The type of Mongoose document for the cached recipe data
 */
export type RecipeDoc = mongoose.HydratedDocument<
  RecipeData,
  RecipeInstanceMethods
>;
