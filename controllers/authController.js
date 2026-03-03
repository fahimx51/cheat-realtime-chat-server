const User = require('../models/userSchema');
const bcryptjs = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { email, password, name, phoneNumber } = req.body;

        const normalizeEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizeEmail });

        if (existingUser) return res.status(400).json({ messege: 'User email already exist' });

        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = await User.create({
            email: email,
            password: hashedPassword,
            name: name,
            phoneNumber: phoneNumber
        });

        res.status(201).json({
            messege: "User create successfully",
            data: user
        });
    }

    catch (error) {
        res.status(500).json({ messege: error.messege });
    }

};