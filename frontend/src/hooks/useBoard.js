import { useState, useEffect } from 'react';
import { fetchBoardDetailsAPI, updateBoardAPI, moveCardAPI, deleteBoardAPI } from '../services/boardService';
import { createNewCardAPI, deleteCardAPI } from '../services/cardService';
import { createNewColumnAPI, updateColumnAPI, deleteColumnAPI } from '../services/columnService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useBoard = (boardId) => {
    const [board, setBoard] = useState(null);
    const navigate = useNavigate();

    /**
     * 1. LOAD BOARD
     * Chạy ngay khi mở Web lên. 
     * Nó gọi API fetchBoardDetailsAPI lấy toàn bộ cấu trúc Bảng (Cột, Thẻ)
     * và nhét vào kho lưu trữ (state 'board').
     */
    useEffect(() => {
        const loadBoard = async () => {
            try {
                const boardData = await fetchBoardDetailsAPI(boardId);
                setBoard(boardData);
            } catch (error) {
                console.error('Error fetching board data:', error);
            }
        };

        if (boardId) {
            loadBoard();
        }
    }, [boardId]);

    /**
     * 2. TẠO THẺ MỚI (CREATE NEW CARD)
     * B1: Gọi API createNewCardAPI đẩy dữ liệu lên server.
     * B2: Sau khi server đồng ý, chọc thẳng vào State Local để nhét thẻ mới
     * vào đuôi danh sách thẻ của cái Cột chứa nó, nhờ đó giao diện cập nhật ngay.
     */
    const createNewCard = async (newCardData) => {
        try {
            const createdCard = await createNewCardAPI(newCardData);

            setBoard(prevBoard => ({
                ...prevBoard, // Giữ nguyên các thông tin cũ của Bảng (như title, description...)
                
                // Tìm kiếm trong mảng columnOrderIds để chèn thẻ mới vào đúng cột
                columnOrderIds: prevBoard.columnOrderIds.map(col => {
                    // Nếu id của cột ĐÚNG BẰNG id của cột chứa tấm thẻ mới tạo
                    if (col._id === createdCard.columnId) {
                        return {
                            ...col, // Copy toàn bộ thông tin cũ của Cột này (title, id...)
                            // Tạo mảng thẻ mới = [...Lấy tất cả thẻ cũ của cột] + Nhét [thẻ mới] vào đuôi
                            // (Hoặc nếu cột rỗng chưa có thẻ nào thì cho mảng rỗng [])
                            cardOrderIds: [...(col.cardOrderIds || []), createdCard]
                        };
                    }
                    // Nếu là cột không liên quan thì giữ nguyên trạng thái
                    return col;
                })
            }));
            toast.success('Card created successfully!');
        } catch (error) {
            toast.error('Error creating new card!');
            console.error(error);
        }
    };

    /**
     * 3. TẠO CỘT MỚI (CREATE NEW COLUMN)
     * Tương tự tạo thẻ, gọi API trước. Rồi âm thầm cập nhật State bằng cách
     * chèn cột mới (createdColumn) vào đằng sau cùng danh sách cột.
     */
    const createNewColumn = async (newColumnTitle) => {
        try {
            // Bước 1: Gửi request lên server để tạo cột mới. Nó sẽ trả về 1 Cột chuẩn chỉnh có id
            const createdColumn = await createNewColumnAPI({
                title: newColumnTitle,
                boardId: board._id
            });

            // Bước 2: Cập nhật giao diện lập tức (State Update)
            setBoard(prevBoard => ({
                ...prevBoard, // Clone Bảng hiện tại 
                // Tạo danh sách cột mới = [...Copy toàn bộ cột cũ đang có] + Thêm [Cột mới] vào đuôi mảng
                columnOrderIds: [...prevBoard.columnOrderIds, createdColumn]
            }));
            
            toast.success('Column created successfully!');
        } catch (error) {
            toast.error('Error creating new column!');
            console.error(error);
            throw error; 
        }
    };

    /**
     * 4. CẬP NHẬT GIAO DIỆN LOCAL (KHÔNG GỌI API)
     * Nhiệm vụ duy nhất là tráo đổi dữ liệu Thẻ cũ thành Thẻ mới nằm sâu trong State
     * Dùng cho Kéo Thả (Drag & Drop) hoặc cập nhật mượt mà khi đổi tên không cần load lại web.
     */
    const updateCardInBoard = (updatedCard) => {
        setBoard(prevBoard => {
            // Bước 1: Copy toàn bộ nội dung cái Bảng hiện hành ra một bản nháp (shallow copy)
            const newBoard = { ...prevBoard}
            
            // Bước 2: Lặp qua từng Cột để tìm đúng cái Cột đang chứa Thẻ cần được Cập nhật
            newBoard.columnOrderIds = newBoard.columnOrderIds.map(col => {
                
                // Trúng phóc: Cột này chính là cột đang chứa thẻ của ta!
                if (col._id === updatedCard.columnId) {
                    
                    return {
                        ...col, // Clone Cột này ra để chuẩn bị sửa danh sách thẻ bên trong
                        
                        // Lặp qua từng thẻ con của cái Cột này
                        cardOrderIds: col.cardOrderIds.map(c =>
                            // So sánh: Thẻ con nào có ID trùng với ID của thẻ mang thông tin cập nhật?
                            // Nếu trùng (?) -> Lấy cục dữ liệu Thẻ mới đè vào (updatedCard)
                            // Nếu không (:) -> Giữ nguyên trạng Thẻ cũ (c) cho vào mảng mới
                            c._id === updatedCard._id ? updatedCard : c
                        )
                    }
                }
                // Còn đây là Cột khác, không chứa thẻ cần sửa, cứ trả về nguyên gốc vứt vô lại mảng.
                return col
            })
            
            // Bước 3: Trả về Bảng bản nháp đã được cập nhật sâu bên trong cho React lên hình!
            return newBoard
        })
    }


    const moveColumn = async (newColumnOrder) => {
        setBoard(prev => ({
            ...prev,
            columnOrderIds: newColumnOrder
        }));
        try {
            await updateBoardAPI(board._id, { columnOrderIds: newColumnOrder.map(c => c._id) });
        } catch (error) {
            toast.error('Failed to update column position!');
        }
    };

    const moveCardSameCol = async (columnId, newCards) => {
        setBoard(prev => {
            const newBoard = { ...prev };
            newBoard.columnOrderIds = [...newBoard.columnOrderIds]; // Copy array để React render lại mượt không bị khựng
            
            const colIndex = newBoard.columnOrderIds.findIndex(c => c._id === columnId);
            if (colIndex !== -1) {
                newBoard.columnOrderIds[colIndex] = {
                    ...newBoard.columnOrderIds[colIndex],
                    cardOrderIds: newCards
                };
            }
            return newBoard;
        });
        try {
            await updateColumnAPI(columnId, { cardOrderIds: newCards.map(c => c._id) });
        } catch (error) {
            toast.error('Failed to update card position!');
        }
    };

    const moveCardDiffCol = async (sourceColId, sourceCards, destColId, destCards, activeCardId) => {
        setBoard(prev => {
            const newBoard = { ...prev };
            newBoard.columnOrderIds = [...newBoard.columnOrderIds]; // Copy array
            
            const sIdx = newBoard.columnOrderIds.findIndex(c => c._id === sourceColId);
            const dIdx = newBoard.columnOrderIds.findIndex(c => c._id === destColId);
            if (sIdx !== -1 && dIdx !== -1) {
                newBoard.columnOrderIds[sIdx] = { ...newBoard.columnOrderIds[sIdx], cardOrderIds: sourceCards };
                newBoard.columnOrderIds[dIdx] = { ...newBoard.columnOrderIds[dIdx], cardOrderIds: destCards };
            }
            return newBoard;
        });
        try {
            await moveCardAPI({
                prevColumnId: sourceColId,
                nextColumnId: destColId,
                prevCardOrderIds: sourceCards.map(c => c._id),
                nextCardOrderIds: destCards.map(c => c._id),
                cardId: activeCardId
            });
        } catch (error) {
            toast.error('Failed to move card to another column!');
        }
    };

    /**
     * 5. XÓA THẺ (DELETE CARD)
     */
    const deleteCardInBoard = async (cardId, columnId) => {
        try {
            await deleteCardAPI(cardId);
            setBoard(prev => ({
                ...prev,
                columnOrderIds: prev.columnOrderIds.map(col => {
                    if (col._id === columnId) {
                        return {
                            ...col,
                            cardOrderIds: col.cardOrderIds.filter(card => card._id !== cardId)
                        };
                    }
                    return col;
                })
            }));
            toast.success('Card deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete card');
        }
    };

    /**
     * 6. XÓA CỘT (DELETE COLUMN)
     */
    const deleteColumnInBoard = async (columnId) => {
        if (!window.confirm('Are you sure you want to delete this list and all its cards?')) return;
        try {
            await deleteColumnAPI(columnId);
            setBoard(prev => ({
                ...prev,
                columnOrderIds: prev.columnOrderIds.filter(col => col._id !== columnId)
            }));
            toast.success('Column deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete column');
        }
    };

    /**
     * 7. XÓA BẢNG (DELETE BOARD)
     */
    const deleteBoardInProject = async () => {
        if (!window.confirm('WARNING: Are you sure you want to delete this board? This action cannot be undone!')) return;
        try {
            await deleteBoardAPI(boardId);
            toast.success('Board deleted successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to delete board');
        }
    };

    /**
     * 8. CẬP NHẬT THÔNG TIN BẢNG (UPDATE BOARD DETAILS)
     */
    const updateBoardDetails = async (updateData) => {
        try {
            const updatedBoard = await updateBoardAPI(boardId, updateData);
            setBoard(prev => ({
                ...prev,
                ...updatedBoard
            }));
            return updatedBoard;
        } catch (error) {
            toast.error('Failed to update board details');
            throw error;
        }
    };

    // Only expose what is needed
    return { 
        board, 
        createNewCard, 
        createNewColumn, 
        updateCardInBoard,
        moveColumn,
        moveCardSameCol,
        moveCardDiffCol,
        deleteCardInBoard,
        deleteColumnInBoard,
        deleteBoardInProject,
        updateBoardDetails
    };
};
