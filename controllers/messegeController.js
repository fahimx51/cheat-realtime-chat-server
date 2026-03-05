const Message = require('../models/messageSchema');
const Conversation = require('../models/conversationSchema');
const mongoose = require('mongoose');

exports.sendMessege = async (req, res) => {
    try {
        const senderId = new mongoose.Types.ObjectId(req.body.senderId);
        const targetId = new mongoose.Types.ObjectId(req.body.recipientId);

        let text = req.body.text;

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, targetId],
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, targetId]
            });
        }

        let newMsg = await Message.create({
            conversationId: conversation._id.toString(),
            senderId: senderId,
            recipientId: targetId,
            text: text?.trim() || '',
            fileUrl: req.body?.fileUrl || null,
            fileType: req.body?.fileType || null
        });

        conversation.lastMessage = newMsg._id;
        conversation.lastMessageText = text?.trim() || (fileUrl ? "[file]" : "");

        await conversation.save();

        res.status(201).json({
            status: 'Success',
            data: newMsg
        })
    }

    catch (error) {
        console.log("Send messege error", error.message);

        res.status(500).json({
            status: "failed to send msg",
            error: error.message
        });

    }
};


exports.getChatHistory = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const myId = req.body.userId;

        // const conversation = await Conversation.findOne({
        //     participants: { $all: [myId, conversationId] }
        // });

        if (!conversationId) return res.json([]);

        const message = await Message.find({
            conversationId: conversationId
        }).sort({ createdAt: 1 });

        res.send(message);
    }
    catch (error) {
        console.log("getting chat history error", error.message);

        res.status(500).json({
            status: "failed to get chat history",
            error: error.message
        });

    }
};

exports.uploadFile = async (req, res) => {
    try {
        const { recipientId, text, senderId } = req.body;

        if (!req.file) return res.status(400).json({ message: 'No File Provided' });
        if (!recipientId) return res.status(400).json({ message: 'Recipient id is missing' });

        const sId = new mongoose.Types.ObjectId(senderId);
        const tId = new mongoose.Types.ObjectId(recipientId);

        // 1. Find or Create the conversation using $all
        let conversation = await Conversation.findOne({
            participants: { $all: [sId, tId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sId, tId]
            });
        }

        // 2. Create the message with the file data
        // Assuming 'req.file.path' or 'req.file.location' contains the URL
        const newMsg = await Message.create({
            conversationId: conversation._id,
            senderId: sId,
            recipientId: tId,
            text: text || "",
            fileUrl: req.file.path, // Path provided by Multer/Cloudinary
            fileType: req.file.mimetype // e.g., 'image/png' or 'application/pdf'
        });

        // 3. Update the last message in the conversation
        conversation.lastMessage = newMsg._id;
        conversation.lastMessageText = text || `Sent an attachment`;
        await conversation.save();

        res.status(201).json({ status: 'Success', data: newMsg });

    }
    catch (error) {
        console.log("file upload failed", error.message);

        res.status(500).json({
            status: "failed to upload file",
            error: error.message
        });

    }
};
