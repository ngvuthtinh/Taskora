const Column = require('../models/columnModel')
const Board = require('../models/boardModel')

const createNewColumn = async (req, res) => {
    try {
        const { boardId, title } = req.body

        const newColumn = await Column.create({
            boardId,
            title
        })

        await Board.findByIdAndUpdate(
            boardId,
            { $push: { columnOrderIds: newColumn._id } },
            { returnDocument: 'after' }
        )

        res.status(201).json({ message: 'Tạo Cột thành công!', column: newColumn });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo Column', error: error.message });
    }
}

const updateColumn = async (req, res) => {
    try {
        const columnId = req.params.id;

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
            return res.status(404).json({ message: 'Không tìm thấy Cột này!' });
        }

        res.status(200).json({ message: 'Cập nhật Cột thành công!', column: updatedColumn });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật Cột', error: error.message });
    }
}

module.exports = { createNewColumn, updateColumn }