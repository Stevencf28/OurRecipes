/**
 * Cache for sending HTTP requests to external APIs to save up quotas
 *
 * - Yes, using MongoDB for caching like this is awful, but we don't want to
 *   have to manage another service by running a cache provider service.
 * - In-memory implementation might also work ok especially for our scale, but
 *   preventing the grow in memory size is tricky. If we use a database, we can
 *   manage that more easily, and it's more stable.
 * - This basically follows the `Cache-Control` directive `must-revalidate`.
 *   This means that the stored response can be reused while fresh, but we
 *   should send a new request to the server after the cache becomes stale.
 */

import mongoose from "mongoose";

/**
 * Structure of the saved reponse
 */
interface HttpCacheData {
  /**
   * The hash of the request the response is for
   *
   * For a document instance, this is also reachable as `requestHash`.
   */
  readonly _id: string;

  /**
   * Time the request was made at
   */
  requestedAt: Number;

  /**
   * Time the response was received at
   */
  receivedAt: Number;

  /**
   * HTTP status number of the response; will be 200 most of the time
   */
  status: number;

  /**
   * HTTP status text of the response
   */
  statusText: string;

  /**
   * Headers of the response
   */
  headers: [string, string][];

  /**
   * The body of the response
   */
  body: string;

  /**
   * The time this cache was stored
   */
  storedAt: Number;

  /**
   * How long this cache can be used in milliseconds
   */
  maxAge: Number;
}

/**
 * Virtuals of document instances
 *
 * This is something like C# properties.
 */
interface HttpCacheVirtuals {
  /**
   * The hash of the request this reponse is for; acts as an id
   *
   * This is an alternative way to retrieve the `_id` field.
   */
  readonly requestHash: string;
}

/**
 * The type of mongoose model
 */
type HttpCacheModelType = mongoose.Model<
  HttpCacheData,
  {},
  {},
  HttpCacheVirtuals
>;

/**
 * Schema definition for the model
 */
const HttpCacheSchema = new mongoose.Schema<HttpCacheData, HttpCacheModelType>(
  {
    _id: String,
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: "storedAt",
      currentTime: Date.now,
    },
  },
);

/**
 * Type of the document instance of this model
 */
export type HttpCacheDoc = mongoose.HydratedDocument<
  HttpCacheData,
  {},
  HttpCacheVirtuals
>;

// Virtual getter for `requestHash`
HttpCacheSchema.virtual("requestHash").get(function (this: HttpCacheDoc) {
  return this._id;
});

const modelName = "http_cache";

// Remove the previous version of the model that is already registered. While
// inefficient, this ensures that any changes made to the models are applied.
if (process.env.NODE_ENV !== "production" && mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

/**
 * Mongoose model of the http cache
 */
const HttpCache = mongoose.model<HttpCacheData, HttpCacheModelType>(
  modelName,
  HttpCacheSchema,
);
export default HttpCache;
