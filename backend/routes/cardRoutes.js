const express = require ('express')
const router = express.Router()
const {createNewCard} = require ('../controller/cardController')
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/', protect, createNewCard)

module.exports = router