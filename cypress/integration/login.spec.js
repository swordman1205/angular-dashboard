describe('Login', () => {

  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
  });

  xit('Login with wrong credentials and fail', () => {
    cy.get('#userInput').type('a');
    cy.get('#password').type('b').type('{enter}');
    cy.get('#swal2-content').contains('Something went wrong!')
  });

  xit('Login, and check that it has cards in dashboard', () => {
    cy.get('#userInput').type(Cypress.env("user"));
    cy.get('button').should('be.visible');
    cy.get('#password').type(Cypress.env("password")).type('{enter}');
    cy.url().should('include', 'locationDashboard');
  })
});
