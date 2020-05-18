import auth0 from "./auth0";
import { attachUserMetadata } from "./user";
import config from "./config";
import { getUserSession } from "./ssr";

export function authenticatedAction(actionFn) {
  async function apiHandler(req, res) {
    try {
      const user = await getUserSession(req);

      const actionResult = await actionFn(req, user);

      res.statusCode = actionResult ? 200 : 204;
      res.end(JSON.stringify(actionResult));
    } catch (error) {
      console.error(error);
      res
        .status(error.status || 500)
        .end(error.message && JSON.stringify({ message: error.message }));
    }
  }
  if (config.USE_TEST_AUTH) {
    return apiHandler;
  }
  return auth0.requireAuthentication(apiHandler);
}
