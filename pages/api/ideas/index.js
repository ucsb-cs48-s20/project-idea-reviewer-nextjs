import validate from "validate.js";
import { authenticatedAction } from "../../../utils/api";
import { initDatabase } from "../../../utils/mongodb";

export async function getIdeas(section) {
  const client = await initDatabase();
  const users = client.collection("ideas");

  const query = {};
  const agg = [
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (section) {
    agg.push({
      $match: {
        "author.section": section,
      },
    });
  }

  return users.aggregate(agg).toArray();
}

/**
 * Returns ideas for a given student
 * (accessible by students at /api/ideas)
 */
export async function getStudentIdeas(user) {
  const client = await initDatabase();
  const ideas = client.collection("ideas");
  return ideas.find({ author: user._id }).toArray();
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

  switch (req.method) {
    case "GET":
      if (user.role === "admin") {
        return getIdeas(section);
      }
      if (user.role === "student") {
        return getStudentIdeas(user);
      }
      throw { status: 403 };
    case "POST":
      if (user.role !== "student") {
        throw { status: 403 };
      }
      return createIdea(req, user);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
