import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Icons
const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const BackIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
);

const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Read user from localStorage
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    })();

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="px-6 py-0 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 h-12 z-[100] shadow-sm">
            {/* Left: logo & navigation */}
            <div className="flex items-center gap-8">
                <Link to="/dashboard" className="flex items-center gap-2 text-slate-800 text-lg font-black tracking-tighter hover:opacity-80 transition-opacity">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19,3H5C3.89,3 3,3.9 3,5V19C3,20.1 3.89,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M10,17H8V7H10V17M12,13H10V11H12V13M16,15H14V7H16V15Z"></path></svg>
                    </div>
                    Taskora
                </Link>
                
                <nav className="hidden md:flex items-center gap-1">
                    <Link to="/dashboard" className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors">
                        Workspaces
                    </Link>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-bold ml-2 shadow-sm transition-all hover:shadow-md">
                        Create
                    </button>
                </nav>
            </div>

            {/* Right: avatar + dropdown */}
            <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2">
                    <div className="relative mr-2">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-md w-40 focus:w-60 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        id="navbar-avatar-btn"
                        onClick={() => setDropdownOpen(prev => !prev)}
                        className="flex items-center gap-1 rounded-full p-0.5 hover:ring-2 hover:ring-white/20 transition-all group"
                        aria-label="Open user menu"
                        aria-expanded={dropdownOpen}
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-700 text-white border border-white/20 flex items-center justify-center text-xs font-bold shadow-sm select-none overflow-hidden">
                            {initials}
                        </div>
                    </button>
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* User info header */}
                        <div className="px-5 py-4 border-b border-slate-100">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Account</p>
                           <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold">
                                    {initials}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                                </div>
                           </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-2">
                            <button
                                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                                Profile and Visibility
                            </button>
                            <button
                                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                                Activity
                            </button>
                             <button
                                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                                Cards
                            </button>
                             <button
                                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                                Settings
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-slate-100 mt-2 pt-2">
                            <button
                                id="navbar-logout-btn"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left font-medium"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
