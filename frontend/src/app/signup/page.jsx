"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

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
    
    // Calculate password strength when password changes
    if (e.target.name === 'password') {
      calculatePasswordStrength(e.target.value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    let message = '';
    let requirements = [];

    if (password.length >= 8) score += 1;
    else requirements.push('8+ characters');
    
    if (/[a-z]/.test(password)) score += 1;
    else requirements.push('lowercase letter');
    
    if (/[A-Z]/.test(password)) score += 1;
    else requirements.push('uppercase letter');
    
    if (/[0-9]/.test(password)) score += 1;
    else requirements.push('number');
    
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else requirements.push('special character');

    if (password.length === 0) {
      message = '';
    } else if (score < 3) {
      message = `Weak password. Add: ${requirements.join(', ')}`;
    } else if (score < 4) {
      message = 'Fair password';
    } else if (score < 5) {
      message = 'Good password';
    } else {
      message = 'Strong password';
    }

    setPasswordStrength({ score, message });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak. Please include uppercase, lowercase, numbers, and special characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setSuccessMessage('Signup successful! Redirecting...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error) {
      setErrors({
        ...errors,
        general: error.message || 'An error occurred during signup'
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
            Create Account
          </h1>
  
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 mb-6 rounded-lg text-sm">
              {successMessage}
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {[
                { label: 'First Name', id: 'firstName' },
                { label: 'Last Name', id: 'lastName' },
                { label: 'Email address', id: 'email', type: 'email' },
                { label: 'Password', id: 'password', type: 'password' },
                { label: 'Confirm Password', id: 'confirmPassword', type: 'password' },
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
                  {id === 'password' && passwordStrength.message && (
                    <div className={`mt-2 text-xs ${
                      passwordStrength.score < 3 ? 'text-red-500' : 
                      passwordStrength.score < 4 ? 'text-yellow-600' : 
                      passwordStrength.score < 5 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.message}
                    </div>
                  )}
                </div>
              ))}
  
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
            </div>
  
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-semibold text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
  
          <div className="text-center mt-6">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-blue-950 hover:text-blue-900">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}