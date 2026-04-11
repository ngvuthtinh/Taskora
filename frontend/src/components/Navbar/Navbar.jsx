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

const Navbar = ({ title, showBack = false, badge = null }) => {
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
        <header className="px-6 py-0 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 h-14 shadow-sm">
            {/* Left: logo + optional back button + title */}
            <div className="flex items-center gap-3">
                {showBack && (
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Back to dashboard"
                    >
                        <BackIcon />
                    </button>
                )}

                {!showBack && (
                    <Link to="/dashboard" className="text-slate-800 text-xl font-extrabold tracking-tight hover:opacity-80 transition-opacity">
                        Taskora
                    </Link>
                )}

                {title && (
                    <>
                        {showBack && <span className="text-slate-300 font-light text-lg">/</span>}
                        <span className="text-slate-800 text-base font-bold tracking-tight">{title}</span>
                        {badge && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-semibold rounded-md">{badge}</span>
                        )}
                    </>
                )}
            </div>

            {/* Right: avatar + dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    id="navbar-avatar-btn"
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="flex items-center gap-2.5 rounded-full pl-2.5 pr-1 py-1 hover:bg-slate-100 transition-colors group"
                    aria-label="Open user menu"
                    aria-expanded={dropdownOpen}
                >
                    <span className="text-sm font-semibold text-slate-600 hidden sm:block group-hover:text-slate-900 transition-colors">
                        {user?.name || 'Account'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-sm select-none">
                        {initials}
                    </div>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-slate-100">
                            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email || ''}</p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1.5">
                            <button
                                id="navbar-profile-btn"
                                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                                <span className="text-slate-400"><UserIcon /></span>
                                Profile
                            </button>
                            <button
                                id="navbar-settings-btn"
                                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                                <span className="text-slate-400"><SettingsIcon /></span>
                                Settings
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-slate-100 pt-1.5">
                            <button
                                id="navbar-logout-btn"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left font-medium"
                            >
                                <LogoutIcon />
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
