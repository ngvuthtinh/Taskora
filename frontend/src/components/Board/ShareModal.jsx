import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

const ShareModal = ({ isOpen, onClose, board, inviteMember, removeMember, updateMemberRole }) => {
    const [emailInput, setEmailInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('members');
    const [openMenuId, setOpenMenuId] = useState(null);
    
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const owners = board?.ownerIds || [];
    const members = board?.memberIds || [];
    const isCurrentUserAdmin = owners.some(o => o._id === currentUser?._id);

    const allPeople = [
        ...owners.map(o => ({ ...o, role: 'admin' })),
        ...members.map(m => ({ ...m, role: 'member' }))
    ];

    const handleInvite = async () => {
        if (!emailInput.trim()) return;
        try {
            setIsSubmitting(true);
            await inviteMember(emailInput.trim());
            setEmailInput('');
        } catch (error) {
            // Error handling is inside the hook
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveMemberAction = async (userId, userEmail, userName) => {
        const isSelf = userId === currentUser?._id;
        const msg = isSelf ? 'Are you sure you want to leave this board?' : `Remove ${userName}?`;
        if (!window.confirm(msg)) return;
        try {
            await removeMember(userEmail);
        } catch (error) {
            // Error handling is inside the hook
        }
    };

    const handleChangeRoleAction = async (userId, newRole) => {
        try {
            const action = newRole === 'admin' ? 'promote' : 'demote';
            await updateMemberRole(userId, action);
            setOpenMenuId(null);
        } catch (error) {
            // Error handling is inside the hook
        }
    };

    return (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm transition-colors duration-300" onClick={onClose}>
            {/* Centering Wrapper */}
            <div className="min-h-full flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-slate-900 w-full max-w-[580px] rounded-2xl shadow-2xl flex flex-col relative my-8 animate-in fade-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800 transition-colors"
                    onClick={e => e.stopPropagation()}
                >
                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-8 pt-6 sm:pt-8 pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Share board</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="px-5 sm:px-8 pb-6 sm:pb-10 flex flex-col gap-6">
                    {/* Hàng 1: Input + Share Button */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Email address or name"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 rounded-xl px-4 py-2.5 outline-none text-slate-700 dark:text-white text-sm transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                        </div>
                        <button
                            onClick={handleInvite}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-blue-100 dark:shadow-none w-full sm:w-auto"
                        >
                            Share
                        </button>
                    </div>

                    {/* Shared Link Area */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">Anyone with the link can join as a member</p>
                            <div className="flex gap-3 text-xs mt-1">
                                <button className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Copy link</button>
                                <span className="text-slate-200 dark:text-slate-700">•</span>
                                <button className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">Delete link</button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800 -mx-1 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveTab('members')} className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'members' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            Board members <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full text-[10px] ml-1">{allPeople.length}</span>
                            {activeTab === 'members' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>}
                        </button>
                        <button onClick={() => setActiveTab('requests')} className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'requests' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            Join requests
                            {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>}
                        </button>
                    </div>

                    {/* Member List - No internal scroll to allow overflow popups */}
                    <div className="flex flex-col gap-1 pb-4">
                        {allPeople.map(person => {
                            const isSelf = person._id === currentUser?._id;
                            const canCurrentAdminManage = isCurrentUserAdmin && !isSelf;
                            const canAdminLeave = isSelf && person.role === 'admin' && owners.length > 1;
                            const canMemberLeave = isSelf && person.role === 'member';

                            return (
                                <div key={person._id} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl group transition-all relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 ${person.role === 'admin' ? 'bg-orange-500' : 'bg-slate-800 dark:bg-slate-700'}`}>
                                        {(person.name ? person.name.charAt(0) : person.email.charAt(0)).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate flex items-center gap-2">
                                            {person.name || person.email}
                                            {isSelf && <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-black">You</span>}
                                        </p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate tracking-tight">{person.email}</p>
                                    </div>
                                    
                                    <div className="relative">
                                        <button 
                                            onClick={() => (canCurrentAdminManage || canAdminLeave || canMemberLeave) && setOpenMenuId(openMenuId === person._id ? null : person._id)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${(canCurrentAdminManage || canAdminLeave || canMemberLeave) ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300' : 'bg-transparent text-slate-400 cursor-default uppercase tracking-wider'}`}
                                        >
                                            {person.role === 'admin' ? 'Admin' : 'Member'}
                                            {(canCurrentAdminManage || canAdminLeave || canMemberLeave) && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>}
                                        </button>
                                        
                                        {/* Spill-out Menu */}
                                        {openMenuId === person._id && (
                                            <div ref={menuRef} className="absolute right-0 top-full mt-2 w-[280px] bg-white dark:bg-slate-950 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-black border border-slate-100 dark:border-slate-800 rounded-2xl py-3 z-[300] animate-in fade-in slide-in-from-top-2">
                                                {canCurrentAdminManage && (
                                                    <>
                                                        <div onClick={() => handleChangeRoleAction(person._id, 'admin')} className={`px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer ${person.role === 'admin' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500' : ' border-l-4 border-transparent'}`}>
                                                            <p className={`text-sm font-bold ${person.role === 'admin' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>Admin</p>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">Full control. Can add members, change settings, and delete the board.</p>
                                                        </div>
                                                        <div onClick={() => handleChangeRoleAction(person._id, 'member')} className={`px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer ${person.role === 'member' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500' : ' border-l-4 border-transparent'}`}>
                                                            <p className={`text-sm font-bold ${person.role === 'member' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>Member</p>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">Can join boards and edit cards, but cannot change board settings.</p>
                                                        </div>
                                                        <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-2"></div>
                                                    </>
                                                )}
                                                
                                                <button 
                                                    onClick={() => handleRemoveMemberAction(person._id, person.email, person.name || person.email)}
                                                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                >
                                                    {isSelf ? 'Leave board...' : 'Remove from board'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
