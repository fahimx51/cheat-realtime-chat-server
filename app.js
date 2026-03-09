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
const cors = require('cors');

const PORT = process.env.PORT || 10000;

const app = express();
app.use(express.json());

app.use(cors());


connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Use your EXACT frontend port
        methods: ["GET", "POST"],
        credentials: true
    },
    // This forces the browser to try WebSockets immediately
    transports: ['websocket', 'polling']
});

io.use((socket, next) => {
    // Check every possible place the token could be
    const token = socket.handshake.auth?.token ||
        socket.handshake.query?.token ||
        socket.request._query?.token;

    if (!token) {
        console.log("❌ Socket Reject: No token provided");
        return next(new Error("Authentication error"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            console.log("❌ Socket Reject: Invalid token");
            return next(new Error("Authentication error"));
        }
        // Ensure this matches your JWT sign payload (id or _id)
        socket.userId = decoded.id || decoded._id;
        console.log(`✅ Socket Authenticated: ${socket.userId}`);
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