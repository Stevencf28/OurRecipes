/**
 * MongoDB collection for the recipe collections
 *
 * While we can make the recipe collections into a subdocument of {@link User}
 * documents, making a separate document is more resilient to future changes.
 * For example, if we were to implement the share functionality for recipe
 * collections, it is better to have an id ready for each collection that is
 * guaranteed to be unique and easy to query from the database (i.e. indexed).
 * It is also easier to have permission control settings with a separate
 * document for recipe collections.
 */

import mongoose from "mongoose";

/**
 * Structure of the collection model
 */
export interface CollectionData {
  user: mongoose.Types.ObjectId;
  name: string; // The default collection name will be an empty string
  recipes: number[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for the recipe collection */
const CollectionSchema = new mongoose.Schema<CollectionData>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
    },
    recipes: [
      {
        type: Number,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// The combination of user and name should be unique
CollectionSchema.index({ user: 1, name: 1 }, { unique: true });

const modelName = "collection";

// Remove the previous version of the model that is already registered. While
// inefficient, this ensures that any changes made to the models are applied.
if (process.env.NODE_ENV !== "production" && mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

/**
 * Mongoose model for recipe collections
 */
const Collection = mongoose.model(modelName, CollectionSchema);
export default Collection;

/**
 * The type of Mongoose model for recipe collections
 */
export type CollectionDoc = mongoose.HydratedDocument<CollectionData>;
