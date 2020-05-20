import { ObjectId } from "mongodb";
import { authenticatedAction } from "../../../../utils/api";
import { initDatabase } from "../../../../utils/mongodb";

async function deleteIdea(ideaId) {
  // the check against the string version of "undefined"
  // is NOT a coding error; we literally saw it have the
  // string value "undefined" for reasons that elude us.

  if (ideaId === undefined || ideaId === "undefined") {
    throw {
      status: 400,
      message: "ideaId should not be undefined",
    };
  }

  const client = await initDatabase();
  const ideas = client.collection("ideas");

  const query = {
    _id: ObjectId(ideaId),
  };

  const result = await ideas.deleteOne(query);

  if (!result.deletedCount) {
    throw {
      status: 404,
      message: "Idea not found",
    };
  }
  return result;
}

async function performAction(req, user) {
  const { ideaId } = req.query;

  if (user.role !== "admin") {
    throw { status: 403 };
  }

  switch (req.method) {
    case "DELETE":
      return deleteIdea(ideaId);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
