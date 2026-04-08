import React, { useState } from 'react';
import { updateCardDetailsAPI, assignMemberToCardAPI } from '../../services/cardService';
import { toast } from 'react-toastify';

const CardDetailModal = ({ card, onClose, updateCardInBoard, columnTitle }) => {
    const [title, setTitle] = useState(card.title)
    const [description, setDescription] = useState(card.description || '')
    const [dueDate, setDueDate] = useState(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '')
    const [labels, setLabels] = useState(card.labels || [])
    const [emailInput, setEmailInput] = useState('')

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

    const handleAddMember = async () => {
        if (!emailInput) return;
        try {
            const updatedCard = await assignMemberToCardAPI(card._id, { email: emailInput, action: 'add' })
            updateCardInBoard(updatedCard)
            toast.success('Added member successfully!')
            setEmailInput('')
            card.memberIds = updatedCard.memberIds;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add member')
        }
    }

    const addLabel = (color) => {
        if (!labels.find(l => l.color === color)) setLabels([...labels, { color, text: '' }])
    }
    const removeLabel = (color) => {
        setLabels(labels.filter(l => l.color !== color))
    }
    const updateLabelText = (color, text) => {
        setLabels(labels.map(l => l.color === color ? { ...l, text } : l))
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8 flex flex-col shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                    ✕
                </button>

                <div className="mt-2 pr-8">
                    <input
                        type="text"
                        className="text-2xl font-bold text-slate-800 w-full outline-none border-b-2 border-transparent focus:border-slate-300 transition-colors pb-1 bg-transparent"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Card title..."
                    />
                </div>

                <div className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                    <span>in list</span>
                    <span className="font-semibold underline decoration-slate-300 underline-offset-4">{columnTitle || 'Current list'}</span>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                        Description
                    </label>
                    <textarea
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-800 focus:border-transparent resize-y min-h-[140px] transition-all text-slate-700 placeholder:text-slate-400"
                        placeholder="Add a more detailed description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-3 mt-8">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Due Date
                    </label>
                    <input
                        type="date"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-800 transition-all text-sm text-slate-700"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-3 mt-8">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        Labels
                    </label>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'].map(color => (
                                <button 
                                    key={color} 
                                    onClick={() => labels.find(l => l.color === color) ? removeLabel(color) : addLabel(color)}
                                    className="w-8 h-8 rounded border-2"
                                    style={{ backgroundColor: color, borderColor: labels.find(l => l.color === color) ? '#1e293b' : 'transparent' }}
                                />
                            ))}
                        </div>
                        {labels.length > 0 && (
                            <div className="flex flex-col gap-2 mt-1">
                                {labels.map(label => (
                                    <div key={label.color} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded flex-shrink-0" style={{ backgroundColor: label.color }}></div>
                                        <input 
                                            type="text"
                                            className="flex-1 text-sm p-1.5 border-b border-slate-200 outline-none focus:border-slate-800 transition-colors bg-transparent text-slate-700"
                                            placeholder="What is this label for?"
                                            value={label.text || ''}
                                            onChange={(e) => updateLabelText(label.color, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        Members
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-800 transition-all text-sm text-slate-700"
                            placeholder="Add member by email..."
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                        <button onClick={handleAddMember} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors">Add</button>
                    </div>
                    {card.memberIds?.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                            {card.memberIds.map((member, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                        {(member.name ? member.name.charAt(0) : (member.email ? member.email.charAt(0) : '?')).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-700">{member.name || 'Unknown'}</span>
                                        <span className="text-xs text-slate-500">{member.email || 'No email provided'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-10">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium shadow-sm transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardDetailModal