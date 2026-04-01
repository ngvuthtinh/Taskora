const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  boardId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Board', 
    required: true 
  },
  columnId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Column', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: null 
  },
  memberIds: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: []
  }]
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema)