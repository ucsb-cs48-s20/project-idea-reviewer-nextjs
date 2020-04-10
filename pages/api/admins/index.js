import { authenticatedAction } from "../../../utils/api";
import { initDatabase } from "../../../utils/mongodb";

async function getAdmins() {
  const client = await initDatabase();
  const users = client.collection("users");

  return users.find({ role: "admin" }).toArray();
}

async function createAdmin(req) {
  const { email } = req.body;

  if (!email) {
    throw {
      status: 400,
      message: "Missing email",
    };
  }

  const client = await initDatabase();
  const users = client.collection("users");

  const query = {
    email,
  };

  const mutation = {
    $setOnInsert: {
      email,
    },
    $set: {
      role: "admin",
    },
  };

  const result = await users.findOneAndUpdate(query, mutation, {
    upsert: true,
    returnOriginal: false,
  });

  return result.value;
}

async function performAction(req, user) {
  if (user.role !== "admin") {
    throw { status: 403 };
  }

  switch (req.method) {
    case "GET":
      return getAdmins();
    case "POST":
      return createAdmin(req);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
