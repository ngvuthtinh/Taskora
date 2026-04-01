const mongoose = require ('mongoose')

const Schema = mongoose.Schema

const columnSchema = new Schema ({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    cardOrderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card', default: [] }]
}, {timestamps: true})

module.exports = mongoose.model('Column', columnSchema)