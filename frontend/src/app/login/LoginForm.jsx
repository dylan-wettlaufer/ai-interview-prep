"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";


export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
        // Clear error for the field being changed
        setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = 'Invalid email address';
        }

        if (!formData.password) {
        newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
        }

        setIsLoading(true);
        setErrors({});

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

        try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            }),
        });

        // Handle HTTP errors properly
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
            const error = new Error(errorData.detail || 'Login failed');
            error.status = response.status;
            error.isHttpError = true;
            throw error;
        }


        // Clear any existing errors
        setErrors({});

        const data = await response.json();
        if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        setSuccessMessage('Login successful!');
        // Reset form after successful login
        setFormData({
            email: '',
            password: '',
        });

        setIsLoading(false);

        setTimeout(() => {
            router.push('/dashboard');
        }, 100);

        } catch (error) {
        console.error('Login failed:', error.message);
        
        // Handle different types of errors
        let errorMessage = 'Login failed. Please try again or contact support if the issue persists.';
        
        if (error.isHttpError && error.status === 400) {
            // HTTP 400 errors from our backend (credential errors)
            if (error.message.includes('incorrect') || error.message.includes('credentials')) {
                errorMessage = 'The email or password you entered is incorrect. Please check your credentials and try again.';
            } else {
                errorMessage = error.message;
            }
        } else if (error.isHttpError && error.status === 429) {
            // Rate limiting errors
            errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            // Network errors (fetch failed)
            errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (error.message) {
            // Any other error with a message
            errorMessage = error.message;
        }
        
        setErrors({
            ...errors,
            general: errorMessage
        });
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-md">
         
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h1 className="text-3xl font-bold text-center text-blue-950 mb-8">
                Login
            </h1>
    
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 mb-6 rounded-lg text-sm">
                {successMessage}
                </div>
            )}
    
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                {[
                    { label: 'Email address', id: 'email', type: 'email' },
                    { label: 'Password', id: 'password', type: 'password' },
                ].map(({ label, id, type = 'text' }) => (
                    <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                    <input
                        type={type}
                        id={id}
                        name={id}
                        value={formData[id]}
                        onChange={handleChange}
                        className={`mt-1 mb-4 p-3 h-10 block w-full rounded-md bg-white text-gray-900 border border-gray-300 shadow-sm focus:border-blue-950 focus:ring-1 focus:ring-blue-950 ${
                        errors[id] ? 'border-red-500 ring-red-500' : ''
                        }`}
                    />
                    {errors[id] && (
                        <p className="mt-1 text-xs text-red-500">{errors[id]}</p>
                    )}
                    </div>
                ))}
    
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
                    <div className="flex flex-col space-y-2">
                        <span>{errors.general}</span>
                        {errors.general.includes('incorrect') && (
                            <div className="text-xs text-red-600 mt-2">
                                <p className="font-medium mb-1">Troubleshooting tips:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Check that your email address is spelled correctly</li>
                                    <li>Ensure your password is correct (check for capitalization)</li>
                                    <li>Make sure Caps Lock is turned off</li>
                                    <li>If you forgot your password, contact support</li>
                                </ul>
                            </div>
                        )}
                        {errors.general.includes('connect') && (
                            <div className="text-xs text-red-600 mt-2">
                                <p className="font-medium mb-1">Troubleshooting tips:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Check your internet connection</li>
                                    <li>Try refreshing the page and logging in again</li>
                                    <li>Ensure the backend server is running on localhost:8000</li>
                                </ul>
                            </div>
                        )}
                        {errors.general.includes('attempts') && (
                            <div className="text-xs text-red-600 mt-2">
                                <p className="font-medium mb-1">Security notice:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Too many failed login attempts detected</li>
                                    <li>Please wait 5 minutes before trying again</li>
                                    <li>This protects your account from brute force attacks</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    </div>
                )}
                </div>
    
                <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-semibold text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                    
                </button>
            </form>
    
            <div className="text-center mt-6">
                <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-medium text-blue-950 hover:text-blue-900">
                    Sign up
                </a>
                </p>
            </div>
            </div>
        </div>
        </main>
    );
    }