import Card from '../Card/Card';
import { useState, useRef, useEffect } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

const Column = ({ column, boardId, createNewCard, updateCardInBoard, deleteCardInBoard, deleteColumnInBoard, index }) => {
    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const [newCardTitle, setNewCardTitle] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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
        <Draggable draggableId={column._id.toString()} index={index}>
            {(provided) => (
                <div 
                    className="bg-slate-100/80 p-3 rounded-2xl w-72 shrink-0 flex flex-col max-h-full border border-slate-200/60 shadow-sm mr-6"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    {/* Column title */}
                    <div className="flex items-center justify-between px-2 mb-3 mt-1" {...provided.dragHandleProps}>
                        <h3 className="font-semibold text-slate-700 text-sm tracking-wide">
                            {column.title}
                        </h3>
                        
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-200 rounded transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-1 w-40 bg-white shadow-xl border border-slate-200 rounded-xl py-1 z-10 animate-in fade-in zoom-in duration-100 origin-top-right">
                                    <button 
                                        onClick={() => {
                                            setMenuOpen(false)
                                            deleteColumnInBoard(column._id)
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        Delete list
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card list area */}
                    <Droppable droppableId={column._id.toString()} type="card">
                        {(provided) => (
                            <div 
                                className="flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar min-h-[10px] px-1 pb-1"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {column.cardOrderIds?.map((card, cardIndex) => (
                                    <Card key={card._id} card={card} index={cardIndex} updateCardInBoard={updateCardInBoard} deleteCardInBoard={deleteCardInBoard} columnTitle={column.title} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

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
            )}
        </Draggable>
    )
}

export default Column