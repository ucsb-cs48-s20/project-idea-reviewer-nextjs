import { initDatabase } from "./mongodb";

export async function attachUserMetadata(user) {
  const client = await initDatabase();
  const users = client.collection("users");

  const result = await users.findOne({ email: user.email });

  if (result) {
    user._id = result._id.toString();
    user.role = result.role || "guest";
  }
}
