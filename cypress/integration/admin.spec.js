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
        .type("admin1@ucsb.edu")
        .should("have.value", "admin1@ucsb.edu");
      cy.get("form").submit();
    });
    function addAdmin(email) {
      cy.get("form");
      cy.get('input[name="email"]').type(email).should("have.value", email);
      cy.get("form").submit();
    }
    it("allows me to delete an admin", () => {
      addAdmin("admin2@ucsb.edu");
      cy.contains("admin2@ucsb.edu")
        .parent("tr")
        .within(() => {
          cy.get("td").eq(2).contains("button", "Delete").click();
        });
      cy.contains("tr").should("not.contain", "admin2@ucsb.edu");
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
