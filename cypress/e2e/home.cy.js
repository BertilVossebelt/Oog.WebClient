describe("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Navigation functionality", () => {
    it("should navigate to signup page when clicking Get started", () => {
      cy.get('.a-register').click();
      cy.url().should('include', '/signup');
    });

    it("should navigate to login page when clicking login link", () => {
      cy.get('.a-login').click();
      cy.url().should('include', '/login');
    });
  });
});