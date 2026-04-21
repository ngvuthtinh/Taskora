const Card = require('../models/cardModel')
const Column = require('../models/columnModel')
const User = require('../models/userModel')

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
        const { title, description, labels, dueDate, isCompleted } = req.body

        const updateData = {}
        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (labels !== undefined) updateData.labels = labels
        if (dueDate !== undefined) updateData.dueDate = dueDate
        if (isCompleted !== undefined) updateData.isCompleted = isCompleted

        const card = await Card.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: 'after' }
        ).populate('memberIds', 'name email')

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
        const { userId, email, action } = req.body

        let targetUserId = userId

        if (email) {
            const user = await User.findOne({ email })
            if (!user) {
                res.status(404)
                throw new Error('User with this email does not exist!')
            }
            targetUserId = user._id
        }

        if (!targetUserId) {
            res.status(400)
            throw new Error('Please provide either userId or email.')
        }

        let updateData = {}

        if (action === 'add') {
            updateData = { $addToSet: { memberIds: targetUserId } }
        } else if (action === 'remove') {
            updateData = { $pull: { memberIds: targetUserId } }
        } else {
            res.status(400)
            throw new Error('Invalid action! Only "add" or "remove" are accepted.')
        }

        const updatedCard = await Card.findByIdAndUpdate(cardId, updateData, { returnDocument: 'after' }).populate('memberIds', 'name email')

        if (!updatedCard) {
            res.status(404)
            throw new Error('Card not found!')
        }

        res.status(200).json({ message: 'Member updated successfully!', card: updatedCard })
    } catch (error) {
        next(error)
    }
}

const deleteCard = async (req, res, next) => {
    try {
        const cardId = req.params.id
        const card = await Card.findById(cardId)

        if (!card) {
            res.status(404)
            throw new Error('Card not found!')
        }

        await Card.findByIdAndDelete(cardId)

        await Column.findByIdAndUpdate(card.columnId, {
            $pull: { cardOrderIds: cardId }
        })
        res.status(200).json({ message: 'Card deleted successfully!' })
    } catch (error) {
        next(error)
    }
}

module.exports = { createNewCard, updateCard, assignMemberToCard, deleteCard }