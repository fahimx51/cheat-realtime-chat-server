const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        require: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    receipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },

    text: {
        type: String,
        require: false
    },

    fileUrl: { type: String },
    fileType: { type: String },
    fileName: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('message', messageSchema);