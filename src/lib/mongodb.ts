import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongoDBCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  var mongo: MongoDBCache | undefined;
}

const cached: MongoDBCache = global.mongo || {
  client: null,
  promise: null,
};

if (!global.mongo) {
  global.mongo = cached;
}

async function connectDB() {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
}

export default connectDB;