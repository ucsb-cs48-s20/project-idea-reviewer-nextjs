import auth0 from "./auth0";
import { attachUserMetadata } from "./user";
import config from "./config";

async function getUserSession(req) {
  let session;
  if (config.USE_TEST_AUTH) {
    const cookies = req.headers.cookie?.split(";");
    const authCookiePrefix = "AUTH=";
    const sessionCookie = cookies?.filter((cookie) =>
      cookie.startsWith(authCookiePrefix)
    )[0];

    if (sessionCookie) {
      session = {
        user: JSON.parse(sessionCookie.slice(authCookiePrefix.length)),
      };
    }
  } else {
    session = await auth0.getSession(req);
  }

  if (session && session.user) {
    await attachUserMetadata(session.user);
    return session.user;
  }

  return null;
}

export async function optionalAuth({ req }) {
  const user = await getUserSession(req);

  if (user) {
    return {
      props: {
        user,
      },
    };
  }

  return { props: {} };
}

export function createRequiredAuth({ roles = [] }) {
  return async function ({ req, res }) {
    const user = await getUserSession(req);

    if (user) {
      if (roles.includes(user.role)) {
        return {
          props: {
            user,
          },
        };
      }

      res.writeHead(302, {
        Location: "/",
      });
      res.end();
    }

    res.writeHead(302, {
      Location: "/api/login",
    });
    res.end();
  };
}
