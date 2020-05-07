describe("Authentication", () => {
  context("When I am logged in as an admin", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("http://localhost:3000");
    });

    it("shows me admin navbar options", () => {
      cy.get(".navbar-nav").contains("Ideas");
      cy.get(".navbar-nav").contains("Admin");
    });

    it("shows me a warning", () => {
      cy.get(".alert").contains("Admins can not submit ideas");
    });
  });

  context("When I am logged in as a student", () => {
    beforeEach(() => {
      cy.loginAsStudent();
      cy.visit("http://localhost:3000");
    });

    it("shows me an idea submission form", () => {});
  });

  context("When I am logged in as a guest", () => {
    beforeEach(() => {
      cy.loginAsGuest();
      cy.visit("http://localhost:3000");
    });

    it("tells me I'm not enrolled in the course", () => {});
  });

  context("When I am not logged in", () => {
    it("has a login button", () => {
      cy.visit("http://localhost:3000");

      cy.get("[data-cy=login]").should("exist");
    });
  });
});
