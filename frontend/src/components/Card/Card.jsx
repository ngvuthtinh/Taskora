import { useState, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import CardDetailModal from './CardDetailModal';
import { updateCardDetailsAPI } from '../../services/cardService';

const Card = ({ card, updateCardInBoard, deleteCardInBoard, columnTitle, index, boardMembers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Tự động mở Modal nếu có cardId trên URL
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const cardIdFromUrl = queryParams.get('cardId');
        if (cardIdFromUrl === card._id) {
            setIsModalOpen(true);
            
            // Xóa cardId khỏi URL sau khi đã mở để tránh việc F5 lại tự mở tiếp (tùy chọn)
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [card._id]);

    const handleToggleComplete = async (e) => {
        e.stopPropagation();
        try {
            const updatedCard = await updateCardDetailsAPI(card._id, { isCompleted: !card.isCompleted });
            updateCardInBoard({ ...updatedCard, memberIds: card.memberIds });
        } catch (error) {
            console.error('Failed to toggle completion');
        }
    };

    return (
        <Draggable draggableId={card._id.toString()} index={index}>
            {(provided) => (
                <>
                    <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setIsModalOpen(true)}
                        className={`group p-3 pr-10 rounded-xl shadow-sm border cursor-pointer transition-colors transition-shadow duration-200 relative mb-2 ${card.isCompleted ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'}`}
                    >
                <button 
                    onClick={handleToggleComplete}
                    className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${card.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent opacity-0 group-hover:opacity-100 hover:border-green-500 hover:text-green-500'}`}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </button>
                {card.labels?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {card.labels.map((label, idx) => (
                            <span key={idx} style={{ backgroundColor: label.color }} className="px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                                {label.text || '\u00A0'}
                            </span>
                        ))}
                    </div>
                )}
                
                <h4 className={`text-sm font-medium leading-snug ${card.isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-white'}`}>{card.title}</h4>
                
                {card.description && (
                    <div className="mt-2 flex items-center text-slate-400 dark:text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                    </div>
                )}
                
                {card.dueDate && (
                    <div className={`mt-2 flex items-center gap-1 text-[11px] font-medium ${new Date(card.dueDate) < new Date() ? 'text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded w-max' : 'text-slate-500 dark:text-slate-400'}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {new Date(card.dueDate).toLocaleDateString('vi-VN')}
                    </div>
                )}

                {card.memberIds?.length > 0 && (
                    <div className="mt-3 flex -space-x-2 items-center">
                        {card.memberIds.map((member, idx) => (
                            <div 
                                key={idx} 
                                title={member.name || member.email} 
                                className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300 overflow-hidden shrink-0 shadow-sm"
                            >
                                {member.avatar ? (
                                    <img src={member.avatar} alt="member" className="w-full h-full object-cover" />
                                ) : (
                                    (member.name ? member.name.charAt(0) : (member.email ? member.email.charAt(0) : '?')).toUpperCase()
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CardDetailModal 
                    card={card} 
                    onClose={() => setIsModalOpen(false)} 
                    updateCardInBoard={updateCardInBoard}
                    deleteCardInBoard={deleteCardInBoard}
                    columnTitle={columnTitle}
                    boardMembers={boardMembers}
                />
            )}
                </>
            )}
        </Draggable>
    );
};

export default Card;