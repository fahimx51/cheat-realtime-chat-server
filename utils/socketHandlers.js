module.exports = (io) => {
    io.on("Connection", (socket) => {
        console.log(socket.id);
    });
};