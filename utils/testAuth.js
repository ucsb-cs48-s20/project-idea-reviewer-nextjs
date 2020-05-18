export function getTestAuthSession(req) {
  const cookies = req.headers.cookie?.split(";");
  const authCookiePrefix = "AUTH=";
  const sessionCookie = cookies?.filter((cookie) =>
    cookie.startsWith(authCookiePrefix)
  )[0];

  if (sessionCookie) {
    return {
      user: JSON.parse(sessionCookie.slice(authCookiePrefix.length)),
    };
  }
}
