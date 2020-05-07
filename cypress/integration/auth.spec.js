describe("Authentication", () => {
  it("has a login button", () => {
    cy.visit("http://localhost:3000");

    // cy.get("[data-cy=login]").should("exist");
  });

  it("shows the form if I am a student", () => {});
});
