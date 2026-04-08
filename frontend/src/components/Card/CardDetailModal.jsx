import React, { useState } from 'react';
import { updateCardDetailsAPI } from '../../services/cardService';
import { toast } from 'react-toastify';

const CardDetailModal = ({ card, onClose, updateCardInBoard, columnTitle }) => {
    const [title, setTitle] = useState(card.title)
    const [description, setDescription] = useState(card.description || '')
    const [membersText, setMembersText] = useState((card.memberIds || []).join(', '))

    const handleSave = async () => {
        try {
            const memberIds = membersText.split(',').map(m => m.trim()).filter(m => m)
            const updateCard = await updateCardDetailsAPI(card._id, { title, description, memberIds })
            updateCardInBoard(updateCard)
            toast.success('Saved successfully!')
            onClose()
        } catch (error) {
            toast.error('Failed to save card')
        }
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
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        Members
                    </label>
                    <input
                        type="text"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-800 transition-all text-sm text-slate-700"
                        placeholder="Comma separated member IDs (e.g. alice, bob)"
                        value={membersText}
                        onChange={(e) => setMembersText(e.target.value)}
                    />
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