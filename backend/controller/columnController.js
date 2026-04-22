const Column = require('../models/columnModel')
const Board = require('../models/boardModel')
const Card = require('../models/cardModel')

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

        // Real-time
        const io = req.app.get('socketio');
        io.to(boardId.toString()).emit('api_update_board', { message: 'Column created' });

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
        if (cardOrderIds) updateData.cardOrderIds = cardOrderIds
        if (title) updateData.title = title

        const updatedColumn = await Column.findByIdAndUpdate(
            columnId,
            updateData,
            { returnDocument: 'after' }
        )

        if (!updatedColumn) {
            res.status(404)
            throw new Error('Column not found!')
        }

        // Real-time
        const io = req.app.get('socketio');
        io.to(updatedColumn.boardId.toString()).emit('api_update_board', { message: 'Column updated' });

        res.status(200).json({ message: 'Column updated successfully!', column: updatedColumn })
    } catch (error) {
        next(error)
    }
}

const deleteColumn = async (req, res, next) => {
    try {
        const columnId = req.params.id
        const column = await Column.findById(columnId)

        if (!column) {
            res.status(404)
            throw new Error('Column not found!')
        }

        await Column.findByIdAndDelete(columnId)

        await Card.deleteMany({columnId: columnId})

        await Board.findByIdAndUpdate(column.boardId, {
            $pull: { columnOrderIds: columnId }
        })
        // Real-time
        const io = req.app.get('socketio');
        io.to(column.boardId.toString()).emit('api_update_board', { message: 'Column deleted' });

        res.status(200).json({ message: 'Column deleted successfully!' })
    } catch (error) {
        next(error)
    }
}

module.exports = { createNewColumn, updateColumn, deleteColumn }