const express = require('express')
const router = express.Router()
const { 
    createNewBoard, 
    getBoardDetails, 
    moveCardToDifferentColumn, 
    updateBoard, 
    getAllUserBoards, 
    deleteBoard, 
    addMemberToBoard, 
    removeMemberFromBoard, 
    updateMemberRole } = require('../controller/boardController')
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllUserBoards)
router.post('/', protect, createNewBoard)
router.get('/:id', protect, getBoardDetails)
router.put('/supports/moving-card', protect, moveCardToDifferentColumn)
router.put('/:id', protect, updateBoard)
router.delete('/:id', protect, deleteBoard)
router.post('/:id/members', protect, addMemberToBoard)
router.delete('/:id/members', protect, removeMemberFromBoard)
router.put('/:id/members/role', protect, updateMemberRole)

module.exports = router