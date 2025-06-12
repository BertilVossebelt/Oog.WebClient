describe("Registration Page", () => {
  beforeEach(() => {
    cy.visit("/signup"); // adjust if your route is different
  });

  it("renders registration form inputs", () => {
    cy.get("#UsernameInput").should("exist");
    cy.get("#PasswordInput").should("exist");
    cy.get("#PasswordConfirmationInput").should("exist");
    cy.get("button.submit-btn").should("exist");
    cy.get("a.login-link").should("exist");
  });

  it("accepts input in the form fields", () => {
    cy.get("#UsernameInput").type("user@example.com").should("have.value", "user@example.com");
    cy.get("#PasswordInput").type("correct_password").should("have.value", "correct_password");
    cy.get("#PasswordConfirmationInput").type("correct_password").should("have.value", "correct_password");
  });

  it("successfully registers and logs in a user", () => {
    cy.intercept("POST", "**/api/v1/account/create", {
      statusCode: 201,
      body: { message: "User created" },
    }).as("registerRequest");

    cy.intercept("POST", "**/api/v1/account/authenticate", {
      statusCode: 200,
      body: { token: "fake-token" },
    }).as("loginRequest");

    cy.get("#UsernameInput").type("newuser@example.com");
    cy.get("#PasswordInput").type("correct_password");
    cy.get("#PasswordConfirmationInput").type("correct_password");
    cy.get("button.submit-btn").click();

    cy.wait("@registerRequest");
    cy.wait("@loginRequest");

    cy.url().should("include", "/environment-selector");
  });
});