import { useState, useEffect } from 'react';
import { fetchBoardDetailsAPI, updateBoardAPI } from '../services/boardService';
import { createNewCardAPI } from '../services/cardService';
import { createNewColumnAPI } from '../services/columnService';
import { toast } from 'react-toastify';

export const useBoard = (boardId) => {
    const [board, setBoard] = useState(null);

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


    // Only expose what is needed
    return { board, createNewCard, createNewColumn, updateCardInBoard };
};
