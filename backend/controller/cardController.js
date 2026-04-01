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

const updateCard = async (req, res) => {
    try {
        const { title, description } = req.body

        const card = await Card.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { returnDocument: 'after' }
        )

        if (!card) {
            return res.status(404).json({ error: 'No such Card' })
        }

        res.status(200).json({ message: 'Update Card thành công!', card: card })
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi update Card', error: error.message })
    }
}



module.exports = { createNewCard, updateCard }