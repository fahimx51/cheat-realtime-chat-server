const http = require('http');
const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messegesRoutes = require('./routes/messegesRoute');
const { Server } = require('socket.io');
const socketHandlers = require('./utils/socketHandlers');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());


connectDB();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.use((socket, next) => {
    // const token = socket.handshake.auth.token;
    const token = socket.handshake.query.token;

    if (!token) return next(new Error("Auth Error"));

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return next(new Error("Token Error"));
        }

        socket.userId = decoded.id;
        next();
    });
});

socketHandlers(io);


app.get('/', (req, res) => {
    res.send("<h1 style='color : blue;'> Cheat Server is working! <h1/>")
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messegesRoutes);

server.listen(PORT, () => {
    console.log(`App is listen from port ${PORT}`);
}); 