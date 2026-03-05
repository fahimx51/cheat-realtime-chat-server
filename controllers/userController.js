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
        const { id } = req.body;
        console.log(id);

        // 1. Prepare the update data object
        const updateData = {};

        // 2. Handle the file if it exists
        if (req.file) {
            const filePath = req.file.path.replace(/\\/g, '/');
            // Fixed typo: req.protocol (no 'e' at the end)
            updateData.profilePic = `${req.protocol}://${req.get('host')}/${filePath}`;
        }

        // 3. Update the user
        const updateUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData }, // Now includes name AND profilePic
            {
                new: true, // Use 'new: true' as we discussed earlier
                runValidators: true
            }
        ).select('-password');

        if (!updateUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ updateUser });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to update user profile',
            error: error.message // Fixed typo: error.message
        });
    }
};