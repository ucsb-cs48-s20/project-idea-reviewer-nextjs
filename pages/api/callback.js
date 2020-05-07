import auth0 from "../../utils/auth0";

export default async function (req, res) {
  try {
    await auth0.handaleCallback(req, res, { redirectTo: "/" });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
