const Board = require('../models/boardModel')
const Column = require('../models/columnModel')
const Card = require('../models/cardModel')

const createNewBoard = async (req, res, next) => {
    try {
        const { title, description, type } = req.body

        if (!title) {
            res.status(400)
            throw new Error('Board title is required!')
        }

        const ownerId = req.user._id

        const newBoard = await Board.create({
            title,
            description,
            type,
            ownerIds: [ownerId]
        })

        res.status(201).json(newBoard)

    } catch (error) {
        next(error)
    }
}

const getBoardDetails = async (req, res, next) => {
    try {
        const boardId = req.params.id

        const board = await Board.findById(boardId).populate({
            path: 'columnOrderIds',
            populate: {
                path: 'cardOrderIds'
            }
        })

        if (!board) {
            res.status(404)
            throw new Error('Board not found!')
        }

        res.status(200).json({ board })
    } catch (error) {
        next(error)
    }
}

const moveCardToDifferentColumn = async (req, res, next) => {
    try {
        const { cardId, prevColumnId, prevCardOrderIds, nextColumnId, nextCardOrderIds } = req.body

        const updatePrevColumn = Column.findByIdAndUpdate(prevColumnId, { cardOrderIds: prevCardOrderIds }, { returnDocument: 'after' })
        const updateNextColumn = Column.findByIdAndUpdate(nextColumnId, { cardOrderIds: nextCardOrderIds }, { returnDocument: 'after' })
        const updateCard = Card.findByIdAndUpdate(cardId, { columnId: nextColumnId }, { returnDocument: 'after' })

        await Promise.all([updatePrevColumn, updateNextColumn, updateCard])

        res.status(200).json({ message: 'Card moved successfully!' })
    } catch (error) {
        next(error)
    }
}

const updateBoard = async (req, res, next) => {
    try {
        const boardId = req.params.id
        const { columnOrderIds, description, title, type } = req.body

        const updateData = {}
        if (columnOrderIds) updateData.columnOrderIds = columnOrderIds
        if (description) updateData.description = description
        if (title) updateData.title = title
        if (type) updateData.type = type

        const updatedBoard = await Board.findByIdAndUpdate(
            boardId,
            updateData,
            { returnDocument: 'after' }
        )

        if (!updatedBoard) {
            res.status(404)
            throw new Error('Board not found!')
        }

        res.status(200).json({ message: 'Board updated successfully!', board: updatedBoard })
    } catch (error) {
        next(error)
    }
}

module.exports = { createNewBoard, getBoardDetails, moveCardToDifferentColumn, updateBoard }