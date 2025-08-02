// Filename: portfolio-frontend/src/App.js
// This App component has been updated to use BrowserRouter for routing,
// so the navigation links will now work as expected.

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home'; // Assuming you have a Home component
import About from './components/About'; // Assuming you have an About component
import Projects from './components/Projects'; // Assuming you have a Projects component
import Contact from './components/Contact'; // Assuming you have a Contact component

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <Header />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
