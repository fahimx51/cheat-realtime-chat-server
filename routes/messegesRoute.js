const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const msgController = require('../controllers/messegeController');

router.post('/send', protect, msgController.sendMessege);
router.get('/:conversationId', protect, msgController.getChatHistory);
router.post('/upload', protect, upload.single('file'), msgController.uploadFile);


module.exports = router;