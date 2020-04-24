export function reformatEmail(email) {
  if (typeof email === "string") {
    if (email) {
      return email.replace("@umail.ucsb.edu", "@ucsb.edu");
    } else {
      throw "Null string";
    }
  }
}
