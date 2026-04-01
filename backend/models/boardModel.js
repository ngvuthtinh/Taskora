const mongoose = require('mongoose')

const Schema = mongoose.Schema

const boardSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    ownerIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    columnOrderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }]
}, {timestamps: true})

module.exports = mongoose.model('Board', boardSchema)