import { initDatabase } from "../../../utils/mongodb";

export async function performPrepareDatabase() {
  const client = await initDatabase();

  const users = client.collection("users");
  const ideas = client.collection("ideas");

  const result = {};
  result.removeUsers = await users.deleteMany({}); // removes all users
  result.removeIdeas = await ideas.deleteMany({}); // removes all ideas

  result.insertAdmin = await users.insertOne({
    email: "admin@example.com",
    role: "admin",
  });

  result.insertStudent = await users.insertOne({
    email: "student@example.com",
    role: "student",
    perm: "1111111",
    section: "0201",
    fname: "Example",
    lname: "Student",
  });
  console.log("Database has been reset for cypress tests");
  return result;
}

export default async function prepareDatabase(req, res) {
  if (!process.env.USE_TEST_AUTH) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: "This endpoint only valid when running cypress tests",
      })
    );
    return;
  }
  switch (req.method) {
    case "POST":
      const result = await performPrepareDatabase();
      res.statusCode = 200;
      res.end(JSON.stringify(result));
      return;
  }

  throw { status: 405 };
}
