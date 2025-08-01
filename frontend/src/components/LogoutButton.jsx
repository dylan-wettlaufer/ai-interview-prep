// A simple Logout button component
"use client";
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Send the request with credentials to ensure the browser sends the cookie
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log("Logout successful on backend, redirecting...");
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
        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 w-full text-left"
      >
        <LogOut size={16} />
        Logout
      </button>
  );
}