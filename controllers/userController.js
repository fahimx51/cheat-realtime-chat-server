const User = require("../models/userSchema");

exports.getAllUser = async (req, res) => {
    try {
        const user = await User.find();
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(500).json({ messege: error.messege });
    }
};

