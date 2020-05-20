import { ObjectId } from "mongodb";
import { authenticatedAction } from "../../../utils/api";
import { initDatabase } from "../../../utils/mongodb";

async function deleteStudent(studentId) {
  const client = await initDatabase();
  const users = client.collection("users");

  // the check against the string version of "undefined"
  // is NOT a coding error; we literally saw it have the
  // string value "undefined" for reasons that elude us.

  if (studentId === undefined || studentId === "undefined") {
    throw {
      status: 400,
      message: "studentId should not be undefined",
    };
  }

  const query = {
    _id: ObjectId(studentId),
    role: "student",
  };

  const mutation = {
    $unset: {
      role: true,
      section: true,
    },
  };

  const result = await users.findOneAndUpdate(query, mutation, {
    returnOriginal: false,
  });

  if (!result.value) {
    throw {
      statusCode: 404,
      message: "User not found",
    };
  }

  return result.value;
}

async function performAction(req, user) {
  const { studentId } = req.query;

  if (user.role !== "admin") {
    throw { status: 403 };
  }

  switch (req.method) {
    case "DELETE":
      return deleteStudent(studentId, user);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
