let onlineUsers = new Map(); // std::map<string, std::set<string>>

module.exports = (io) => {
    // Event name must be lowercase 'connection'
    io.on("connection", (socket) => {
        const userId = socket.userId; // Provided by your auth middleware

        if (userId) {
            // Initialize set for new user (C++: if(!m.count(k)) m[k] = set())
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }

            // Add current device to the set
            onlineUsers.get(userId).add(socket.id);

            // Broadcast keys to everyone (C++: iterate keys into a vector)
            io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

            console.log(`User ${userId} connected. Unique users: ${onlineUsers.size}`);
        }

        // --- REAL-TIME MESSAGE HANDLER ---
        // Change: 'socket.io' to 'socket.on'
        socket.on("sendMessage", (data) => {
            const receiverSockets = onlineUsers.get(data.recipientId);

            if (receiverSockets) {
                receiverSockets.forEach((socketId) => {
                    // Send to all active devices of the recipient
                    io.to(socketId).emit("getMessage", {
                        senderId: userId, // The sender is the current socket's user
                        text: data.text,
                        createdAt: new Date()
                    });
                });
            }
        });

        // --- DISCONNECT (THE DESTRUCTOR) ---
        socket.on("disconnect", () => {
            if (userId && onlineUsers.has(userId)) {
                const userDevices = onlineUsers.get(userId);
                userDevices.delete(socket.id);

                if (userDevices.size === 0) {
                    onlineUsers.delete(userId);
                }

                // Update the global online list
                io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
                console.log(`User ${userId} disconnected.`);
            }
        });
    });
};