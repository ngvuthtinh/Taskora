const Card = require('../models/cardModel')
const Column = require('../models/columnModel')

const createNewCard = async (req, res) => {
    try {
        const { boardId, columnId, title, description } = req.body

        const newCard = await Card.create({
            boardId,
            columnId,
            title,
            description
        })

        await Column.findByIdAndUpdate(
            columnId,
            { $push: { cardOrderIds: newCard._id } },
            { returnDocument: 'after' }
        )

        res.status(201).json({ message: 'Tạo Card thành công!', card: newCard });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo Card', error: error.message });
    }
}

module.exports = {createNewCard}