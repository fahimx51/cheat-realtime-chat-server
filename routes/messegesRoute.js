const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const msgController = require('../controllers/messegeController');

router.post('/send', protect, msgController.sendMessege);


module.exports = router;