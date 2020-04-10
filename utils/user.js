import { initDatabase } from "./mongodb"

export async function attachRoleInformation(user) {
  const client = await initDatabase();
  const users = client.collection("users");

  const result = await users.findOne({ email: user.email });

  if (result) {
    user.role = result.role || "guest"
  }
}
