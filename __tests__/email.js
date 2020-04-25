import { reformatEmail } from "../utils/email.js";

describe("", () => {
  it("converts @umail.ucsb.edu to @ucsb.edu", () => {
    expect(reformatEmail("tkomarlu@umail.ucsb.edu")).toBe("tkomarlu@ucsb.edu");
  });

  it("throws when receiving invalid inputs", () => {
    expect(() => {
      reformatEmail("");
    }).toThrow();
  });
});
