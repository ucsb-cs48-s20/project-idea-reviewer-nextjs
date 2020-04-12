import validate from "validate.js";
import { authenticatedAction } from "../../../utils/api";
import { initDatabase } from "../../../utils/mongodb";

export async function getIdeas(section) {
  const client = await initDatabase();
  const users = client.collection("ideas");

  const query = {};

  if (section) {
    query.section = section;
  }

  return users.find(query).toArray();
}

const ideaConstraints = {
  title: {
    presence: true,
    length: {
      minimum: 4,
    },
  },
  description: {
    presence: true,
    length: {
      minimum: 30,
    },
  },
};

async function createIdea(req, user) {
  let newIdea;

  try {
    newIdea = await validate.async(req.body, ideaConstraints, {
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
  const ideas = client.collection("ideas");

  if (await ideas.findOne({ author: user._id })) {
    throw {
      status: 409,
      message: "User has already submitted an idea",
    };
  }

  newIdea.author = user._id;

  await ideas.insertOne(newIdea);

  return newIdea;
}

async function performAction(req, user) {
  const { section } = req.query;

  if (user.role !== "student") {
    throw { status: 403 };
  }

  switch (req.method) {
    case "GET":
      if (user.role !== "admin") {
        throw { status: 403 };
      }
      return getIdeas(section);
    case "POST":
      if (user.role !== "student") {
        throw { status: 403 };
      }
      return createIdea(req, user);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
