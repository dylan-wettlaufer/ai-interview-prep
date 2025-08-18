"use client";
import DashboardHeader from '../dashboard/components/DashboardHeader';
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
        } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
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

        try {
        const response = await fetch('http://localhost:8000/auth/login', {
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
        }


        // Clear any existing errors
        setErrors({});

        setSuccessMessage('Login successful!');
        // Reset form after successful login
        setFormData({
            email: '',
            password: '',
        });

        setIsLoading(false);

        console.log('Login successful!');

        setTimeout(() => {
            router.push('/dashboard');
        }, 100);

        } catch (error) {
        setErrors({
            ...errors,
            general: error.message || 'An error occurred during login'
        });
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-white">
        <div className="container mx-auto px-4 py-16 max-w-md">
         
            <div className="bg-neutral-800 rounded-2xl shadow-lg p-8 border border-neutral-700">
            <h1 className="text-3xl font-bold text-center text-gray-100 mb-8">
                Login
            </h1>
    
            {successMessage && (
                <div className="bg-green-600/10 border border-green-500 text-green-300 p-4 mb-6 rounded-lg text-sm">
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
                    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
                        {label}
                    </label>
                    <input
                        type={type}
                        id={id}
                        name={id}
                        value={formData[id]}
                        onChange={handleChange}
                        className={`mt-1 mb-4 p-2 h-8 block w-full rounded-md bg-neutral-700 text-white border border-neutral-600 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                        errors[id] ? 'border-rose-500 ring-rose-500' : ''
                        }`}
                    />
                    {errors[id] && (
                        <p className="mt-1 text-xs text-rose-500">{errors[id]}</p>
                    )}
                    </div>
                ))}
    
                {errors.general && (
                    <div className="bg-rose-600/10 border border-rose-500 text-rose-300 p-4 rounded-lg text-sm">
                    {errors.general}
                    </div>
                )}
                </div>
    
                <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-semibold text-white bg-primary hover:bg-background/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                    
                </button>
            </form>
    
            <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <a href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300">
                    Sign up
                </a>
                </p>
            </div>
            </div>
        </div>
        </main>
    );
    }