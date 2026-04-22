const Board = require('../models/boardModel')
const Column = require('../models/columnModel')
const Card = require('../models/cardModel')
const User = require('../models/userModel')
const { createNotification } = require('../utils/notificationHelper')

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
            .populate('ownerIds', 'name email username avatar')
            .populate('memberIds', 'name email username avatar')
            .populate({
                path: 'columnOrderIds',
                populate: {
                    path: 'cardOrderIds',
                    populate: {
                        path: 'memberIds',
                        select: 'name email avatar'
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
        const { boardId, cardId, prevColumnId, prevCardOrderIds, nextColumnId, nextCardOrderIds } = req.body

        const updatePrevColumn = Column.findByIdAndUpdate(prevColumnId, { cardOrderIds: prevCardOrderIds }, { returnDocument: 'after' })
        const updateNextColumn = Column.findByIdAndUpdate(nextColumnId, { cardOrderIds: nextCardOrderIds }, { returnDocument: 'after' })
        const updateCard = Card.findByIdAndUpdate(cardId, { columnId: nextColumnId }, { returnDocument: 'after' })

        await Promise.all([updatePrevColumn, updateNextColumn, updateCard])

        // Phát tín hiệu Real-time cho mọi người trong Board
        const io = req.app.get('socketio');
        io.to(boardId).emit('api_update_board', { message: 'Card moved!' });

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
        if (columnOrderIds !== undefined) updateData.columnOrderIds = columnOrderIds
        if (description !== undefined) updateData.description = description
        if (title !== undefined) updateData.title = title
        if (type !== undefined) updateData.type = type

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
        
        // Real-time: Thông báo bảng đã cập nhật
        const io = req.app.get('socketio');
        io.to(boardId).emit('api_update_board', { message: 'Board layout changed!' });
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
        
        // Gửi thông báo cho người được mời
        await createNotification(
            user._id, 
            req.user._id, 
            'BOARD_INVITATION', 
            'New Board Invitation', 
            `You have been invited to join the board: "${board.title}"`,
            board._id
        );

        res.status(200).json({ message: 'Member added successfully!', board });
    } catch (error) {
        next(error);
    }
}

const removeMemberFromBoard = async (req, res, next) => {
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

        const userIdString = user._id.toString() // who got kick
        const requesterId = req.user._id.toString(); // who kick
        const isRequesterAdmin = board.ownerIds.some(id => id.toString() === requesterId);
        const isRemovingSelf = requesterId === userIdString;
        const isUserAdmin = board.ownerIds.some(id => id.toString() === userIdString);

        if (!isRemovingSelf && !isRequesterAdmin) {
            res.status(403)
            throw new Error('Error')
        }

        if (isUserAdmin && board.ownerIds.length === 1) {
            res.status(403)
            throw new Error('Cannot remove the last Admin!')
        }

        const updatedBoard = await Board.findByIdAndUpdate(boardId,
            {
                $pull: {
                    ownerIds: user._id,
                    memberIds: user._id
                }
            },
            { returnDocument: 'after' }
        ).populate('ownerIds memberIds', 'name email avatar')

        await Card.updateMany(
            { boardId: boardId },
            { $pull: { memberIds: user._id } }
        )

        res.status(200).json({ message: 'Member removed successfully!', board: updatedBoard });
    } catch (error) {
        next(error);
    }
}

const updateMemberRole = async (req, res, next) => {
    try {
        const { userId, email, action } = req.body
        let targetUserId = userId
        const boardId = req.params.id

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

        const board = await Board.findById(boardId)

        if (!board) {
            res.status(404)
            throw new Error('Board does not exist')
        }

        const isRequesterAdmin = board.ownerIds.some(id => id.toString() === req.user._id.toString());
        const isTargetAdmin = board.ownerIds.some(id => id.toString() === targetUserId.toString());

        if (!isRequesterAdmin) {
            res.status(403)
            throw new Error('Only Admin can update roles!')
        }

        let updateData = {}
        if (action === 'promote') {
            updateData = {
                $addToSet: { ownerIds: targetUserId },
                $pull: { memberIds: targetUserId }
            }
        } else if (action === 'demote') {
            if (!isTargetAdmin) {
                res.status(403)
                throw new Error('User is not an Admin!')
            }

            if (board.ownerIds.length === 1) {
                res.status(403)
                throw new Error('Cannot demote the last Admin!')
            }

            updateData = {
                $addToSet: { memberIds: targetUserId },
                $pull: { ownerIds: targetUserId }
            }
        } else {
            res.status(400)
            throw new Error('Invalid action! Only "promote" or "demote" are accepted.')
        }



        const updatedBoard = await Board.findByIdAndUpdate(
            boardId,
            updateData,
            { returnDocument: 'after' }
        ).populate(
            'ownerIds memberIds', 'name email'
        )

        if (!updatedBoard) {
            res.status(404)
            throw new Error('Can not update Role!')
        }

        res.status(200).json({ message: 'Member Role updated successfully!', board: updatedBoard })

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createNewBoard,
    getBoardDetails,
    moveCardToDifferentColumn,
    updateBoard,
    getAllUserBoards,
    deleteBoard,
    addMemberToBoard,
    removeMemberFromBoard,
    updateMemberRole
}