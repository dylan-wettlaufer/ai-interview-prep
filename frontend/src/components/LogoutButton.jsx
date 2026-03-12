// A simple Logout button component
"use client";
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    try {
      // Send the request with credentials to ensure the browser sends the cookie
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("user");

        // Add a small delay to give the browser time to delete the cookie
        setTimeout(() => {
          router.push('/login');
        }, 100); 
      } else {
        console.error('Logout failed');
        // Handle error, maybe show a message to the user
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-slate-50 w-full text-left transition-colors duration-200"
      >
        <LogOut size={16} />
        Logout
      </button>
  );
}