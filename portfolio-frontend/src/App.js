import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback

// This is the main App component for the Portfolio Frontend
const App = () => {
    // State variables to manage application flow and data
    const [currentPage, setCurrentPage] = useState('home'); // Controls which section is displayed
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication status
    const [userRole, setUserRole] = useState('guest'); // 'guest', 'user', 'admin'
    const [token, setToken] = useState(null); // Simulated JWT token
    const [message, setMessage] = useState(''); // General message display for user feedback

    // Data states for different sections (simulated backend data)
    const [contacts, setContacts] = useState([]);
    const [education, setEducation] = useState([]);
    const [projects, setProjects] = useState([]);

    // State for editing existing items
    const [editingContact, setEditingContact] = useState(null);
    const [editingEducation, setEditingEducation] = useState(null);
    const [editingProject, setEditingProject] = useState(null);

    // --- Simulated Backend Data and API Calls ---
    // In a real application, these would be actual fetch calls to your Node.js backend.
    // For this assignment, we're simulating them.

    // Simulated database for users
    const simulatedUsers = [
        { username: 'admin', password: 'adminpassword', role: 'admin' }, // Hardcoded Admin
        { username: 'user1', password: 'userpassword', role: 'user' },
    ];

    // Simulated data storage (these should ideally be managed in a more persistent way
    // for a real app, but for simulation, this array works)
    const [simulatedContactsData, setSimulatedContactsData] = useState([
        { id: 'c1', name: 'Clark B', email: 'clarkb@email.com', message: 'Welcome to my page and I am glad to have you here!' },
    ]);
    const [simulatedEducationData, setSimulatedEducationData] = useState([
        { id: 'e2', institution: 'Centennial College', degree: 'Diploma in Software Engineering Technology', major: 'Software', startDate: '2021-09-007', endDate: '2026-09-07' },
    ]);
    const [simulatedProjectsData, setSimulatedProjectsData] = useState([
        { id: 'p1', title: 'E-commerce Platform', description: 'Full-stack e-commerce solution.', technologies: 'React, Node.js, MongoDB', projectUrl: 'http://example.com/ecommerce' },
        { id: 'p2', title: 'Task Manager App', description: 'Simple task management application.', technologies: 'Vue.js, Firebase', projectUrl: 'http://example.com/taskmanager' },
    ]);


    // Generic simulated API call function
    const fakeApiCall = async (url, method = 'GET', data = null, authToken = null) => {
        setMessage(''); // Clear previous messages
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                try {
                    let responseData = {};
                    let status = 200;

                    if (url === '/auth/signin' && method === 'POST') {
                        const user = simulatedUsers.find(u => u.username === data.username && u.password === data.password);
                        if (user) {
                            responseData = { message: 'Sign in successful', token: 'fake-jwt-token-' + user.role, user: { username: user.username, role: user.role } };
                            status = 200;
                        } else {
                            responseData = { message: 'Invalid credentials' };
                            status = 401;
                        }
                    } else if (url === '/auth/signup' && method === 'POST') {
                        if (simulatedUsers.some(u => u.username === data.username)) {
                            responseData = { message: 'Username already exists' };
                            status = 409;
                        } else {
                            const newUser = { ...data, role: 'user' }; // New users are always 'user' role
                            simulatedUsers.push(newUser); // Add to simulated DB
                            responseData = { message: 'Sign up successful', token: 'fake-jwt-token-user', user: { username: newUser.username, role: newUser.role } };
                            status = 201;
                        }
                    } else if (url === '/auth/signout' && method === 'GET') {
                        responseData = { message: 'Sign out successful' };
                        status = 200;
                    }
                    // CRUD Operations (Protected by token/role check)
                    else {
                        const roleFromToken = authToken ? authToken.split('-').pop() : 'guest';
                        if (roleFromToken === 'guest' && (method !== 'GET' || !url.startsWith('/api/'))) {
                            responseData = { message: 'Unauthorized access' };
                            status = 403;
                        } else if (roleFromToken === 'user' && (method !== 'GET' || !url.startsWith('/api/'))) {
                            responseData = { message: 'Forbidden: Users can only view data.' };
                            status = 403;
                        } else {
                            // API endpoints
                            if (url === '/api/contacts') {
                                if (method === 'GET') {
                                    responseData = simulatedContactsData;
                                } else if (method === 'POST' && roleFromToken === 'admin') {
                                    const newContact = { id: `c${Date.now()}`, ...data };
                                    setSimulatedContactsData(prev => [...prev, newContact]); // Update state directly
                                    responseData = newContact;
                                    status = 201;
                                }
                            } else if (url.startsWith('/api/contacts/')) {
                                const id = url.split('/').pop();
                                if (method === 'PUT' && roleFromToken === 'admin') {
                                    let updated = null;
                                    setSimulatedContactsData(prev => prev.map(item => {
                                        if (item.id === id) {
                                            updated = { ...item, ...data };
                                            return updated;
                                        }
                                        return item;
                                    }));
                                    if (updated) {
                                        responseData = updated;
                                    } else {
                                        responseData = { message: 'Contact not found' };
                                        status = 404;
                                    }
                                } else if (method === 'DELETE' && roleFromToken === 'admin') {
                                    setSimulatedContactsData(prev => prev.filter(item => item.id !== id));
                                    responseData = { message: 'Contact deleted' };
                                }
                            } else if (url === '/api/education') {
                                if (method === 'GET') {
                                    responseData = simulatedEducationData;
                                } else if (method === 'POST' && roleFromToken === 'admin') {
                                    const newItem = { id: `e${Date.now()}`, ...data };
                                    setSimulatedEducationData(prev => [...prev, newItem]);
                                    responseData = newItem;
                                    status = 201;
                                }
                            } else if (url.startsWith('/api/education/')) {
                                const id = url.split('/').pop();
                                if (method === 'PUT' && roleFromToken === 'admin') {
                                    let updated = null;
                                    setSimulatedEducationData(prev => prev.map(item => {
                                        if (item.id === id) {
                                            updated = { ...item, ...data };
                                            return updated;
                                        }
                                        return item;
                                    }));
                                    if (updated) {
                                        responseData = updated;
                                    } else {
                                        responseData = { message: 'Education entry not found' };
                                        status = 404;
                                    }
                                } else if (method === 'DELETE' && roleFromToken === 'admin') {
                                    setSimulatedEducationData(prev => prev.filter(item => item.id !== id));
                                    responseData = { message: 'Education entry deleted' };
                                }
                            } else if (url === '/api/projects') {
                                if (method === 'GET') {
                                    responseData = simulatedProjectsData;
                                } else if (method === 'POST' && roleFromToken === 'admin') {
                                    const newItem = { id: `p${Date.now()}`, ...data };
                                    setSimulatedProjectsData(prev => [...prev, newItem]);
                                    responseData = newItem;
                                    status = 201;
                                }
                            } else if (url.startsWith('/api/projects/')) {
                                const id = url.split('/').pop();
                                if (method === 'PUT' && roleFromToken === 'admin') {
                                    let updated = null;
                                    setSimulatedProjectsData(prev => prev.map(item => {
                                        if (item.id === id) {
                                            updated = { ...item, ...data };
                                            return updated;
                                        }
                                        return item;
                                    }));
                                    if (updated) {
                                        responseData = updated;
                                    } else {
                                        responseData = { message: 'Project not found' };
                                        status = 404;
                                    }
                                } else if (method === 'DELETE' && roleFromToken === 'admin') {
                                    setSimulatedProjectsData(prev => prev.filter(item => item.id !== id));
                                    responseData = { message: 'Project deleted' };
                                }
                            } else {
                                responseData = { message: 'Unknown API endpoint' };
                                status = 404;
                            }
                        }
                    }

                    if (status >= 200 && status < 300) {
                        resolve(responseData);
                    } else {
                        reject(responseData);
                    }
                } catch (error) {
                    reject({ message: 'Simulated API error: ' + error.message });
                }
            }, 500); // 500ms delay
        });
    };

    // --- Authentication Handlers ---
    const handleSignIn = async (credentials) => {
        try {
            const response = await fakeApiCall('/auth/signin', 'POST', credentials);
            setIsLoggedIn(true);
            setUserRole(response.user.role);
            setToken(response.token);
            setMessage(response.message);
            setCurrentPage('home'); // Redirect to home on successful login
        } catch (error) {
            setMessage(error.message || 'Sign in failed.');
        }
    };

    const handleSignUp = async (userData) => {
        try {
            const response = await fakeApiCall('/auth/signup', 'POST', userData);
            setMessage(response.message + '. Please sign in.');
            setCurrentPage('signin'); // Redirect to sign in after successful signup
        } catch (error) {
            setMessage(error.message || 'Sign up failed.');
        }
    };

    const handleSignOut = async () => {
        try {
            const response = await fakeApiCall('/auth/signout', 'GET', null, token);
            setIsLoggedIn(false);
            setUserRole('guest');
            setToken(null);
            setMessage(response.message);
            setCurrentPage('home');
            // Clear any editing states
            setEditingContact(null);
            setEditingEducation(null);
            setEditingProject(null);
        } catch (error) {
            setMessage(error.message || 'Sign out failed.');
        }
    };

    // --- Data Fetching Functions (CRUD Read) ---
    // Wrap these in useCallback to prevent re-creation on every render
    const fetchContacts = useCallback(async () => {
        try {
            const data = await fakeApiCall('/api/contacts', 'GET', null, token);
            setContacts(data);
        } catch (error) {
            setMessage(error.message || 'Failed to fetch contacts.');
        }
    }, [token, simulatedContactsData]); // Add simulatedContactsData to dependencies

    const fetchEducation = useCallback(async () => {
        try {
            const data = await fakeApiCall('/api/education', 'GET', null, token);
            setEducation(data);
        } catch (error) {
            setMessage(error.message || 'Failed to fetch education.');
        }
    }, [token, simulatedEducationData]); // Add simulatedEducationData to dependencies

    const fetchProjects = useCallback(async () => {
        try {
            const data = await fakeApiCall('/api/projects', 'GET', null, token);
            setProjects(data);
        } catch (error) {
            setMessage(error.message || 'Failed to fetch projects.');
        }
    }, [token, simulatedProjectsData]); // Add simulatedProjectsData to dependencies


    // --- CRUD Operations (Create, Update, Delete) ---
    // Contact CRUD
    const addContact = async (newContact) => {
        try {
            // fakeApiCall now updates simulatedContactsData directly via setSimulatedContactsData
            // so we just need to re-fetch to update the local state.
            await fakeApiCall('/api/contacts', 'POST', newContact, token);
            setMessage('Contact added successfully!');
            fetchContacts(); // Re-fetch to get the updated list
        } catch (error) {
            setMessage(error.message || 'Failed to add contact.');
        }
    };

    const updateContact = async (updatedContact) => {
        try {
            await fakeApiCall(`/api/contacts/${updatedContact.id}`, 'PUT', updatedContact, token);
            setMessage('Contact updated successfully!');
            setEditingContact(null); // Exit editing mode
            fetchContacts(); // Re-fetch to get the updated list
        } catch (error) {
            setMessage(error.message || 'Failed to update contact.');
        }
    };

    const deleteContact = async (id) => {
        try {
            await fakeApiCall(`/api/contacts/${id}`, 'DELETE', null, token);
            setMessage('Contact deleted successfully!');
            fetchContacts(); // Re-fetch to get the updated list
        } catch (error) {
            setMessage(error.message || 'Failed to delete contact.');
        }
    };

    // Education CRUD
    const addEducation = async (newEntry) => {
        try {
            await fakeApiCall('/api/education', 'POST', newEntry, token);
            setMessage('Education entry added successfully!');
            fetchEducation();
        } catch (error) {
            setMessage(error.message || 'Failed to add education entry.');
        }
    };

    const updateEducation = async (updatedEntry) => {
        try {
            await fakeApiCall(`/api/education/${updatedEntry.id}`, 'PUT', updatedEntry, token);
            setMessage('Education entry updated successfully!');
            setEditingEducation(null);
            fetchEducation();
        } catch (error) {
            setMessage(error.message || 'Failed to update education entry.');
        }
    };

    const deleteEducation = async (id) => {
        try {
            await fakeApiCall(`/api/education/${id}`, 'DELETE', null, token);
            setMessage('Education entry deleted successfully!');
            fetchEducation();
        } catch (error) {
            setMessage(error.message || 'Failed to delete education entry.');
        }
    };

    // Project CRUD
    const addProject = async (newProject) => {
        try {
            await fakeApiCall('/api/projects', 'POST', newProject, token);
            setMessage('Project added successfully!');
            fetchProjects();
        } catch (error) {
            setMessage(error.message || 'Failed to add project.');
        }
    };

    const updateProject = async (updatedProject) => {
        try {
            await fakeApiCall(`/api/projects/${updatedProject.id}`, 'PUT', updatedProject, token);
            setMessage('Project updated successfully!');
            setEditingProject(null);
            fetchProjects();
        } catch (error) {
            setMessage(error.message || 'Failed to update project.');
        }
    };

    const deleteProject = async (id) => {
        try {
            await fakeApiCall(`/api/projects/${id}`, 'DELETE', null, token);
            setMessage('Project deleted successfully!');
            fetchProjects();
        } catch (error) {
            setMessage(error.message || 'Failed to delete project.');
        }
    };

    // --- useEffect for initial data load and when token changes ---
    useEffect(() => {
        // Fetch data when component mounts or token/login status changes
        fetchContacts();
        fetchEducation();
        fetchProjects();
    }, [isLoggedIn, token, fetchContacts, fetchEducation, fetchProjects]); // Now includes fetch functions in dependencies

    // --- Sub-Components for Forms and Display ---

    // Generic Form Component
    const Form = ({ fields, onSubmit, initialData = {}, submitButtonText, title }) => {
        const [formData, setFormData] = useState(initialData);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(formData);
        };

        return (
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto my-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{title}</h2>
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label htmlFor={field.name} className="block text-gray-700 text-sm font-semibold mb-2">
                                {field.label}
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                ></textarea>
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {submitButtonText}
                    </button>
                </form>
            </div>
        );
    };

    // Sign In Form
    const SignInForm = () => {
        const fields = [
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
        ];
        return (
            <Form
                fields={fields}
                onSubmit={handleSignIn}
                submitButtonText="Sign In"
                title="Sign In"
            />
        );
    };

    // Sign Up Form
    const SignUpForm = () => {
        const fields = [
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
        ];
        return (
            <Form
                fields={fields}
                onSubmit={handleSignUp}
                submitButtonText="Sign Up"
                title="Sign Up"
            />
        );
    };

    // Contact Form (for adding/editing)
    const ContactForm = ({ initialData, onSubmit, title }) => {
        const fields = [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'message', label: 'Message', type: 'textarea', required: true },
        ];
        return (
            <Form
                fields={fields}
                onSubmit={onSubmit}
                initialData={initialData}
                submitButtonText={initialData ? 'Update Contact' : 'Add Contact'}
                title={title}
            />
        );
    };

    // Education Form (for adding/editing)
    const EducationForm = ({ initialData, onSubmit, title }) => {
        const fields = [
            { name: 'institution', label: 'Institution', type: 'text', required: true },
            { name: 'degree', label: 'Degree', type: 'text', required: true },
            { name: 'major', label: 'Major', type: 'text', required: true },
            { name: 'startDate', label: 'Start Date', type: 'date', required: true },
            { name: 'endDate', label: 'End Date', type: 'date', required: true },
        ];
        return (
            <Form
                fields={fields}
                onSubmit={onSubmit}
                initialData={initialData}
                submitButtonText={initialData ? 'Update Education' : 'Add Education'}
                title={title}
            />
        );
    };

    // Project Form (for adding/editing)
    const ProjectForm = ({ initialData, onSubmit, title }) => {
        const fields = [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'technologies', label: 'Technologies (comma-separated)', type: 'text', required: true },
            { name: 'projectUrl', label: 'Project URL', type: 'url', required: false },
        ];
        return (
            <Form
                fields={fields}
                onSubmit={onSubmit}
                initialData={initialData}
                submitButtonText={initialData ? 'Update Project' : 'Add Project'}
                title={title}
            />
        );
    };

    // --- Main Layout and Conditional Rendering ---
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
            {/* Removed Tailwind CSS CDN and Inter font link - now handled by index.css */}

            {/* Header / Navigation */}
            <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-md">
                <nav className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold">My Portfolio</h1>
                    <ul className="flex space-x-6">
                        <li><button onClick={() => setCurrentPage('home')} className="hover:text-blue-200 transition-colors duration-200">Home</button></li>
                        <li><button onClick={() => setCurrentPage('contact')} className="hover:text-blue-200 transition-colors duration-200">Contact</button></li>
                        <li><button onClick={() => setCurrentPage('education')} className="hover:text-blue-200 transition-colors duration-200">Education</button></li>
                        <li><button onClick={() => setCurrentPage('projects')} className="hover:text-blue-200 transition-colors duration-200">Projects</button></li>
                        {isLoggedIn ? (
                            <>
                                <li className="text-blue-200">({userRole})</li>
                                <li><button onClick={handleSignOut} className="hover:text-blue-200 transition-colors duration-200">Sign Out</button></li>
                            </>
                        ) : (
                            <>
                                <li><button onClick={() => setCurrentPage('signin')} className="hover:text-blue-200 transition-colors duration-200">Sign In</button></li>
                                <li><button onClick={() => setCurrentPage('signup')} className="hover:text-blue-200 transition-colors duration-200">Sign Up</button></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            {/* Message Display */}
            {message && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mx-auto my-4 max-w-lg text-center shadow-md" role="alert">
                    <span className="block sm:inline">{message}</span>
                </div>
            )}

            {/* Main Content Area */}
            <main className="container mx-auto p-4">
                {currentPage === 'home' && (
                    <section className="bg-white p-8 rounded-lg shadow-lg my-8 text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to My Portfolio Assignment 3!</h2>
                        <p className="text-lg text-gray-700">
                            This is a full-stack application demonstrating frontend-backend integration, CRUD operations, and authentication with user roles.
                        </p>
                        <p className="text-md text-gray-600 mt-4">
                            {isLoggedIn ? `You are logged in as a ${userRole}.` : 'Please sign in or sign up to explore more features.'}
                        </p>
                        {userRole === 'admin' && (
                            <p className="text-md text-green-600 font-semibold mt-2">
                                As an Admin, you can add, edit, and delete items in Contact, Education, and Projects sections.
                            </p>
                        )}
                        {userRole === 'user' && (
                            <p className="text-md text-blue-600 font-semibold mt-2">
                                As a User, you can view all portfolio data.
                            </p>
                        )}
                    </section>
                )}

                {currentPage === 'signin' && <SignInForm />}
                {currentPage === 'signup' && <SignUpForm />}

                {currentPage === 'contact' && (
                    <section className="my-8">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Me</h2>
                        {userRole === 'admin' && (
                            <div className="text-center mb-6">
                                <button
                                    onClick={() => setEditingContact({})} // Set an empty object to indicate 'add new'
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Add New Contact Entry
                                </button>
                            </div>
                        )}

                        {editingContact && (
                            <ContactForm
                                initialData={editingContact.id ? editingContact : {}}
                                onSubmit={(data) => {
                                    if (editingContact.id) {
                                        updateContact({ ...data, id: editingContact.id });
                                    } else {
                                        addContact(data);
                                    }
                                    setEditingContact(null); // Exit editing/adding mode
                                }}
                                title={editingContact.id ? 'Edit Contact Entry' : 'Add New Contact Entry'}
                            />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contacts.length === 0 ? (
                                <p className="col-span-full text-center text-gray-600">No contact entries found.</p>
                            ) : (
                                contacts.map((contact) => (
                                    <div key={contact.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{contact.name}</h3>
                                        <p className="text-gray-700 mb-1"><strong>Email:</strong> {contact.email}</p>
                                        <p className="text-gray-700 mb-4"><strong>Message:</strong> {contact.message}</p>
                                        {userRole === 'admin' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setEditingContact(contact)}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg text-sm shadow-sm transition duration-300"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteContact(contact.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm shadow-sm transition duration-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {currentPage === 'education' && (
                    <section className="my-8">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">My Education & Qualifications</h2>
                        {userRole === 'admin' && (
                            <div className="text-center mb-6">
                                <button
                                    onClick={() => setEditingEducation({})}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Add New Education Entry
                                </button>
                            </div>
                        )}

                        {editingEducation && (
                            <EducationForm
                                initialData={editingEducation.id ? editingEducation : {}}
                                onSubmit={(data) => {
                                    if (editingEducation.id) {
                                        updateEducation({ ...data, id: editingEducation.id });
                                    } else {
                                        addEducation(data);
                                    }
                                    setEditingEducation(null);
                                }}
                                title={editingEducation.id ? 'Edit Education Entry' : 'Add New Education Entry'}
                            />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {education.length === 0 ? (
                                <p className="col-span-full text-center text-gray-600">No education entries found.</p>
                            ) : (
                                education.map((edu) => (
                                    <div key={edu.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{edu.institution}</h3>
                                        <p className="text-gray-700 mb-1"><strong>Degree:</strong> {edu.degree}</p>
                                        <p className="text-gray-700 mb-1"><strong>Major:</strong> {edu.major}</p>
                                        <p className="text-gray-700 mb-4"><strong>Dates:</strong> {edu.startDate} - {edu.endDate}</p>
                                        {userRole === 'admin' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setEditingEducation(edu)}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg text-sm shadow-sm transition duration-300"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteEducation(edu.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm shadow-sm transition duration-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {currentPage === 'projects' && (
                    <section className="my-8">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">My Projects</h2>
                        {userRole === 'admin' && (
                            <div className="text-center mb-6">
                                <button
                                    onClick={() => setEditingProject({})}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Add New Project
                                </button>
                            </div>
                        )}

                        {editingProject && (
                            <ProjectForm
                                initialData={editingProject.id ? editingProject : {}}
                                onSubmit={(data) => {
                                    if (editingProject.id) {
                                        updateProject({ ...data, id: editingProject.id });
                                    } else {
                                        addProject(data);
                                    }
                                    setEditingProject(null);
                                }}
                                title={editingProject.id ? 'Edit Project' : 'Add New Project'}
                            />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.length === 0 ? (
                                <p className="col-span-full text-center text-gray-600">No projects found.</p>
                            ) : (
                                projects.map((project) => (
                                    <div key={project.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                                        <p className="text-gray-700 mb-2">{project.description}</p>
                                        <p className="text-gray-600 text-sm mb-2"><strong>Technologies:</strong> {project.technologies}</p>
                                        {project.projectUrl && (
                                            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mb-4 block">
                                                View Project
                                            </a>
                                        )}
                                        {userRole === 'admin' && (
                                            <div className="flex space-x-2 mt-4">
                                                <button
                                                    onClick={() => setEditingProject(project)}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg text-sm shadow-sm transition duration-300"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm shadow-sm transition duration-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center p-4 mt-8">
                <p>&copy; {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
