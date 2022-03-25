import mongoose from "mongoose";
/**
 * Structure of the snack model
 */
export interface UserData {
  email: String;
  password: String;
  displayName: String;
}

const UserSchema = new mongoose.Schema<UserData>({
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

const modelName = "user";

// Remove the previous version of the model that is already registered. While
// inefficient, this ensures that any changes made to the models are applied.
if (process.env.NODE_ENV !== "production" && mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

/**
 * Mongoose model for snacks
 */
const Snack = mongoose.model(modelName, UserSchema);
export default Snack;

/**
 * The type of mongoose document for snacks
 */
export type SnackDoc = mongoose.HydratedDocument<UserData>;
