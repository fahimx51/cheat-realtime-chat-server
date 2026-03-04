const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protector = require('../middleware/authMiddleware');


router.get('/', protector, userController.getAllUser);
router.put('/profile', protector, userController.updateProfile);


module.exports = router;