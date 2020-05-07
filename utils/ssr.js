import auth0 from "./auth0";
import { attachUserMetadata } from "./user";

async function getUserSession(req) {
  const session = await auth0.getSession(req);

  if (session && session.user) {
    await attachUserMetadata(session.user);
    return session.user;
  }

  return null;
}

export async function optionalAuth({ req }) {
  console.log(req.headers.cookie.split(";"));
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
