import React, { useEffect, useState } from 'react';
import { fetchBoardDetailsAPI } from '../services/boardService';
import Column from '../components/Column/Column'
const BoardPage = () => {
    const [board, setBoard] = useState(null);

    const mockBoardId = '69cc8bcc8f41f8e27ec3183e';

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const boardData = await fetchBoardDetailsAPI(mockBoardId);
                setBoard(boardData);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu board:', error);
            }
        };

        loadBoard();
    }, []);

    if (!board) {
        return <div className="h-screen flex items-center justify-center text-2xl font-bold">Đang tải dữ liệu...</div>;
    }


    return (
        <div className="min-h-screen bg-blue-600 p-4">
            <h1 className="text-white text-3xl font-bold mb-6">
                Taskora Board: {board.title}
            </h1>

            <div className="flex-1 p-4 overflow-x-auto overflow-y-hidden">
                <div className="flex gap-6 h-full items-start">

                    {/* Lặp qua mảng columns để in ra từng Cột */}
                    {board.columnOrderIds?.map(column => (
                        <Column key={column._id} column={column} />
                    ))}

                    {/* Nút thêm Cột mới */}
                    <button className="bg-white/20 hover:bg-white/30 text-white w-72 shrink-0 p-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        <span>+ Thêm cột mới</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default BoardPage;