const Message = require('../models/messageSchema');
const Conversation = require('../models/conversationSchema');
const mongoose = require('mongoose');

exports.sendMessege = async (req, res) => {
    try {
        const senderId = req.user._id || req.user.id;
        const targetId = req.body.recipientId;

        if (!targetId) return res.status(400).json({ message: "Recipient ID required" });

        // 1. Find existing conversation using $all
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, targetId] }
        });

        // 2. If it doesn't exist, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, targetId]
            });
        }

        // 3. Create the message
        const newMsg = await Message.create({
            conversationId: conversation._id.toString(),
            senderId,
            recipientId: targetId,
            text: req.body.text?.trim() || '',
            fileUrl: req.body?.fileUrl || null,
            fileType: req.body?.fileType || null
        });

        // 4. Update the conversation metadata
        conversation.lastMessage = newMsg._id;
        conversation.lastMessageText = newMsg.text || "Sent an attachment";
        await conversation.save();

        res.status(201).json({
            status: 'Success',
            data: newMsg
        });
    } catch (error) {
        console.error("🔥 Send message error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.uploadFile = async (req, res) => {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user._id || req.user.id; // Get from Auth, not body

        if (!req.file) return res.status(400).json({ message: 'No File Provided' });

        // USE THE SAME UPSERT LOGIC HERE
        let conversation = await Conversation.findOneAndUpdate(
            { participants: { $all: [senderId, recipientId] } },
            { $set: { participants: [senderId, recipientId] } },
            { upsert: true, new: true }
        );

        const newMsg = await Message.create({
            conversationId: conversation._id,
            senderId,
            recipientId,
            text: text || "",
            fileUrl: req.file.path,
            fileType: req.file.mimetype
        });

        conversation.lastMessage = newMsg._id;
        conversation.lastMessageText = text || `Sent an attachment`;
        await conversation.save();

        // Standardize the response to match sendMessege
        res.status(201).json({
            status: 'Success',
            data: newMsg
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Add this back to your messageController.js
exports.getChatHistory = async (req, res) => {
    try {
        const { conversationId: recipientId } = req.params;
        const myId = req.user._id || req.user.id;

        if (!recipientId || recipientId === "undefined") {
            return res.status(400).json({ message: "Invalid recipient ID" });
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [myId, recipientId] }
        });

        if (!conversation) {
            return res.status(200).json([]);
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Chat history error:", error.message);
        res.status(500).json({ status: "failed", message: error.message });
    }
};