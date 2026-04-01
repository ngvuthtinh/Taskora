const express = require ('express')
const router = express.Router()
const {createNewCard, updateCard} = require ('../controller/cardController')
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/', protect, createNewCard)
router.put('/:id', protect, updateCard)

module.exports = router