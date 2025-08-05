"use client";
import { useState, useRef, useEffect } from 'react';
import LogoutButton from "../../../components/LogoutButton";
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
    Award
  } from 'lucide-react';

export default function DashboardHeader() {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    return (
        <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Zap size={28} className="text-indigo-400" />
                <h1 className="text-2xl font-bold text-gray-50">Interview AI</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-gray-400">
                <a href="/dashboard" className="hover:text-indigo-400 transition-colors duration-200">Dashboard</a>
                <a href="#" className="hover:text-indigo-400 transition-colors duration-200">History</a>
                <a href="#" className="hover:text-indigo-400 transition-colors duration-200">Settings</a>
            </nav>

            {/* User Actions & Profile */}
            <div className="flex items-center gap-4">
                <button className="hidden md:flex p-2 text-gray-400 hover:bg-neutral-800 rounded-full transition-colors duration-200">
                    <Bell size={20} />
                </button>
                
                <div className="relative" ref={dropdownRef}>
                    <button 
                        className="flex items-center gap-2 text-gray-300 hover:bg-neutral-800 p-2 rounded-full transition-colors duration-200"
                        onClick={toggleProfileDropdown}
                    >
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium text-xs tracking-medium">
                            DW
                        </div>
                        <span className="hidden md:block">Dylan</span>
                        <ChevronDown 
                            size={16} 
                            className={`hidden md:block transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-xl overflow-hidden">
                            <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700 transition-colors duration-200">
                                <User size={16} />
                                Profile
                            </a>
                            <div className="border-t border-neutral-700 my-1"></div>
                            <LogoutButton />
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
}