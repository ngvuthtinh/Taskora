const Column = require ('../models/columnModel')
const Board = require('../models/boardModel')

const createNewColumn = async (req, res) => {
    try {
        const {boardId, title} = req.body

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

module.exports = {createNewColumn}