import auth0 from "./auth0";

export async function optionalAuth({ req }) {
  const session = await auth0.getSession(req);

  if (session && session.user) {
    return {
      props: {
        user: session.user,
      },
    };
  }

  return { props: {} };
}

export async function requiredAuth({ req, res }) {
  const session = await auth0.getSession(req);

  if (session && session.user) {
    return {
      props: {
        user: session.user,
      },
    };
  }

  res.writeHead(302, {
    Location: "/api/login",
  });
  res.end();
}
