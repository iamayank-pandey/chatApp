const express = require("express");
const messageController = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.post('/', messageController.sendMessage);
router.get('/:chatId', messageController.getAllMessages);

module.exports = router;