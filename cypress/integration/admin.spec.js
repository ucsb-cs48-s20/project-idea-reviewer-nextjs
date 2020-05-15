describe("Admin Page", () => {
  context("When I am logged in as an admin", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("http://localhost:3000/admin/admins");
    });
    it("shows me admin navbar options", () => {
      cy.get(".navbar-nav").contains("Ideas");
      cy.get(".navbar-nav").contains("Admin");
    });
    it("shows me a admin table", () => {
      cy.get("table");
    });
    it("shows me a admin form", () => {
      cy.get("form");
    });
    it("shows me a submit button", () => {
      cy.get('button[name="submit"]');
    });
    it("allows me to fill the form", () => {
      cy.get("form");
      cy.get('input[name="email"]')
        .type("test@ucsb.edu")
        .should("have.value", "test@ucsb.edu");
      cy.get("form").submit();
    });
    it("allows me to delete an admin", () => {
      cy.contains("test@ucsb.edu")
        .parent("tr")
        .within(() => {
          cy.get("td").eq(2).contains("button", "Delete").click();
        });
      cy.contains("tr").should("not.contain", "test@ucsb.edu");
    });
  });

  context("When I am logged in as a student", () => {
    beforeEach(() => {
      cy.loginAsStudent();
      cy.visit("http://localhost:3000/admin/admins");
    });

    it("cannot visit the admin page", () => {
      cy.url().should("eq", "http://localhost:3000/");
    });
  });

  context("When I am logged in as a guest", () => {
    beforeEach(() => {
      cy.loginAsGuest();
      cy.visit("http://localhost:3000/admin/admins");
    });

    it("cannot visit the admin page", () => {
      cy.url().should("eq", "http://localhost:3000/");
    });
  });

  context("When I am not logged in", () => {
    it("has a login button", () => {
      cy.visit("http://localhost:3000");

      cy.get("[data-cy=login]").should("exist");
    });
  });
});
