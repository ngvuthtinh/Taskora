const express = require ('express')
const router = express.Router()
const {createNewColumn} = require ('../controller/columnController')
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/', protect, createNewColumn)

module.exports = router