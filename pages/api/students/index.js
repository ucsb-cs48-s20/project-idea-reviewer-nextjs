import validate from "validate.js";
import { authenticatedAction } from "../../../utils/api";
import { initDatabase } from "../../../utils/mongodb";

export async function getStudents(section) {
  const client = await initDatabase();
  const users = client.collection("users");

  const query = {
    role: "student",
  };

  if (section) {
    query.section = section;
  }

  return users.find(query).toArray();
}

const studentConstraints = {
  email: {
    presence: true,
    email: true,
  },
  section: {
    presence: true,
  },
};

async function createStudent(req) {
  let student;

  try {
    student = await validate.async(req.body, studentConstraints, {
      cleanAttributes: true,
      format: "flat",
    });
  } catch (err) {
    throw {
      status: 400,
      message: err.join(", "),
    };
  }

  const client = await initDatabase();
  const users = client.collection("users");

  const user = await users.findOne({ email: student.email });

  if (user != null) {
    if (user.role === "admin" || user.role === "student") {
      throw {
        status: 409,
        message: "User already exists; cannot be converted to a student",
      };
    }
  }
  const query = { email: student.email };
  const mutation = {
    $setOnInsert: {
      email: student.email,
    },
    $set: {
      role: "student",
      section: student.section,
    },
  };

  const result = await users.findOneAndUpdate(query, mutation, {
    upsert: true,
    returnOriginal: false,
  });

  return result.value;
}

async function performAction(req, user) {
  const { section } = req.query;

  if (user.role !== "admin") {
    throw { status: 403 };
  }

  switch (req.method) {
    case "GET":
      return getStudents(section);
    case "POST":
      return createStudent(req);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
