import validate from "validate.js";
import { authenticatedAction } from "../../../utils/api";
import { initDatabase } from "../../../utils/mongodb";

export async function getReviews(section) {
  const client = await initDatabase();
  const users = client.collection("ideas");

  const agg = [
    {
      $project: {
        author: false,
        description: false,
      },
    },
    {
      $unwind: {
        path: "$reviews",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reviews.author",
        foreignField: "_id",
        as: "reviews.author",
      },
    },
    {
      $unwind: {
        path: "$reviews.author",
        preserveNullAndEmptyArrays: false,
      },
    },
  ];

  return users.aggregate(agg).toArray();
}

async function performAction(req, user) {
  switch (req.method) {
    case "GET":
      if (user.role !== "admin") {
        throw { status: 403 };
      }
      return getReviews();
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
