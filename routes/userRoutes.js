const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protector = require('../middleware/authMiddleware');


router.get('/', protector, userController.getAllUser);


module.exports = router;