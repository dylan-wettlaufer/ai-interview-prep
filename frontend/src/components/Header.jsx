"use client";
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LogoutButton from "@/components/LogoutButton";
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import {
    Bell,
    ChevronDown,
    LayoutDashboard,
    Mic,
    History,
    Settings,
    LogOut,
    Menu,
    ChevronRight,
    User,
    Zap,
    Award,
    Home
  } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);

    // Don't show header on login or signup pages
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isLandingPage = pathname === '/';
    
    // Load user from localStorage
    useEffect(() => {
        console.log("useEffect running, pathname:", pathname);
        const storedUser = localStorage.getItem("user");
        console.log("Raw localStorage user data:", storedUser);
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log("User loaded from localStorage:", parsedUser);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        } else {
            console.log("No user data found in localStorage, fetching from backend...");
            // Fallback: fetch user data from backend
            fetchUserData();
        }
    }, [pathname]);

    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:8000/auth/user', {
                method: 'GET',
                credentials: 'include', // Important for cookies
            });
            
            if (response.ok) {
                const userData = await response.json();
                console.log("User data fetched from backend:", userData);
                
                // Extract user_metadata if it exists
                const userObj = {
                    id: userData.id,
                    email: userData.email,
                    first_name: userData.user_metadata?.first_name || "",
                    last_name: userData.user_metadata?.last_name || "",
                    user_metadata: userData.user_metadata || {}
                };
                
                setUser(userObj);
                localStorage.setItem("user", JSON.stringify(userObj));
                console.log("User data stored in localStorage:", userObj);
            } else {
                console.log("No valid session found, user not authenticated");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Handle clicking outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const getInitials = () => {
        console.log("getInitials called, user:", user);
        if (!user) return "??";
        // Try top level first, then user_metadata
        const firstName = user.first_name || user.user_metadata?.first_name || "";
        const lastName = user.last_name || user.user_metadata?.last_name || "";
        
        console.log("firstName:", firstName, "lastName:", lastName);
        
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName.charAt(0).toUpperCase();
        
        const initials = firstInitial + lastInitial;
        
        console.log("initials:", initials, "trimmed:", initials.trim());
        
        if (initials.trim()) return initials;
        
        // Fallback to email if name is missing
        if (user.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        
        return "??";
    };

    const getFirstName = () => {
        if (!user) return "User";
        const firstName = user.first_name || user.user_metadata?.first_name;
        if (firstName) return firstName;
        
        // Fallback to email prefix
        if (user.email) {
            return user.email.split('@')[0];
        }
        
        return "User";
    };

    if (isAuthPage) {
        return null;
    }

    // Landing page header
    if (isLandingPage) {
        return (
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Zap size={28} className="text-blue-950" />
                    <h1 className="text-2xl font-bold text-blue-950">AceAI</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-slate-600 hover:text-blue-950 font-medium transition-colors duration-200">
                        Log In
                    </Link>
                    <Link href="/signup" className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                        Sign Up
                    </Link>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
                <Zap size={28} className="text-blue-950" />
                <h1 className="text-2xl font-bold text-blue-950">AceAI</h1>
            </div>

            {/* Desktop Navigation 
            <nav className="hidden md:flex items-center gap-6 text-slate-600 font-medium">
                <a href="/dashboard" className="hover:text-blue-950 transition-colors duration-200">Dashboard</a>
                <a href="#" className="hover:text-blue-950 transition-colors duration-200">History</a>
                <a href="#" className="hover:text-blue-950 transition-colors duration-200">Settings</a>
            </nav>
*/}
            {/* User Actions & Profile */}
            <div className="flex items-center gap-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/dashboard" className="hidden md:flex p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors duration-200">
                            <Home size={20} />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Dashboard</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/history" className="hidden md:flex p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors duration-200">
                            <History size={20} />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Interview History</p>
                    </TooltipContent>
                </Tooltip>
                
                <div className="relative" ref={dropdownRef}>
                    <button 
                        className="flex items-center gap-2 text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors duration-200"
                        onClick={toggleProfileDropdown}
                    >
                        <div className="bg-blue-950 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium text-xs tracking-medium">
                            {getInitials()}
                        </div>
                        <span className="hidden md:block font-medium">{getFirstName()}</span>
                        <ChevronDown 
                            size={16} 
                            className={`hidden md:block transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <LogoutButton />
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
}