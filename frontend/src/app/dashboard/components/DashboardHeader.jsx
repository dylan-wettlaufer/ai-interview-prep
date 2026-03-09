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
    Award,
    Home
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
                <button className="hidden md:flex p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors duration-200">
                    <Home size={20} />
                </button>
                
                <div className="relative" ref={dropdownRef}>
                    <button 
                        className="flex items-center gap-2 text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors duration-200"
                        onClick={toggleProfileDropdown}
                    >
                        <div className="bg-blue-950 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium text-xs tracking-medium">
                            DW
                        </div>
                        <span className="hidden md:block font-medium">Dylan</span>
                        <ChevronDown 
                            size={16} 
                            className={`hidden md:block transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                            <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                                <User size={16} />
                                Profile
                            </a>
                            <div className="border-t border-slate-100 my-1"></div>
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