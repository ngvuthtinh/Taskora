const express = require ('express')
const router = express.Router()
const {createNewCard, updateCard, assignMemberToCard} = require ('../controller/cardController')
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/', protect, createNewCard)
router.put('/:id', protect, updateCard)
router.put('/:id/members', protect, assignMemberToCard)

module.exports = router