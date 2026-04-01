const Column = require('../models/columnModel')
const Board = require('../models/boardModel')

const createNewColumn = async (req, res, next) => {
    try {
        const { boardId, title } = req.body

        if (!boardId || !title) {
            res.status(400)
            throw new Error('Board ID and column title are required!')
        }

        const newColumn = await Column.create({ boardId, title })

        await Board.findByIdAndUpdate(
            boardId,
            { $push: { columnOrderIds: newColumn._id } },
            { returnDocument: 'after' }
        )

        res.status(201).json({ message: 'Column created successfully!', column: newColumn })
    } catch (error) {
        next(error)
    }
}

const updateColumn = async (req, res, next) => {
    try {
        const columnId = req.params.id
        const { cardOrderIds, title } = req.body

        const updateData = {}
        if (cardOrderIds) {
            updateData.cardOrderIds = cardOrderIds
        }

        if (title) {
            updateData.title = title
        }

        const updatedColumn = await Column.findByIdAndUpdate(
            columnId,
            updateData,
            { returnDocument: 'after' }
        )

        if (!updatedColumn) {
            res.status(404)
            throw new Error('Column not found!')
        }

        res.status(200).json({ message: 'Column updated successfully!', column: updatedColumn })
    } catch (error) {
        next(error)
    }
}

module.exports = { createNewColumn, updateColumn }