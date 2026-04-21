import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { toast } from 'react-toastify';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    
    // Read user from localStorage
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    });

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        toast.info('Feature coming soon! Backend integration needed.');
    };

    const tabs = [
        { id: 'profile', label: 'Public Profile', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        )},
        { id: 'account', label: 'Account Settings', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        )},
        { id: 'theme', label: 'Theme & Appearance', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        )},
        { id: 'notifications', label: 'Notifications', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        )},
    ];

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans">
            <Navbar />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
                    
                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
                        <h2 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Settings</h2>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        
                        {activeTab === 'profile' && (
                            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">Public Profile</h3>
                                <p className="text-sm text-slate-500 mb-10">Manage how others see you in Taskora.</p>

                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    {/* Avatar Upload */}
                                    <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                                        <div className="w-20 h-20 rounded-full bg-slate-800 text-white flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white">
                                            {initials}
                                        </div>
                                        <div>
                                            <button type="button" className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:border-slate-300 hover:bg-slate-50 transition-all mb-1">
                                                Change Avatar
                                            </button>
                                            <p className="text-[11px] text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Display Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                            <input 
                                                type="email" 
                                                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none cursor-not-allowed opacity-70 font-medium"
                                                value={email}
                                                disabled
                                            />
                                            <p className="text-[11px] text-slate-400 ml-1">Email cannot be changed for security.</p>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button type="submit" className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">Account & Security</h3>
                                <p className="text-sm text-slate-500 mb-10">Manage your password and security settings.</p>

                                <form className="space-y-6 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                        <input type="password" placeholder="Minimum 6 characters" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                    </div>
                                    <div className="pt-4">
                                        <button type="button" className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all">
                                            Update Password
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-20 pt-10 border-t border-red-50">
                                    <h4 className="text-red-500 font-bold mb-2">Danger Zone</h4>
                                    <p className="text-sm text-slate-500 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                                    <button className="bg-white border-2 border-red-200 text-red-500 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 transition-all">
                                        Delete My Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {(activeTab === 'theme' || activeTab === 'notifications') && (
                            <div className="p-20 text-center flex flex-col items-center justify-center animate-in fade-in duration-300">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Under Construction</h3>
                                <p className="text-sm text-slate-500 max-w-xs">We are currently building this feature. Check back in the next update!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
