import React, { useState } from 'react';
import Column from '../components/Column/Column';
import { useBoard } from '../hooks/useBoard';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

const BoardPage = () => {
    const mockBoardId = '69cc8bcc8f41f8e27ec3183e';
    
    // 1. Lấy Data & Logic từ nhà kho Custom Hook
    const { board, createNewCard, createNewColumn, handleDragCard } = useBoard(mockBoardId);

    // 2. Chỉ giữ lại những biến quản lý UI (đóng/mở form, ô gõ chữ)
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

    if (!board) {
        return <div className="h-screen flex items-center justify-center text-2xl font-bold">Đang tải dữ liệu...</div>;
    }

    const handleCreateNewColumn = async () => {
        if (!newColumnTitle.trim()) return;
        
        try {
            await createNewColumn(newColumnTitle);
            setNewColumnTitle('');
            toggleOpenNewColumnForm();
        } catch (error) {
            // Lỗi đã được Toast cảnh báo bên trong Hook, ở đây chỉ cần vắng lặng
        }
    };

    const onDragEnd = (result) => {
        const { source, destination, draggableId, type } = result;

        // Nếu kéo thả ra ngoài không khí (không trúng đích)
        if (!destination) return;

        // Nếu thả lại đúng chỗ cũ (Cùng Cột và cùng Index)
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        
        console.log(`Tiến hành gọi API: Kéo Card ${draggableId} từ cột ${source.droppableId} (vị trí ${source.index}) sang cột ${destination.droppableId} (vị trí ${destination.index})`);
        
        // Sắp tới ta sẽ gọi hàm re-order thẻ qua useBoard ở đây!
        handleDragCard(result);
    };

return (
    <div className="min-h-screen bg-blue-600 p-4">
        <h1 className="text-white text-3xl font-bold mb-6">
            Taskora Board: {board.title}
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board-columns" type="column" direction="horizontal">
                {(provided) => (
                    <div 
                        className="flex-1 p-4 overflow-x-auto overflow-y-hidden"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <div className="flex gap-6 h-full items-start">

                        {board.columnOrderIds?.map((column, index) => (
                            <Column
                                key={column._id}
                                column={column}
                                boardId={board._id}
                                createNewCard={createNewCard}
                                index={index}
                            />
                        ))}

                        {/* Nút thêm Cột mới */}
                        {!openNewColumnForm ? (
                            <button 
                                onClick={toggleOpenNewColumnForm}
                                className="bg-white/20 hover:bg-white/30 text-white w-72 shrink-0 p-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
                            >
                                <span>+ Thêm cột mới</span>
                            </button>
                        ) : (
                            <div className="bg-gray-100 p-3 rounded-xl w-72 shrink-0 flex flex-col">
                                <input
                                    autoFocus
                                    type="text"
                                    className="p-2 border border-blue-500 rounded text-sm outline-none"
                                    placeholder="Nhập tiêu đề cột..."
                                    value={newColumnTitle}
                                    onChange={(e) => setNewColumnTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCreateNewColumn();
                                        }
                                    }}
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={handleCreateNewColumn}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded"
                                    >
                                        Thêm Cột
                                    </button>
                                    <button
                                        onClick={toggleOpenNewColumnForm}
                                        className="text-gray-500 hover:text-gray-800 font-bold px-2 text-lg"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}

                        {provided.placeholder}
                        </div>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </div>
);
};

export default BoardPage;