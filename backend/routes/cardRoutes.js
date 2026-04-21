const express = require ('express')
const router = express.Router()
const {createNewCard, updateCard, assignMemberToCard, deleteCard} = require ('../controller/cardController')
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/', protect, createNewCard)
router.put('/:id', protect, updateCard)
router.put('/:id/members', protect, assignMemberToCard)
router.delete('/:id', protect, deleteCard)

module.exports = router