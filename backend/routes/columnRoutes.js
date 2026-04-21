const express = require ('express')
const router = express.Router()
const {createNewColumn, updateColumn, deleteColumn} = require ('../controller/columnController')
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/', protect, createNewColumn)
router.put('/:id', protect, updateColumn)
router.delete('/:id', protect, deleteColumn)

module.exports = router