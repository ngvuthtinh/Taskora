import React, { useState } from 'react';
import axiosClient from '../../services/axiosClient';
import { toast } from 'react-toastify';

const ShareModal = ({ isOpen, onClose, board }) => {
    const [activeTab, setActiveTab] = useState('members');
    const [emailInput, setEmailInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const owners = board?.ownerIds || [];
    const members = board?.memberIds || [];

    // Combine to render all people
    const allPeople = [
        ...owners.map(o => ({ ...o, role: 'admin' })),
        ...members.map(m => ({ ...m, role: 'member' }))
    ];

    const handleInvite = async () => {
        if (!emailInput.trim()) {
            toast.warning('Please enter an email address!');
            return;
        }

        try {
            setIsSubmitting(true);
            await axiosClient.post(`/boards/${board._id}/members`, { email: emailInput.trim() });
            toast.success('Member added successfully!');
            setEmailInput('');
            // Yêu cầu tải lại trang tạm thời để cập nhật danh sách (hoặc báo React Refresh)
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add member');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white w-full max-w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Share board</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex flex-col gap-5">
                    {/* Share Input Area */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Email address"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm placeholder:text-slate-400 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors text-slate-600">
                                Member
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <button
                                onClick={handleInvite}
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
                            >
                                {isSubmitting ? 'Sharing...' : 'Share'}
                            </button>
                        </div>
                    </div>

                    {/* Link Sharing Area */}
                    <div className="flex items-center gap-4 mt-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">Anyone with the link can join as a member</p>
                            <div className="flex gap-3 text-sm mt-0.5">
                                <button className="text-blue-600 hover:underline font-medium">Copy link</button>
                                <span className="text-slate-300">•</span>
                                <button className="text-slate-500 hover:text-slate-700 hover:underline">Delete link</button>
                            </div>
                        </div>
                        <button className="flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-slate-600 shadow-sm">
                            Change permissions
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-slate-200 mt-2">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'members' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Board members <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs ml-1 font-extrabold">{allPeople.length}</span>
                            {activeTab === 'members' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'requests' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Join requests
                            {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
                        </button>
                    </div>

                    {/* Member List */}
                    {activeTab === 'members' && (
                        <div className="flex flex-col mt-2 h-[220px] overflow-y-auto custom-scrollbar pr-2">
                            {allPeople.map(person => (
                                <div key={person._id} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors group">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs ${person.role === 'admin' ? 'bg-orange-500' : 'bg-slate-800'}`}>
                                        {(person.name ? person.name.charAt(0) : (person.email ? person.email.charAt(0) : '?')).toUpperCase()}
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            {person.name || person.email}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">
                                            {person.email} • {person.role === 'admin' ? 'Workspace Admin' : 'Workspace Guest'}
                                        </span>
                                    </div>
                                    <button className="flex items-center gap-1.5 bg-transparent hover:bg-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors text-slate-600">
                                        {person.role === 'admin' ? 'Admin' : 'Member'}
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="flex flex-col items-center justify-center h-[220px] text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                            </div>
                            <p className="text-slate-700 font-bold text-sm">No join requests yet</p>
                            <p className="text-slate-500 text-xs mt-1 max-w-[250px]">When someone asks to join your board via the link, it will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
