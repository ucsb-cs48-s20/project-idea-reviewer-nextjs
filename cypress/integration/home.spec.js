describe("Home Page", () => {
  it("has a nav bar", () => {
    cy.visit("http://localhost:3000");

    // a nav element with class navbar
    cy.get("nav.navbar").should("exist");
  });
  it("has a home page brand button on nav bar", () => {
    cy.visit("http://localhost:3000");
    cy.get("nav.navbar * a.navbar-brand").should("exist");
  });

  it("has a footer element", () => {
    cy.visit("http://localhost:3000");
    cy.get("footer.footer").should("exist");
  });
});
