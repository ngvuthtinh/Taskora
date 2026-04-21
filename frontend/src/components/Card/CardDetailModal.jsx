import React, { useState, useRef, useEffect } from 'react';
import { updateCardDetailsAPI, assignMemberToCardAPI } from '../../services/cardService';
import { toast } from 'react-toastify';

const CardDetailModal = ({ card, onClose, updateCardInBoard, deleteCardInBoard, columnTitle, boardMembers = [], boardLabels = [] }) => {
    const [title, setTitle] = useState(card.title)
    const [description, setDescription] = useState(card.description || '')
    const [dueDate, setDueDate] = useState(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '')
    const [labels, setLabels] = useState(card.labels || [])
    const [menuOpen, setMenuOpen] = useState(false)
    const [assignMenuOpen, setAssignMenuOpen] = useState(false)
    const [labelMenuOpen, setLabelMenuOpen] = useState(false)
    
    const menuRef = useRef(null)
    const assignMenuRef = useRef(null)
    const labelRef = useRef(null)

    const COLORS = [
        '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', 
        '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#64748b'
    ];

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
            if (assignMenuRef.current && !assignMenuRef.current.contains(e.target)) setAssignMenuOpen(false)
            if (labelRef.current && !labelRef.current.contains(e.target)) setLabelMenuOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSave = async () => {
        try {
            const updateCard = await updateCardDetailsAPI(card._id, { title, description, dueDate, labels })
            updateCardInBoard({ ...updateCard, memberIds: card.memberIds })
            toast.success('Saved successfully!')
            onClose()
        } catch (error) {
            toast.error('Failed to save card')
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            await deleteCardInBoard(card._id, card.columnId)
            onClose()
        }
    }

    const handleToggleMember = async (userId) => {
        const isAssigned = card.memberIds?.some(m => m._id === userId);
        const action = isAssigned ? 'remove' : 'add';
        try {
            const result = await assignMemberToCardAPI(card._id, { userId, action })
            const updatedCard = result.card || result;
            updateCardInBoard(updatedCard)
            card.memberIds = updatedCard.memberIds;
        } catch (error) {
            toast.error('Failed to update member')
        }
    }

    const toggleLabel = (color, text = '') => {
        const isSelected = labels.find(l => l.color === color);
        if (isSelected) {
            setLabels(labels.filter(l => l.color !== color));
        } else {
            const existingLabel = boardLabels.find(bl => bl.color === color);
            setLabels([...labels, { color, text: text || existingLabel?.text || '' }]);
        }
    }

    const updateLabelText = (color, text) => {
        setLabels(labels.map(l => l.color === color ? { ...l, text } : l))
    }

    return (
        <div className="fixed inset-0 z-[160] overflow-y-auto bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
            {/* Centering Wrapper */}
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative my-8 flex flex-col animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 flex justify-between items-start shrink-0 sticky top-0 bg-white z-[60] rounded-t-2xl border-b border-transparent">
                    <div className="flex-1 pr-10">
                        <input
                            type="text"
                            className="text-2xl font-bold text-slate-800 w-full outline-none border-b-2 border-transparent focus:border-blue-600 transition-all pb-1 bg-transparent"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="mt-1.5 flex items-center gap-1.5">
                             <p className="text-sm text-slate-500">In list <span className="font-semibold text-slate-700 underline decoration-slate-200">{columnTitle}</span></p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl border border-slate-100 rounded-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                    <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        Delete Card
                                    </button>
                                </div>
                            )}
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500 font-bold">✕</button>
                    </div>
                </div>

                <div className="px-5 sm:px-8 pb-8 space-y-8 mt-4">
                    
                    {/* Labels */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                             <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                             Labels
                        </label>
                        <div className="flex flex-wrap gap-2 items-center">
                            {labels.map(label => (
                                <div key={label.color} className="flex items-center gap-2 h-8 px-2.5 rounded-lg border shadow-sm" style={{ backgroundColor: `${label.color}15`, borderColor: label.color }}>
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: label.color }}></div>
                                    <input className="text-xs font-semibold outline-none bg-transparent w-20" style={{ color: label.color }} value={label.text} onChange={(e) => updateLabelText(label.color, e.target.value)} placeholder="Label..." />
                                    <button onClick={() => toggleLabel(label.color)} className="text-slate-400 hover:text-red-500 transition-colors"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                </div>
                            ))}
                            <div className="relative" ref={labelRef}>
                                <button onClick={() => setLabelMenuOpen(!labelMenuOpen)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all">+</button>
                                {labelMenuOpen && (
                                    <div className="absolute top-0 left-0 p-3 bg-white shadow-2xl border border-slate-100 rounded-xl z-[100] w-52 animate-in fade-in zoom-in-95 duration-150">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Select label</p>
                                        <div className="grid grid-cols-1 gap-1">
                                            {COLORS.map(color => {
                                                const isSelected = labels.find(l => l.color === color);
                                                const boardLabel = boardLabels.find(bl => bl.color === color);
                                                return (
                                                    <button key={color} onClick={() => toggleLabel(color)} className={`w-full flex items-center gap-2.5 p-1.5 rounded-lg transition-all ${isSelected ? 'bg-slate-50 ring-1 ring-slate-200' : 'hover:bg-slate-50'}`}>
                                                        <div className="w-5 h-5 rounded shadow-sm" style={{ backgroundColor: color }}></div>
                                                        <span className="flex-1 text-[11px] font-semibold text-slate-600 text-left truncate">{boardLabel?.text || (isSelected ? labels.find(l => l.color === color).text : '') || 'Untitled'}</span>
                                                        {isSelected && <svg className="w-3.5 h-3.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                             <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                             Description
                        </label>
                        <textarea
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[120px] transition-all text-slate-700 text-sm placeholder:text-slate-400 shadow-inner"
                            placeholder="Add card details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Grid: Members & Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
                        
                        {/* Member Sidebar Section */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                Members
                            </label>
                            
                            {/* Scrollable member list */}
                            <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-1 mb-2">
                                {card.memberIds?.map((member) => (
                                    <div key={member._id} className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-50 rounded-xl group hover:bg-slate-100 transition-all">
                                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-[10px] shrink-0">
                                            {(member.name ? member.name.charAt(0) : (member.email ? member.email.charAt(0) : '?')).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-medium text-slate-700 truncate flex-1">{member.name || member.email}</span>
                                        <button onClick={() => handleToggleMember(member._id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                    </div>
                                ))}
                            </div>

                            {/* ASSIGN BUTTON AND MENU (OUTSIDE SCROLL AREA TO AVOID CLIPPING) */}
                            <div className="relative" ref={assignMenuRef}>
                                <button 
                                    onClick={() => setAssignMenuOpen(!assignMenuOpen)} 
                                    className="flex items-center gap-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 border-dashed text-slate-500 rounded-xl text-xs font-semibold hover:border-blue-400 hover:text-blue-600 transition-all"
                                >
                                    <span className="text-base font-normal pr-0.5">+</span> Assign member
                                </button>

                                {assignMenuOpen && (
                                    <div className="absolute top-0 left-0 w-full min-w-[220px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 rounded-xl py-2 z-[200] animate-in fade-in zoom-in-95 duration-150 origin-top-left">
                                        <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">Board members</p>
                                        <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                                            {boardMembers.map(member => {
                                                const isAssigned = card.memberIds?.some(m => m._id === member._id);
                                                return (
                                                    <button key={member._id} onClick={() => handleToggleMember(member._id)} className="w-full flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 transition-colors">
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[9px] ${isAssigned ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                                                            {(member.name ? member.name.charAt(0) : (member.email ? member.email.charAt(0) : '?')).toUpperCase()}
                                                        </div>
                                                        <span className={`text-xs font-medium flex-1 truncate ${isAssigned ? 'text-blue-600' : 'text-slate-600'}`}>{member.name || member.email}</span>
                                                        {isAssigned && <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Due Date Subsection */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm font-medium text-slate-700 shadow-inner w-full"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-5 sm:p-8 bg-slate-50 flex flex-wrap justify-end gap-3 mt-auto shrink-0 sticky bottom-0 z-[60] rounded-b-2xl border-t border-slate-100">
                    <button onClick={onClose} className="px-5 py-2.5 text-slate-500 hover:text-slate-800 rounded-lg text-sm font-semibold transition-all">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-2.5 bg-slate-800 hover:bg-black text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95">Save Changes</button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default CardDetailModal;