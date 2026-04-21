import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from '../components/Column/Column';
import { useBoard } from '../hooks/useBoard';
import Navbar from '../components/Navbar/Navbar';
import ShareModal from '../components/Board/ShareModal';

const BoardPage = () => {
    const { id: boardId } = useParams();
    const { 
        board, createNewCard, createNewColumn, updateCardInBoard, 
        moveColumn, moveCardSameCol, moveCardDiffCol,
        deleteCardInBoard, deleteColumnInBoard, deleteBoardInProject,
        updateBoardDetails, inviteMember, removeMember, updateMemberRole
    } = useBoard(boardId);

    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [boardTitle, setBoardTitle] = useState('');
    const [boardDescription, setBoardDescription] = useState('');
    const [isSavingDesc, setIsSavingDesc] = useState(false);
    const boardMenuRef = useRef(null);

    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

    // Sync boardTitle with board object when it loads
    useEffect(() => {
        if (board?.title) setBoardTitle(board.title);
        if (board?.description !== undefined) setBoardDescription(board.description);
    }, [board?.title, board?.description]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (boardMenuRef.current && !boardMenuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBoardTitleUpdate = async () => {
        if (!boardTitle.trim() || boardTitle === board.title) {
            setBoardTitle(board.title);
            return;
        }
        try {
            await updateBoardDetails({ title: boardTitle.trim() });
            toast.success('Board title updated!');
        } catch (error) {
            setBoardTitle(board.title);
        }
    };

    const handleBoardDescriptionUpdate = async () => {
        if (boardDescription.trim() === (board.description || '')) return;
        setIsSavingDesc(true);
        try {
            await updateBoardDetails({ description: boardDescription.trim() });
            toast.success('Description updated!');
        } catch (error) {
            setBoardDescription(board.description || '');
        } finally {
            setIsSavingDesc(false);
        }
    };
    if (!board) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-slate-300 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-400 rounded-full animate-spin"></div>
                    <div className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Loading board...</div>
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
        <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans overflow-hidden transition-colors duration-300">
            {/* Tầng 1: App Bar (Sử dụng Navbar component đã tinh gọn) */}
            <Navbar />

            {/* Tầng 2: Board Bar (Thông tin riêng của bảng) */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <input 
                        className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight bg-transparent border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-lg px-2 py-1 outline-none transition-all cursor-text min-w-[50px]"
                        style={{ width: `${(boardTitle?.length || 5) + 2}ch` }}
                        value={boardTitle}
                        onChange={(e) => setBoardTitle(e.target.value)}
                        onBlur={handleBoardTitleUpdate}
                        onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                        spellCheck={false}
                    />
                    
                    <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1"></div>
                    
                    <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* Real Member Avatars with Tooltip - Removed overflow-hidden */}
                    <div className="flex -space-x-2 items-center mr-2">
                        {[...(board.ownerIds || []), ...(board.memberIds || [])].map((member, idx) => (
                            <div 
                                key={member._id || idx} 
                                className="group relative"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0 cursor-pointer group-hover:scale-110 group-hover:z-10 transition-all">
                                    {(member.name ? member.name.charAt(0) : member.email.charAt(0)).toUpperCase()}
                                </div>
                                {/* Custom Tooltip - Positioned BELOW avatar */}
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                                    {member.name || member.email}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => setIsShareModalOpen(true)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm hover:bg-blue-700 transition-all flex items-center gap-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        Share
                    </button>

                    <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1"></div>

                    {/* Board Action Menu */}
                    <div className="relative" ref={boardMenuRef}>
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center justify-center w-8 h-8 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-2xl py-2 z-[200] animate-in fade-in zoom-in-95 duration-150 origin-top-right flex flex-col">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</p>
                                        <button 
                                            onClick={handleBoardDescriptionUpdate}
                                            disabled={isSavingDesc}
                                            className="text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800/40 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
                                        >
                                            {isSavingDesc ? (
                                                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            ) : 'Save'}
                                        </button>
                                    </div>
                                    <textarea
                                        value={boardDescription}
                                        onChange={(e) => setBoardDescription(e.target.value)}
                                        placeholder="Add a board description..."
                                        className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-lg outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 resize-none h-24 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 transition-all font-medium custom-scrollbar"
                                    />
                                </div>
                                <button 
                                    onClick={() => {
                                        setMenuOpen(false);
                                        deleteBoardInProject();
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 transition-colors font-bold mt-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Delete Board
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Board Content Area */}
            <main className="flex-1 p-4 overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
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
                                        key={column._id || `col-${index}`}
                                        column={column}
                                        boardId={board._id}
                                        createNewCard={createNewCard}
                                        index={index}
                                        updateCardInBoard={updateCardInBoard}
                                        deleteCardInBoard={deleteCardInBoard}
                                        deleteColumnInBoard={deleteColumnInBoard}
                                        boardMembers={[...(board.ownerIds || []), ...(board.memberIds || [])]}
                                    />
                                ))}
                                {provided.placeholder}

                                {/* Thêm cột mới */}
                                {!openNewColumnForm ? (
                                    <button
                                        onClick={toggleOpenNewColumnForm}
                                        className="bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 border-dashed w-72 shrink-0 p-3 rounded-2xl font-semibold flex items-center gap-2 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                        Add another list
                                    </button>
                                ) : (
                                    <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl w-72 shrink-0 flex flex-col border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                        <input
                                            autoFocus
                                            type="text"
                                            className="p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
                                                className="bg-slate-800 dark:bg-blue-600 hover:bg-slate-900 dark:hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-xl font-bold transition-colors"
                                            >
                                                Add list
                                            </button>
                                            <button
                                                onClick={toggleOpenNewColumnForm}
                                                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </main>

            <ShareModal 
                isOpen={isShareModalOpen} 
                onClose={() => setIsShareModalOpen(false)} 
                board={board} 
                inviteMember={inviteMember}
                removeMember={removeMember}
                updateMemberRole={updateMemberRole}
            />
        </div>
    );
};

export default BoardPage;
