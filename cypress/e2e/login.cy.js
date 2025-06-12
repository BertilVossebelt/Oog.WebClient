describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login"); // Adjust if necessary
  });

  it("renders the login form", () => {
    cy.get("#UsernameInput").should("exist");
    cy.get("#PasswordInput").should("exist");
    cy.get("button.submit-btn").should("contain.text", "LogIn");
  });

  it("accepts input", () => {
    cy.get("#UsernameInput").type("user@example.com");
    cy.get("#UsernameInput").should("have.value", "user@example.com");

    cy.get("#PasswordInput").type("correct_password");
    cy.get("#PasswordInput").should("have.value", "correct_password");
  });

  it("tries to log in and redirects on success", () => {
    cy.intercept("POST", "**/api/v1/account/authenticate", {
      statusCode: 200,
      body: { token: "fake-token" },
    }).as("loginRequest");

    cy.get("#UsernameInput").type("user@example.com");
    cy.get("#PasswordInput").type("correct_password");
    cy.get("button.submit-btn").click();

    cy.wait("@loginRequest");
    cy.url().should("include", "/environment-selector");
  });
});
