import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

function getDatabaseName(connectionUri: string) {
  if (process.env.MONGODB_DB_NAME) return process.env.MONGODB_DB_NAME;

  try {
    const parsed = new URL(connectionUri);
    const dbName = parsed.pathname.replace(/^\//, "");

    if (dbName) return dbName;
  } catch {
    // MongoClient will report invalid connection strings when connecting.
  }

  return "riverwood-villa";
}

if (!uri) {
  throw new Error("MONGODB_URI is required. Set it to your MongoDB connection string.");
}

const dbName = getDatabaseName(uri);

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise = globalThis.mongoClientPromise ?? new MongoClient(uri).connect();

if (process.env.NODE_ENV !== "production") {
  globalThis.mongoClientPromise = clientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
