describe("Authentication", () => {
  it("Is a login button", () => {
    cy.visit("http://localhost:3000");

    cy.get("[data-cy=login]").should("exist");
  });
});
