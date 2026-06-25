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
  // eslint-disable-next-line no-var
  var mongoIndexesPromise: Promise<void> | undefined;
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

export async function ensureMongoIndexes(): Promise<void> {
  if (!globalThis.mongoIndexesPromise) {
    globalThis.mongoIndexesPromise = (async () => {
      const db = await getMongoDb();
      const roomsCollectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";

      await Promise.all([
        db.collection("bookings").createIndex({ createdAt: -1 }),
        db.collection("bookings").createIndex({ status: 1, createdAt: -1 }),
        db.collection("bookings").createIndex({ roomId: 1, createdAt: -1 }),
        db.collection("bookings").createIndex({ checkIn: 1, status: 1 }),
        db.collection(roomsCollectionName).createIndex({ sortOrder: 1, createdAt: -1 }),
        db.collection(roomsCollectionName).createIndex({ isAvailable: 1, status: 1, sortOrder: 1 }),
        db.collection("roomBlocks").createIndex({ dateKey: 1, active: 1 }),
        db.collection("roomBlocks").createIndex(
          { roomId: 1, dateKey: 1 },
          { unique: true, partialFilterExpression: { active: true } }
        ),
      ]);
    })();
  }

  return globalThis.mongoIndexesPromise;
}
