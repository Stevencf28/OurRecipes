import mongoose from "mongoose";
import getEnv from "./env.server";

// We need to make sure we don't create a new connection every time a request is
// made to the server or a live reload of the server code happens during
// development. The global context does not reset, so we assign the mongoose
// connection object to one field of the global object and check it to see if we
// can reuse it.
// Resources:
// https://remix.run/docs/en/v1/tutorials/jokes#connect-to-the-database
// https://mongoosejs.com/docs/lambda.html

declare global {
  var dbConn: typeof mongoose | undefined;
}

/**
 * Establish a connection to the database if not already made
 */
export default async function connectDB() {
  if (!global.dbConn) {
    await mongoose.connect(getEnv("DB_URI"));
    global.dbConn = mongoose;
    console.log("Connected to the database");
  }
}
