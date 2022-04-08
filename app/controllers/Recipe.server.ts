import Recipe, { RecipeDataInput, RecipeDoc } from "~/models/Recipe.server";

const log = (id: number, msg: string) =>
  console.log(`[Cache] Recipe cache ${msg} for ${id.toString(10)}`);
const error = (id: number, msg: string) =>
  console.error(`[Cache] Recipe cache ${msg} for ${id.toString(10)}`);

export const getCachedRecipe = async (
  id: number,
): Promise<RecipeDoc | null> => {
  const cached = await Recipe.findOne({ id });
  log(id, cached ? "hit" : "miss");
  return cached;
};

export const saveRecipeCache = (data: RecipeDataInput): void => {
  Promise.resolve()
    .then(async () => {
      await Recipe.findOneAndReplace({ id: data.id }, data, {
        upsert: true,
        sort: { updatedAt: -1 },
      });
      log(data.id, "saved");
    })
    .catch((err) => {
      console.error(err);
    });
};

export const saveRecipesToCache = (recipes: RecipeDataInput[]): void => {
  recipes.forEach((data) => saveRecipeCache(data));
};

export const removeRecipeCache = (id: number): void => {
  Promise.resolve()
    .then(async () => {
      // Delete all entries
      await Recipe.deleteMany({ id });
      log(id, "removed");
    })
    .catch((err) => {
      error(id, "remove failed");
      console.error(err);
    });
};
