import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { toast } from 'react-toastify';
import { updateProfileAPI, updatePasswordAPI, updateAvatarAPI } from '../services/userService';

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
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef(null);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Giới hạn kích thước 800KB như UI đã thông báo
        if (file.size > 800 * 1024) {
            return toast.error('File is too large! Max size 800KB');
        }

        try {
            setIsUpdating(true);
            const formData = new FormData();
            formData.append('avatar', file); // 'avatar' phải trùng với backend (upload.single('avatar'))

            const data = await updateAvatarAPI(formData);
            
            // Cập nhật lại thông tin user trong local
            const updatedUser = { ...user, avatar: data.user.avatar };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            // Thông báo cho Navbar biết để đổi ảnh ngay lập tức
            window.dispatchEvent(new Event("userUpdated")); 
            
            toast.success('Avatar updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload avatar');
        } finally {
            setIsUpdating(false);
            e.target.value = null; // Reset input để có thể chọn lại cùng 1 file
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            const data = await updateProfileAPI(name);
            
            const updatedUser = { ...user, name: data.user.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            // Bắn tín hiệu để Navbar tự đổi tên/avatar ngay lập tức
            window.dispatchEvent(new Event("userUpdated")); 

            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            return toast.warning('Please fill in both fields!');
        }
        if (newPassword.length < 6) {
            return toast.warning('New password must be at least 6 characters!');
        }

        try {
            setIsUpdating(true);
            await updatePasswordAPI(currentPassword, newPassword);
            toast.success('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsUpdating(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Public Profile', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        )},
        { id: 'account', label: 'Account Settings', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        )},
        { id: 'notifications', label: 'Notifications', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        )},
    ];

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
            <Navbar />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
                    
                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
                        <h2 className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Settings</h2>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-800' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                        
                        {activeTab === 'profile' && (
                            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Public Profile</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Manage how others see you in Taskora.</p>

                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    {/* Avatar Upload */}
                                    <div className="flex items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                                        <div className="w-20 h-20 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white dark:border-slate-900 overflow-hidden">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            ) : (
                                                initials
                                            )}
                                        </div>
                                        <div>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleAvatarChange} 
                                                className="hidden" 
                                                accept="image/*"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => fileInputRef.current.click()}
                                                disabled={isUpdating}
                                                className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all mb-1 disabled:opacity-50"
                                            >
                                                {isUpdating ? 'Uploading...' : 'Change Avatar'}
                                            </button>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Display Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                            <input 
                                                type="email" 
                                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none cursor-not-allowed opacity-70 font-medium"
                                                value={email}
                                                disabled
                                            />
                                            <p className="text-[11px] text-slate-400 ml-1">Email cannot be changed for security.</p>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button type="submit" disabled={isUpdating} className={`px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 dark:shadow-none transition-all ${isUpdating ? 'bg-slate-500 cursor-not-allowed text-white/50' : 'bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 text-white active:scale-95'}`}>
                                            {isUpdating ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Account & Security</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Manage your password and security settings.</p>

                                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Current Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showCurrentPassword ? "text" : "password"} 
                                                placeholder="••••••••" 
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12 placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                            >
                                                {showCurrentPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showNewPassword ? "text" : "password"} 
                                                placeholder="Minimum 6 characters" 
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12 placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                            >
                                                {showNewPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" disabled={isUpdating} className={`px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 dark:shadow-none transition-all ${isUpdating ? 'bg-slate-500 cursor-not-allowed text-white/50' : 'bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 text-white active:scale-95'}`}>
                                            {isUpdating ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-20 pt-10 border-t border-red-50 dark:border-red-900/20">
                                    <h4 className="text-red-500 font-bold mb-2">Danger Zone</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                                    <button className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-500/30 text-red-500 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                        Delete My Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="p-20 text-center flex flex-col items-center justify-center animate-in fade-in duration-300">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 transition-colors">
                                    <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Under Construction</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">We are currently building this feature. Check back in the next update!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
