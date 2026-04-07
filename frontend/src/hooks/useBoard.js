import { useState, useEffect } from 'react';
import { fetchBoardDetailsAPI, updateBoardAPI } from '../services/boardService';
import { createNewCardAPI } from '../services/cardService';
import { createNewColumnAPI } from '../services/columnService';
import { toast } from 'react-toastify';

export const useBoard = (boardId) => {
    const [board, setBoard] = useState(null);

    // Fetch initial board data
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

    // Add New Card
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
            toast.success('Card created successfully!');
        } catch (error) {
            toast.error('Error creating new card!');
            console.error(error);
        }
    };

    // Add New Column
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
            
            toast.success('Column created successfully!');
        } catch (error) {
            toast.error('Error creating new column!');
            console.error(error);
            throw error; 
        }
    };



    // Only expose what is needed
    return { board, createNewCard, createNewColumn };
};
