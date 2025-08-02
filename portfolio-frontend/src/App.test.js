// Filename: src/App.test.js
// This test file has been updated to check for the current content of your App.js component.

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the welcome message', () => {
  // Render the entire App component
  render(<App />);

  // Look for the element that contains the welcome message you showed in the output.
  // The 'i' flag makes the search case-insensitive.
  const welcomeMessage = screen.getByText(/Welcome to My Portfolio Assignment 3!/i);

  // Assert that the welcome message is present in the document
  expect(welcomeMessage).toBeInTheDocument();
});

test('renders the footer text', () => {
  // Render the entire App component
  render(<App />);

  // Look for the element that contains the copyright notice in the footer.
  const footerText = screen.getByText(/My Portfolio. All rights reserved./i);

  // Assert that the footer text is present in the document
  expect(footerText).toBeInTheDocument();
});
