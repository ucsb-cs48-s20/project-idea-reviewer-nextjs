import { reformatEmail } from "../utils/email";

describe("utils/email", () => {
  describe("reformatEmail", () => {
    it("converts @umail.ucsb.edu to @ucsb.edu", () => {
      expect(reformatEmail("tkomarlu@umail.ucsb.edu")).toBe(
        "tkomarlu@ucsb.edu"
      );
    });

    it("throws an error when parameter is not of type string", () => {
      expect(() => {
        reformatEmail(42);
      }).toThrow("email should be of type string");
    });

    it("throws an error when parameter is an empty string", () => {
      expect(() => {
        reformatEmail("");
      }).toThrow("email should not be an empty string");
    });
  });
});
