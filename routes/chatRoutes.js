const express = require('express');
const authentication = require('../middlewares/authMiddleware');
const chatController = require('../controllers/chatController')

const router = express.Router();

router.use(authentication.protect);

router.route('/')
    .post(chatController.accessChat)
    .get(chatController.fetchChats);
router.route('/group').post(chatController.createGroupChat);
router.put("/group/rename", chatController.renameGroup);
router.put("/group/add-user", chatController.addUserToGroup);
router.put("/group/remove-user", chatController.removeUserToGroup);

module.exports = router;