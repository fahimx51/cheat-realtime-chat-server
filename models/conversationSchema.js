const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    lastMessage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    lastMessageText: { type: string, default: '' },

}, { timestamps: true });


module.exports = mongoose.model('Converstation', conversationSchema);