describe("Student Page", () => {
  context("When I am logged in as an admin", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit("http://localhost:3000/admin/students");
    });
    it("shows me admin navbar options", () => {
      cy.get(".navbar-nav").contains("Ideas");
      cy.get(".navbar-nav").contains("Admin");
    });
    it("shows me a upload csv button", () => {
      cy.get('button[name="uploadcsv"]');
    });
    it("shows me a student table", () => {
      cy.get("table");
    });
    it("shows me a student form", () => {
      cy.get("form");
    });
    it("shows me a submit button", () => {
      cy.get('button[name="submit"]');
    });
    it("allows me to fill the form", () => {
      cy.get("form");
      cy.get('input[name="fname"]')
        .type("testFname")
        .should("have.value", "testFname");
      cy.get('input[name="lname"]')
        .type("testLname")
        .should("have.value", "testLname");
      cy.get('input[name="perm"]')
        .type("1234567")
        .should("have.value", "1234567");
      cy.get('input[name="email"]')
        .type("test@ucsb.edu")
        .should("have.value", "test@ucsb.edu");
      cy.get('input[name="section"]').type("0200").should("have.value", "0200");
      cy.get("form").submit();
    });
    it("allows me to delete an student", () => {
      cy.contains("test@ucsb.edu")
        .parent("tr")
        .within(() => {
          cy.get("td").eq(5).contains("button", "Delete").click();
        });
      cy.contains("tr").should("not.contain", "test@ucsb.edu");
    });
  });

  context("When I am logged in as a student", () => {
    beforeEach(() => {
      cy.loginAsStudent();
      cy.visit("http://localhost:3000/admin/students");
    });

    it("cannot visit the student page", () => {
      cy.url().should("eq", "http://localhost:3000/");
    });
  });

  context("When I am logged in as a guest", () => {
    beforeEach(() => {
      cy.loginAsGuest();
      cy.visit("http://localhost:3000/admin/students");
    });

    it("cannot visit the student page", () => {
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
