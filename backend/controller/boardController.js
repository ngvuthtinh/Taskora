const Board = require('../models/boardModel')
const Column = require('../models/columnModel')
const Card = require('../models/cardModel')
const User = require('../models/userModel')

const getAllUserBoards = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const boards = await Board.find({
            $or: [
                { ownerIds: userId },
                { memberIds: userId }
            ]
        }).sort({ updatedAt: -1 });
        res.status(200).json({ boards });
    } catch (error) {
        next(error);
    }
}

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

        const board = await Board.findById(boardId)
            .populate('ownerIds', 'name email username')
            .populate('memberIds', 'name email username')
            .populate({
                path: 'columnOrderIds',
                populate: {
                    path: 'cardOrderIds',
                    populate: {
                        path: 'memberIds',
                        select: 'name email'
                    }
                }
            })


        if (!board) {
            res.status(404)
            throw new Error('Board not found!')
        }

        const userIdString = req.user._id.toString()
        // Vì lúc nãy ta đã gọi .populate('ownerIds memberIds'), nên bây giờ các mảng này chứa cục { _id, name, email } chứ không còn là một cái String ID trọc nữa, do đó phải bốc cái userObj._id ra để đọ:
        const isOwner = board.ownerIds.some(userObj => userObj._id.toString() === userIdString)
        const isMember = board.memberIds.some(userObj => userObj._id.toString() === userIdString)

        if (!isOwner && !isMember) {
            return res.status(403).json({ message: 'You do not have permission!' });
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

const deleteBoard = async (req, res, next) => {
    try {
        const boardId = req.params.id
        const board = await Board.findById(boardId)

        if (!board) {
            res.status(404)
            throw new Error('Board not found!')
        }

        const userIdString = req.user._id.toString()
        const isOwner = board.ownerIds.some(id => id.toString() === userIdString)

        if (!isOwner) {
            res.status(403)
            throw new Error('Only the board owner can delete this board!')
        }

        await Board.findByIdAndDelete(boardId)
        await Column.deleteMany({ boardId: boardId })
        await Card.deleteMany({ boardId: boardId })

        res.status(200).json({ message: 'Board and all its contents deleted successfully!' })
    } catch (error) {
        next(error)
    }
}

const addMemberToBoard = async (req, res, next) => {
    try {
        const { email } = req.body
        const boardId = req.params.id

        const user = await User.findOne({ email })

        if (!user) {
            res.status(404)
            throw new Error('User does not exist')
        }

        const board = await Board.findById(boardId)

        if (!board) {
            res.status(404)
            throw new Error('Board does not exist')
        }

        const userIdString = user._id.toString();
        const isOwner = board.ownerIds.some(id => id.toString() === userIdString);
        const isMember = board.memberIds.some(id => id.toString() === userIdString);

        if (isOwner || isMember) {
            res.status(400)
            throw new Error('User is already a member of this board')
        }

        board.memberIds.push(user._id)

        await board.save()
        res.status(200).json({ message: 'Member added successfully!', board });
    } catch (error) {
        next(error);
    }
}

module.exports = { createNewBoard, getBoardDetails, moveCardToDifferentColumn, updateBoard, getAllUserBoards, deleteBoard, addMemberToBoard }