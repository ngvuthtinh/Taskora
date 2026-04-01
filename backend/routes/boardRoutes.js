const express = require ('express')
const router = express.Router()
const {createNewBoard, getBoardDetails, moveCardToDifferentColumn} = require ('../controller/boardController')
const { protect } = require('../middlewares/authMiddleware'); 


router.post('/', protect, createNewBoard)
router.get('/:id', protect, getBoardDetails)
router.put('/supports/moving-card', protect, moveCardToDifferentColumn)

module.exports = router