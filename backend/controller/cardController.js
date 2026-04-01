const Card = require('../models/cardModel')
const Column = require('../models/columnModel')

const createNewCard = async (req, res, next) => {
    try {
        const { boardId, columnId, title, description } = req.body

        if (!boardId || !columnId || !title) {
            res.status(400)
            throw new Error('Board ID, column ID and card title are required!')
        }

        const newCard = await Card.create({ boardId, columnId, title, description })

        await Column.findByIdAndUpdate(
            columnId,
            { $push: { cardOrderIds: newCard._id } },
            { returnDocument: 'after' }
        )

        res.status(201).json({ message: 'Card created successfully!', card: newCard })
    } catch (error) {
        next(error)
    }
}

const updateCard = async (req, res, next) => {
    try {
        const { title, description } = req.body

        const card = await Card.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { returnDocument: 'after' }
        )

        if (!card) {
            res.status(404)
            throw new Error('Card not found!')
        }

        res.status(200).json({ message: 'Card updated successfully!', card: card })
    } catch (error) {
        next(error)
    }
}

const assignMemberToCard = async (req, res, next) => {
    try {
        const cardId = req.params.id
        const { userId, action } = req.body

        let updateData = {}

        if (action === 'add') {
            updateData = { $addToSet: { memberIds: userId } }
        } else if (action === 'remove') {
            updateData = { $pull: { memberIds: userId } }
        } else {
            res.status(400)
            throw new Error('Invalid action! Only "add" or "remove" are accepted.')
        }

        const updatedCard = await Card.findByIdAndUpdate(cardId, updateData, { returnDocument: 'after' })

        if (!updatedCard) {
            res.status(404)
            throw new Error('Card not found!')
        }

        res.status(200).json({ message: 'Member updated successfully!', card: updatedCard })
    } catch (error) {
        next(error)
    }
}

module.exports = { createNewCard, updateCard, assignMemberToCard }