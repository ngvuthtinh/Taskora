const express = require ('express')
const router = express.Router()
const {createNewColumn, updateColumn} = require ('../controller/columnController')
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/', protect, createNewColumn)
router.put('/:id', protect, updateColumn)

module.exports = router