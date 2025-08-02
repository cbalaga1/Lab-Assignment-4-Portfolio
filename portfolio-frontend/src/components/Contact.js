// Filename: portfolio-frontend/src/components/Contact.js
// This component now sends form data to your LIVE backend API on Render.

import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({
    message: '',
    type: '' // 'success' or 'error'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Sending message...', type: '' });

    try {
      // The endpoint for your backend API to handle contact form submissions
      // This URL is now your LIVE Render backend URL
      const response = await fetch('https://lab4-portfolio-backend.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // The request was successful
        setStatus({
          message: 'Thank you for your message! It has been sent successfully.',
          type: 'success'
        });
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        // The server responded with an error status code
        const errorData = await response.json();
        setStatus({
          message: `Error: ${errorData.message || 'Something went wrong on the server.'}`,
          type: 'error'
        });
      }
    } catch (error) {
      // A network error occurred
      setStatus({
        message: 'Network error. Please check your connection and try again.',
        type: 'error'
      });
      console.error('Fetch error:', error);
    }
  };

  const statusClasses = status.type === 'success' 
    ? 'bg-green-100 border-green-500 text-green-700' 
    : 'bg-red-100 border-red-500 text-red-700';

  return (
    <section className="bg-white p-8 rounded-lg shadow-lg my-8">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Contact Me
      </h2>

      {status.message && (
        <div className={`border-l-4 p-4 mb-4 ${statusClasses}`} role="alert">
          <p className="font-bold">
            {status.type === 'success' ? 'Success!' : 'Error!'}
          </p>
          <p>{status.message}</p>
        </div>
      )}

      {/* Show the form only if there's no success message yet */}
      {status.type !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      )}
    </section>
  );
}

export default Contact;
