const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
    },

    profilePic: {
        type: String,
        default: function () {
            return `https://ui-avatars.com/api/?name=${this.email}&background=random&color=fff`;
        }
    },

    phoneNumber: {
        type: String,
        default: ""
    },

    isOnline: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }

);

module.exports = mongoose.model("User", userSchema);