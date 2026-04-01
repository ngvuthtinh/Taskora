const Board = require('../models/boardModel')
const Column = require('../models/columnModel')
const Card = require('../models/cardModel')

const createNewBoard = async (req, res) => {
    try {
        const { title, description, type } = req.body;

        const ownerId = req.user._id

        const newBoard = await Board.create({
            title,
            description,
            type,
            ownerIds: [ownerId]
        })

        res.status(201).json(newBoard)

    } catch (error) {
        res.status(500).json({ message: 'Server error when creating a board.', error: error.message })
    }
}

const getBoardDetails = async (req, res) => {
    try {
        const boardId = req.params.id

        const board = await Board.findById(boardId).populate({
            path: 'columnOrderIds',
            populate: {
                path: 'cardOrderIds'
            }
        })

        if (!board) {
            return res.status(404).json({ message: 'Không tìm thấy Board này!' });
        }

        res.status(200).json({ board });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết Board', error: error.message });
    }
}

const moveCardToDifferentColumn = async (req, res) => {
    try {
        const { cardId, prevColumnId, prevCardOrderIds, nextColumnId, nextCardOrderIds } = req.body

        const updatePrevColumn = Column.findByIdAndUpdate(prevColumnId, { cardOrderIds: prevCardOrderIds }, { returnDocument: 'after' })

        const updateNextColumn = Column.findByIdAndUpdate(nextColumnId, { cardOrderIds: nextCardOrderIds }, { returnDocument: 'after' })

        const updateCard = Card.findByIdAndUpdate(cardId, { columnId: nextColumnId }, { returnDocument: 'after' })

        await Promise.all([
            updatePrevColumn,
            updateNextColumn,
            updateCard
        ]);
        res.status(200).json({ message: 'Chuyển cột thành công!'});
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi chuyển cột', error: error.message });
    }
}

module.exports = { createNewBoard, getBoardDetails, moveCardToDifferentColumn }