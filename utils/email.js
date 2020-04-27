function throwError(message) {
  throw new Error(message);
}

export function reformatEmail(email) {
  typeof email === "string" || throwError("email should be of type string");
  email || throwError("email should not be an empty string");
  return email.replace("@umail.ucsb.edu", "@ucsb.edu");
}
