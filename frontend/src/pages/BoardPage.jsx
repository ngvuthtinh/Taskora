import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from '../components/Column/Column';
import { useBoard } from '../hooks/useBoard';
import Navbar from '../components/Navbar/Navbar';

const BoardPage = () => {
    const { id: boardId } = useParams();
    const { 
        board, createNewCard, createNewColumn, updateCardInBoard, 
        moveColumn, moveCardSameCol, moveCardDiffCol 
    } = useBoard(boardId);

    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

    if (!board) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                    <div className="text-slate-500 font-medium tracking-wide">Loading board...</div>
                </div>
            </div>
        );
    }

    const handleCreateNewColumn = async () => {
        if (!newColumnTitle.trim()) return;

        try {
            await createNewColumn(newColumnTitle);
            setNewColumnTitle('');
            toggleOpenNewColumnForm();
        } catch (error) {
            // Error is already shown by Toast inside the Hook
        }
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'column') {
            const newColumnOrder = Array.from(board.columnOrderIds);
            const [removed] = newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, removed);
            await moveColumn(newColumnOrder);
            return;
        }

        if (type === 'card') {
            const sourceColIndex = board.columnOrderIds.findIndex(c => c._id === source.droppableId);
            const destColIndex = board.columnOrderIds.findIndex(c => c._id === destination.droppableId);
            
            const sourceCol = board.columnOrderIds[sourceColIndex];
            const destCol = board.columnOrderIds[destColIndex];

            if (source.droppableId === destination.droppableId) {
                // Drag and drop within the same column
                const newCards = Array.from(sourceCol.cardOrderIds);
                const [removed] = newCards.splice(source.index, 1);
                newCards.splice(destination.index, 0, removed);
                
                await moveCardSameCol(sourceCol._id, newCards);
            } else {
                // Drag and drop between columns
                const sourceCards = Array.from(sourceCol.cardOrderIds);
                const [removed] = sourceCards.splice(source.index, 1);
                
                const destCards = Array.from(destCol.cardOrderIds);
                destCards.splice(destination.index, 0, removed);
                
                await moveCardDiffCol(
                    sourceCol._id, 
                    sourceCards, 
                    destCol._id, 
                    destCards,
                    draggableId
                );
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar
                showBack
                title={board.title}
                badge={board.type === 'private' ? 'Private' : 'Public'}
            />

            {/* Board Content */}
            <main className="flex-1 p-6 overflow-x-auto overflow-y-hidden custom-scrollbar">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="board" type="column" direction="horizontal">
                        {(provided) => (
                            <div 
                                className="flex h-full items-start"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {board.columnOrderIds?.map((column, index) => (
                                    <Column
                                        key={column._id}
                                        column={column}
                                        boardId={board._id}
                                        createNewCard={createNewCard}
                                        index={index}
                                        updateCardInBoard={updateCardInBoard}
                                    />
                                ))}
                                {provided.placeholder}

                                {/* Add new column button */}
                                {!openNewColumnForm ? (
                                    <button
                                        onClick={toggleOpenNewColumnForm}
                                        className="bg-white/50 hover:bg-slate-200/50 text-slate-600 border border-slate-300 border-dashed w-72 shrink-0 p-3 rounded-2xl font-medium flex items-center gap-2 transition-all duration-200"
                                    >
                                        <span className="text-lg leading-none">+</span>
                                        <span>Add another list</span>
                                    </button>
                                ) : (
                                    <div className="bg-white p-3 rounded-2xl w-72 shrink-0 flex flex-col border border-slate-200 shadow-sm">
                                        <input
                                            autoFocus
                                            type="text"
                                            className="p-2 border border-slate-300 focus:border-slate-800 rounded-lg text-sm outline-none transition-colors"
                                            placeholder="Enter list title..."
                                            value={newColumnTitle}
                                            onChange={(e) => setNewColumnTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleCreateNewColumn();
                                                }
                                            }}
                                        />
                                        <div className="flex items-center gap-2 mt-3">
                                            <button
                                                onClick={handleCreateNewColumn}
                                                className="bg-slate-800 hover:bg-slate-900 text-white text-sm py-1.5 px-4 rounded-lg font-medium transition-colors"
                                            >
                                                Add list
                                            </button>
                                            <button
                                                onClick={toggleOpenNewColumnForm}
                                                className="text-slate-400 hover:text-slate-600 font-bold px-2 text-lg"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </main>
        </div>
    );
};

export default BoardPage;