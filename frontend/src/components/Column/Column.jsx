import Card from '../Card/Card';
import { useState } from 'react';

const Column = ({ column, boardId, createNewCard, updateCardInBoard }) => {
    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const [newCardTitle, setNewCardTitle] = useState('')

    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

    const addNewCard = async () => {
        if (!newCardTitle.trim()) {
            return
        }

        const newCardData = {
            title: newCardTitle,
            columnId: column._id,
            boardId: boardId
        }

        await createNewCard(newCardData)

        toggleOpenNewCardForm();
        setNewCardTitle('');
    }

    return (
        <div className="bg-slate-100/80 p-3 rounded-2xl w-72 shrink-0 flex flex-col max-h-full border border-slate-200/60 shadow-sm">
            {/* Column title */}
            <div className="flex items-center justify-between px-2 mb-3 mt-1">
                <h3 className="font-semibold text-slate-700 text-sm tracking-wide">
                    {column.title}
                </h3>
            </div>

            {/* Card list area */}
            <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-[10px] px-1 pb-1">
                {column.cardOrderIds?.map((card, index) => (
                    <Card key={card._id} card={card} index={index} updateCardInBoard={updateCardInBoard} columnTitle={column.title} />
                ))}
            </div>

            {!openNewCardForm ? (
                <button
                    onClick={toggleOpenNewCardForm}
                    className="mt-2 flex items-center gap-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 p-2 rounded-xl transition-colors w-full text-left text-sm font-medium"
                >
                    <span className="text-lg leading-none">+</span>
                    <span>Add a card</span>
                </button>
            ) : (
                <div className="mt-2 p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                    <textarea
                        autoFocus
                        className="w-full text-sm p-1 outline-none resize-none text-slate-700 placeholder:text-slate-400"
                        rows="2"
                        placeholder="Enter a title for this card..."
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                addNewCard();
                            }
                        }}
                    />
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={addNewCard}
                            className="bg-slate-800 hover:bg-slate-900 text-white text-sm py-1.5 px-3 rounded-lg font-medium transition-colors"
                        >
                            Add card
                        </button>
                        <button
                            onClick={toggleOpenNewCardForm}
                            className="text-slate-400 hover:text-slate-600 font-bold px-2"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Column