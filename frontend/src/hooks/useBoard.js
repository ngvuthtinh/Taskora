import { useState, useEffect } from 'react';
import { fetchBoardDetailsAPI, moveCardAPI } from '../services/boardService';
import { createNewCardAPI } from '../services/cardService';
import { createNewColumnAPI, updateColumnAPI } from '../services/columnService';
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

    // Xử lý kéo thả Card
    const handleDragCard = async (result) => {
        const { source, destination, draggableId } = result;

        // Clone board ra để cập nhật UI ngay lập tức (Optimistic UI)
        const newBoard = { ...board };
        const prevColIndex = newBoard.columnOrderIds.findIndex(c => c._id === source.droppableId);
        const nextColIndex = newBoard.columnOrderIds.findIndex(c => c._id === destination.droppableId);

        const prevCol = newBoard.columnOrderIds[prevColIndex];
        const nextCol = newBoard.columnOrderIds[nextColIndex];

        // Trường hợp 1: Kéo trong cùng 1 Cột
        if (source.droppableId === destination.droppableId) {
            const newCards = Array.from(prevCol.cardOrderIds);
            const [movedCard] = newCards.splice(source.index, 1); // Rút thẻ ra
            newCards.splice(destination.index, 0, movedCard); // Cắm thẻ vào vị trí mới

            newBoard.columnOrderIds[prevColIndex].cardOrderIds = newCards;
            setBoard(newBoard);

            // Gọi API chạy ngầm phía sau
            try {
                await updateColumnAPI(source.droppableId, { cardOrderIds: newCards.map(c => c._id) });
            } catch (error) {
                console.error(error);
                toast.error('Lỗi khi lưu vị trí kéo thả');
            }
        } 
        // Trường hợp 2: Kéo sang Cột khác
        else {
            const prevCards = Array.from(prevCol.cardOrderIds);
            const nextCards = Array.from(nextCol.cardOrderIds || []);

            const [movedCard] = prevCards.splice(source.index, 1);
            nextCards.splice(destination.index, 0, movedCard);

            newBoard.columnOrderIds[prevColIndex].cardOrderIds = prevCards;
            newBoard.columnOrderIds[nextColIndex].cardOrderIds = nextCards;
            setBoard(newBoard);

            try {
                await moveCardAPI({
                    cardId: draggableId,
                    prevColumnId: source.droppableId,
                    prevCardOrderIds: prevCards.map(c => c._id),
                    nextColumnId: destination.droppableId,
                    nextCardOrderIds: nextCards.map(c => c._id),
                });
            } catch (error) {
                console.error(error);
                toast.error('Lỗi khi chuyển cột thẻ');
            }
        }
    };

    // Chỉ trả ra ngoài những gì cần thiết
    return { board, createNewCard, createNewColumn, handleDragCard };
};
