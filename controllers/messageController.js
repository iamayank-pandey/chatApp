const catchAsync = require("../utils/catchAsync");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const AppError = require("../utils/appError");

exports.sendMessage = catchAsync(async (req, res, next) =>{
    const { content, chatId } = req.body;
    if(!content || !chatId){
        return next(new AppError("Invalid data input", 400))
    }
    let saveMessage = await Message.create({
        sender: req.user._id,
        content: content,
        chat: chatId
    });
    saveMessage = await saveMessage.populate('sender', "name pic email");
    saveMessage = await saveMessage.populate('chat');
    saveMessage = await User.populate(saveMessage, {
        path: 'chat.users',
        select: "name profilePicture email"
    });

    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: saveMessage._id
    })

    res.status(200).json({
        status :'success',
        data: {
            saveMessage
        }
    })
});

exports.getAllMessages = catchAsync(async (req, res, next) =>{
    const chatId = req.params.chatId;
    const allMessages = await Message.find({
        chat: chatId
    }).populate('sender', 'name profilePicture email');

    res.status(200).json({
        status :'success',
        data: {
            allMessages
        }
    })
});