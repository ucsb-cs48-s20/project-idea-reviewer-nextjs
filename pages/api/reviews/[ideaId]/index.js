import { ObjectId } from "mongodb";
import { authenticatedAction } from "../../../../utils/api";
import { initDatabase } from "../../../../utils/mongodb";
import validate from "validate.js";

const reviewConstraints = {
  rating: {
    presence: true,
    numericality: {
      greaterThanOrEqualTo: 1,
      lessThanOrEqualTo: 5,
      onlyInteger: true,
    },
  },
  description: {
    presence: true,
    length: {
      minimum: 30,
    },
  },
};

async function addReview(req, user, ideaId) {
  let newReview;

  try {
    newReview = await validate.async(req.body, reviewConstraints, {
      cleanAttributes: true,
      format: "flat",
    });
  } catch (err) {
    throw {
      status: 400,
      message: err.join(", "),
    };
  }

  newReview.author = ObjectId(user._id);

  const client = await initDatabase();
  const ideas = client.collection("ideas");
  const idea = await ideas.findOne({ _id: ObjectId(ideaId) });

  if (!idea) {
    throw {
      status: 400,
      message: "This idea does not exist",
    };
  } else if (idea.author.toString() === user._id) {
    throw {
      status: 400,
      message: "User cannot review their own idea",
    };
  } else if (
    idea.reviews &&
    idea.reviews.filter((review) => {
      return review.author.toString() === user._id;
    }).length !== 0
  ) {
    throw {
      status: 409,
      message: "User has already submitted a review for this idea",
    };
  }

  await ideas.updateOne(
    { _id: ObjectId(ideaId) },
    {
      $push: {
        reviews: newReview,
      },
    }
  );

  return newReview;
}

async function performAction(req, user) {
  const { ideaId } = req.query;

  if (user.role !== "student") {
    throw { status: 403 };
  }

  switch (req.method) {
    case "POST":
      return addReview(req, user, ideaId);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
