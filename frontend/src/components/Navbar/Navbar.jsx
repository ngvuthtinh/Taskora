import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createNewBoardAPI } from '../../services/boardService';
import { getMyNotificationsAPI, markNotificationAsReadAPI } from '../../services/notificationService';
import { toast } from 'react-toastify';

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

const ThemeIcon = ({ isDark }) => (
    isDark ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
    )
);

const BellIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    });

    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleCreateBoard = async () => {
        try {
            const newBoard = await createNewBoardAPI({ title: 'Untitled Board', type: 'private' });
            toast.success('Board created successfully!');
            navigate(`/board/${newBoard._id}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create board');
        }
    };

    // Apply exact theme on mount
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }, [isDarkMode]);

    // Sync with local storage changes without reloading
    useEffect(() => {
        const syncUser = () => {
            try {
                setUser(JSON.parse(localStorage.getItem('user')) || null);
            } catch (e) {}
        };
        
        window.addEventListener('userUpdated', syncUser); // custom event
        return () => window.removeEventListener('userUpdated', syncUser);
    }, []);

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getMyNotificationsAPI();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Polling mỗi 30 giây để giả lập real-time (tạm thời khi chưa có Socket.io)
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsReadAPI(id);
            setNotifications(prev => 
                id === 'all' 
                ? prev.map(n => ({ ...n, isRead: true }))
                : prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error(error);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        return date.toLocaleDateString();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="px-6 py-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 h-12 z-[100] shadow-sm transition-colors duration-300">
            {/* Left: logo & navigation */}
            <div className="flex items-center gap-8">
                <Link to="/dashboard" className="flex items-center gap-2 text-slate-800 dark:text-white text-lg font-black tracking-tighter hover:opacity-80 transition-opacity">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19,3H5C3.89,3 3,3.9 3,5V19C3,20.1 3.89,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M10,17H8V7H10V17M12,13H10V11H12V13M16,15H14V7H16V15Z"></path></svg>
                    </div>
                    Taskora
                </Link>
                
                <nav className="hidden md:flex items-center gap-1">
                    <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors">
                        Workspaces
                    </Link>
                    <button 
                        onClick={handleCreateBoard}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-bold ml-2 shadow-sm transition-all hover:shadow-md"
                    >
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
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs px-3 py-1.5 rounded-md w-40 focus:w-60 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>
                    
                    <button
                        onClick={toggleTheme}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        aria-label="Toggle theme"
                    >
                        <ThemeIcon isDark={isDarkMode} />
                    </button>

                    {/* Notifications Bell */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors relative ${notifOpen ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                        >
                            <BellIcon />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
                            )}
                        </button>

                        {notifOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Notifications</h4>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={() => handleMarkAsRead('all')}
                                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md uppercase tracking-wider transition-colors"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div 
                                                key={notif._id}
                                                onClick={() => {
                                                    handleMarkAsRead(notif._id);
                                                    if (notif.type === 'BOARD_INVITATION') {
                                                        navigate(`/board/${notif.relatedId}`);
                                                    } else if (notif.type === 'TASK_ASSIGNMENT') {
                                                        navigate(`/board/${notif.relatedId}?cardId=${notif.cardId}`);
                                                    }
                                                    setNotifOpen(false);
                                                }}
                                                className={`px-4 py-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors relative ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                            >
                                                {!notif.isRead && (
                                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-blue-600 rounded-full"></div>
                                                )}
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                                        {notif.sender?.avatar ? (
                                                            <img src={notif.sender.avatar} alt="sender" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                                {(notif.sender?.name || notif.sender?.username || 'U')[0].toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-0.5">{notif.title}</p>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{notif.message}</p>
                                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-2 block font-medium uppercase tracking-tighter">
                                                            {formatTime(notif.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <BellIcon />
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">No notifications yet</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 text-center">
                                    <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                                        View all
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        id="navbar-avatar-btn"
                        onClick={() => setDropdownOpen(prev => !prev)}
                        className="flex items-center gap-1 rounded-full p-0.5 hover:ring-2 hover:ring-white/20 transition-all group"
                        aria-label="Open user menu"
                        aria-expanded={dropdownOpen}
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-700 text-white border border-white/20 flex items-center justify-center text-xs font-bold shadow-sm select-none overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                initials
                            )}
                        </div>
                    </button>
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* User info header */}
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Account</p>
                           <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-sm font-bold overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</p>
                                </div>
                           </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-2">
                             <button
                                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left font-medium"
                            >
                                <SettingsIcon />
                                Settings
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                            <button
                                id="navbar-logout-btn"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors text-left font-medium"
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
