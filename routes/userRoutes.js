const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protector = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');


router.get('/', protector, userController.getAllUser);

router.put(
    '/profile',
    protector,
    upload.single('profilePic'),
    userController.updateProfile
);


module.exports = router;