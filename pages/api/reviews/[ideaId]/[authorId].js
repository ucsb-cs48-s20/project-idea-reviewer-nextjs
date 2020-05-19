import { ObjectId } from "mongodb";
import { authenticatedAction } from "../../../../utils/api";
import { initDatabase } from "../../../../utils/mongodb";

async function deleteReview(ideaId, authorId) {
  const client = await initDatabase();
  const ideas = client.collection("ideas");

  const result = await ideas.updateOne(
    { _id: ObjectId(ideaId) },
    {
      $pull: { reviews: { author: ObjectId(authorId) } },
    }
  );

  if (!result.modifiedCount) {
    throw {
      status: 404,
      message: "Review not found",
    };
  }
}

async function performAction(req, user) {
  const { ideaId, authorId } = req.query;

  if (user.role !== "admin") {
    throw { status: 403 };
  }

  switch (req.method) {
    case "DELETE":
      return deleteReview(ideaId, authorId);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
