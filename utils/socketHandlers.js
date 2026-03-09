let onlineUsers = new Map();

module.exports = (io) => {
    io.on("connection", (socket) => {
        const userId = socket.userId;

        if (userId) {
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }
            onlineUsers.get(userId).add(socket.id);
            io.emit("getOnlineUser", Array.from(onlineUsers.keys())); // Match frontend event name
        }

        // --- REAL-TIME MESSAGE HANDLER ---
        // utils/socketHandlers.js
        socket.on("sendMessage", (newMessage) => {
            // newMessage should have: senderId, recipientId, text, _id
            const receiverSockets = onlineUsers.get(newMessage.recipientId);

            if (receiverSockets) {
                receiverSockets.forEach((socketId) => {
                    // Push the FULL message object to User B
                    io.to(socketId).emit("getMessage", newMessage);
                });
            }
        });

        socket.on("disconnect", () => {
            if (userId && onlineUsers.has(userId)) {
                const userDevices = onlineUsers.get(userId);
                userDevices.delete(socket.id);
                if (userDevices.size === 0) {
                    onlineUsers.delete(userId);
                }
                io.emit("getOnlineUser", Array.from(onlineUsers.keys()));
            }
        });
    });
};