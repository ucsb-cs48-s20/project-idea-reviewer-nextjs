import { ObjectId } from "mongodb";
import { authenticatedAction } from "../../../utils/api";
import { initDatabase } from "../../../utils/mongodb";

async function deleteAdmin(adminId, user) {
  // the check against the string version of "undefined"
  // is NOT a coding error; we literally saw it have the
  // string value "undefined" for reasons that elude us.

  if (adminId === undefined || adminId === "undefined") {
    throw {
      status: 400,
      message: "adminId should not be undefined",
    };
  }

  if (adminId === user._id) {
    throw {
      status: 400,
      message: "Cannot revoke admin from self",
    };
  }

  const client = await initDatabase();
  const users = client.collection("users");

  const query = {
    _id: ObjectId(adminId),
    role: "admin",
  };

  const mutation = {
    $unset: {
      role: true,
    },
  };

  const result = await users.findOneAndUpdate(query, mutation, {
    returnOriginal: false,
  });

  if (!result.value) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  return result.value;
}

async function performAction(req, user) {
  const { adminId } = req.query;

  if (user.role !== "admin") {
    throw { status: 403 };
  }

  switch (req.method) {
    case "DELETE":
      return deleteAdmin(adminId, user);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
