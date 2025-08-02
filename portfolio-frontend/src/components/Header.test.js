// Filename: src/components/Header.test.js
// This is an example of a unit test for a simple Header component.
// It uses Jest and React Testing Library to ensure the component renders correctly.

import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

// Describe a test suite for the Header component
describe('Header Component', () => {

  // Test case 1: Check if the main heading is rendered
  test('renders the main heading', () => {
    // Render the Header component
    render(<Header />);

    // Use screen to find an element with a role of heading and the text 'My Portfolio'
    const headingElement = screen.getByRole('heading', { name: /My Portfolio/i });
    
    // Assert that the heading element is present in the document
    expect(headingElement).toBeInTheDocument();
  });

  // Test case 2: Check if the navigation links are rendered
  test('renders navigation links', () => {
    // Render the Header component
    render(<Header />);

    // Use screen to find all elements with a role of link
    const homeLink = screen.getByRole('link', { name: /Home/i });
    const projectsLink = screen.getByRole('link', { name: /Projects/i });
    const contactLink = screen.getByRole('link', { name: /Contact/i });

    // Assert that each link is present in the document
    expect(homeLink).toBeInTheDocument();
    expect(projectsLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  // Test case 3: Check if the 'About' link is present
  test('renders the About navigation link', () => {
    // Render the Header component
    render(<Header />);

    // Find the link with the text 'About'
    const aboutLink = screen.getByRole('link', { name: /About/i });

    // Assert that the link is in the document
    expect(aboutLink).toBeInTheDocument();
  });

});
