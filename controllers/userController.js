const User = require("../models/userSchema");

exports.getAllUser = async (req, res) => {
    try {
        const user = await User.find();
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(500).json({
            messege: 'Failed to get all user',
            error: error.messege
        });
    }
};

exports.updateProfile = async (req, res) => {

    try {
        console.log("Data from postman : ", req.body);

        const { id, name } = req.body;

        const updateUser = await User.findByIdAndUpdate(
            id,
            { name },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updateUser) {
            return res.status(404).json({ messege: "user not found" });
        }

        res.status(201).json({ updateUser });
    }
    catch (error) {
        res.status(500).json({
            messege: 'Failed to update user profile',
            error: error.messege
        });
    }
};

