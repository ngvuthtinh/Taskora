const express = require('express')
const router = express.Router()
const { createNewBoard, getBoardDetails, moveCardToDifferentColumn, updateBoard, getAllUserBoards } = require('../controller/boardController')
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllUserBoards)
router.post('/', protect, createNewBoard)
router.get('/:id', protect, getBoardDetails)
router.put('/supports/moving-card', protect, moveCardToDifferentColumn)
router.put('/:id', protect, updateBoard)

module.exports = router