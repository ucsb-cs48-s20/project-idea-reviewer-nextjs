import { MongoClient } from "mongodb";
import config from "./config";

const client = new MongoClient(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let connected = false;

export async function initDatabase() {
  if (!connected) {
    await client.connect();
    connected = true;
  }
  return client.db("database");
}

export function serializeDocument(doc, options = {}) {
  // TODO remove side effects
  const { idFields = ["_id"] } = options;

  for (const idField of idFields) {
    if (doc[idField]) {
      doc[idField] = doc[idField].toString();
    }
  }

  return doc;
}
