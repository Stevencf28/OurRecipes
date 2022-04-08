import { ClientSession } from "mongodb";
import mongoose from "mongoose";
import Collection, { CollectionDoc } from "./Collection.server";

/**
 * Structure of the user model
 */
export interface UserData {
  email: string;
  password: string;
  displayName?: string;
}

export interface UserInstanceMethods {
  /**
   * Get the list of all collections this user has, sorted by the name
   */
  collections: () => Promise<CollectionDoc[]>;

  /**
   * Get the default collection, creating one if it doesn't exist
   *
   * You can opt-in to use a session if you want to use a transaction.
   */
  defaultCollection: (session?: ClientSession) => Promise<CollectionDoc>;
}

type UserModelType = mongoose.Model<UserData, {}, UserInstanceMethods>;

const UserSchema = new mongoose.Schema<
  UserData,
  UserModelType,
  UserInstanceMethods
>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.methods.collections = async function (this: UserDoc) {
  return await Collection.find(
    { user: this._id },
    {},
    {
      sort: { name: 1 },
    },
  );
};

UserSchema.methods.defaultCollection = async function (
  this: UserDoc,
  session?: ClientSession,
) {
  const data = { user: this._id, name: "" };
  const collection = await Collection.findOne(data, {}, { session });
  return collection ?? new Collection(data).save({ session });
};

const modelName = "user";

// Remove the previous version of the model that is already registered. While
// inefficient, this ensures that any changes made to the models are applied.
if (process.env.NODE_ENV !== "production" && mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

/**
 * Mongoose model for users
 */
const User = mongoose.model<UserData, UserModelType>(modelName, UserSchema);
export default User;

/**
 * The type of mongoose document for users
 */
export type UserDoc = mongoose.HydratedDocument<UserData, UserInstanceMethods>;
