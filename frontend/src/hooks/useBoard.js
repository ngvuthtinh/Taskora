import { useState, useEffect } from 'react';
import { fetchBoardDetailsAPI, updateBoardAPI } from '../services/boardService';
import { createNewCardAPI } from '../services/cardService';
import { createNewColumnAPI } from '../services/columnService';
import { toast } from 'react-toastify';

export const useBoard = (boardId) => {
    const [board, setBoard] = useState(null);

    // Lấy dữ liệu Board ban đầu
    useEffect(() => {
        const loadBoard = async () => {
            try {
                const boardData = await fetchBoardDetailsAPI(boardId);
                setBoard(boardData);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu board:', error);
            }
        };

        if (boardId) {
            loadBoard();
        }
    }, [boardId]);

    // Thêm Card Mới
    const createNewCard = async (newCardData) => {
        try {
            const createdCard = await createNewCardAPI(newCardData);

            setBoard(prevBoard => ({
                ...prevBoard,
                columnOrderIds: prevBoard.columnOrderIds.map(col => {
                    if (col._id === createdCard.columnId) {
                        return {
                            ...col,
                            cardOrderIds: [...(col.cardOrderIds || []), createdCard]
                        };
                    }
                    return col;
                })
            }));
            toast.success('Tạo thẻ thành công!');
        } catch (error) {
            toast.error('Lỗi khi tạo thẻ mới!');
            console.error(error);
        }
    };

    // Thêm Cột Mới
    const createNewColumn = async (newColumnTitle) => {
        try {
            const createdColumn = await createNewColumnAPI({
                title: newColumnTitle,
                boardId: board._id
            });

            setBoard(prevBoard => ({
                ...prevBoard,
                columnOrderIds: [...prevBoard.columnOrderIds, createdColumn]
            }));
            
            toast.success('Tạo cột thành công!');
        } catch (error) {
            toast.error('Lỗi khi tạo cột mới!');
            console.error(error);
            throw error; // Ném lỗi ra ngoài để UI biết mà khỏi đóng form nếu lỗi
        }
    };

    // Chỉ trả ra ngoài những gì cần thiết
    return { board, createNewCard, createNewColumn };
};
