import auth0 from "./auth0";
import { attachUserMetadata } from "./user";

export function authenticatedAction(actionFn) {
  return async function (req, res) {
    try {
      //const { user } = await auth0.getSession(req);
      const user = {
        email: "colebergmann@gmail.com",
        family_name: "Cole",
        role: "student",
      };
      //await attachUserMetadata(user);

      const actionResult = await actionFn(req, user);

      res.statusCode = actionResult ? 200 : 204;
      res.end(JSON.stringify(actionResult));
    } catch (error) {
      console.error(error);
      res
        .status(error.status || 500)
        .end(error.message && JSON.stringify({ message: error.message }));
    }
  };
}
