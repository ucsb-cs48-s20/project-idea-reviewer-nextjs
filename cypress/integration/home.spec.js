describe("Home Page", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.visit("http://localhost:3000");
  });

  it("has a nav bar", () => {
    // a nav element with class navbar
    cy.get("nav.navbar").should("exist");
  });

  it("has a home page brand button on nav bar", () => {
    cy.get("nav.navbar * a.navbar-brand").should("exist");
  });
});
