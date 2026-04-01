const express = require ('express')
const router = express.Router()
const {createNewBoard, getBoardDetails} = require ('../controller/boardController')
const { protect } = require('../middlewares/authMiddleware'); 


router.post('/', protect, createNewBoard)
router.get('/:id', protect, getBoardDetails)

module.exports = router