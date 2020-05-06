describe("Home Page", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.visit("http://localhost:3000");
  });

  it("can mock auth", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: "/api/ideas",
      response: [
        {
          title: "This is an idea",
          description: "This is the body",
        },
      ],
    });
    cy.visit("http://localhost:3000/");
    //cy.get("[h2]").visit("")
  });
});
