const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    text: {
        type: String,
        required: false
    },

    fileUrl: { type: String },
    fileType: { type: String },
    fileName: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('message', messageSchema);