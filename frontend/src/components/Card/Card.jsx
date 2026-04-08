// src/components/Card/Card.jsx
import { useState } from 'react';
import CardDetailModal from './CardDetailModal';

const Card = ({ card, updateCardInBoard, columnTitle }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div 
                onClick={() => setIsModalOpen(true)}
                className="group bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all duration-200 relative"
            >
                <h4 className="text-sm font-medium text-slate-700 leading-snug">{card.title}</h4>
                
                {card.description && (
                    <div className="mt-2 flex items-center text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                    </div>
                )}
                
                {card.memberIds?.length > 0 && (
                    <div className="mt-3 flex -space-x-2 overflow-hidden">
                        {card.memberIds.map((memberId, idx) => (
                            <div key={idx} className="inline-block w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {memberId.charAt(0).toUpperCase()}
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
                    columnTitle={columnTitle}
                />
            )}
        </>
    );
};

export default Card;