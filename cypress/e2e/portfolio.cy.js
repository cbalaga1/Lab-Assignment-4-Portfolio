// Filename: cypress/e2e/portfolio.cy.js
// This E2E test has been updated to be more specific in its selectors.

describe('Portfolio App User Journey', () => {

  beforeEach(() => {
    // Visit the correct base URL before each test
    cy.visit('http://localhost:3001');
  });

  // Test case 1: Test successful navigation to the contact page and form submission
  it('should navigate to the contact page and allow form submission', () => {
    // Use cy.contains() to find the button with the text 'Contact' and click it.
    cy.contains('Contact').should('be.visible').click();

    // The URL should now include '/contact'
    cy.url().should('include', '/contact');
    
    // Now, find the h1 tag *inside the main content area* and check its text.
    // This avoids finding the h1 in the header.
    cy.get('main h2').should('contain', 'Contact Me');

    // Find the input fields and type into them
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('textarea[name="message"]').type('This is a test message from Cypress.');

    // Find the submit button and click it
    cy.get('button[type="submit"]').click();

    // After submission, we expect to see a success message.
    // Update the message text below to match what your application shows.
    cy.contains('Thank you for your message!').should('be.visible');
  });

});
