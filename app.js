const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const app = express();

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send("<h1 style='color : blue;'> Cheat Server is working! <h1/>")
});

app.listen(PORT, () => {
    console.log(`App is listen from port ${PORT}`);
}); 