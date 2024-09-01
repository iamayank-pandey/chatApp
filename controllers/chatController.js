const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.accessChat = catchAsync(async (req, res, next)=>{
    const { userId } = req.body;

    if(!userId){
        return next(new AppError("UserId is missing", 400));
    }
    if(userId === req.user.id){
        return next(new AppError("UserId is same as logged in user", 400));
    }

    const availableChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: {$eq: req.user.id} } },
            { users: { $elemMatch: {$eq: userId} } }
        ]
    }).populate({path: 'users', select: 'name email phone profilePicture _id'}).populate('latestMessage').populate({
        path: "latestMessage.sender",
        select: "name email phone _id"
    });

    if(availableChat.length > 0){
        res.status(200).json({
            status :'success',
            data: availableChat[0]
        })
    } else{
        let newChat = await Chat.create({
            chatName: "sender",
            users: [req.user._id, userId]
        })
        newChat = await newChat.populate({path: 'users', select: 'name email phone profilePicture _id'})
        
        res.status(200).json({
            status :'success',
            data: {
                newChat
            }
        });
    }
});

exports.fetchChats = catchAsync(async (req, res, next)=>{
    const allChats = await Chat.find({users: { $elemMatch: {$eq: req.user.id} } }).populate('users').populate('groupAdmin').populate('latestMessage').populate({
        path: "latestMessage.sender",
        select: "name email phone _id"
    }).sort({updatedAt: -1});
    res.status(200).json({
        status :'success',
        numberOfChats: allChats.length,
        data: {
            allChats
        }
    });
});

exports.createGroupChat = catchAsync(async (req, res, next)=>{
    const { users, name } = req.body;
    if(!users || !name){
        return next(new AppError("UserIds and group name should be available", 400));
    }
    const parsedUsers = JSON.parse(users).filter(user => user !== req.user.id);
    
    if(parsedUsers.length < 2){
        return next(new AppError("No group can be created with 2 users.", 400));
    }
    //duplicate checks and other checks are remaining
    parsedUsers.unshift(req.user.id)
    let newChat = await Chat.create({
        chatName: name,
        isGroupChat: true,
        users: parsedUsers,
        groupAdmin: req.user.id
    });
    newChat = await newChat.populate({path: 'users', select: 'name email phone profilePicture _id'})
    newChat = await newChat.populate("groupAdmin")
    
    res.status(200).json({
        status :'success',
        data: {
            newChat
        }
    });
});

exports.renameGroup = catchAsync(async (req, res, next)=>{
    const {chatId, name} = req.body;
    const updatedGroup = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: name
        },
        {
            new: true
        }
    ).populate('users').populate('groupAdmin');
    if(!updatedGroup){
        return next(new AppError("Chat not found", 400));
    }
    res.status(200).json({
        status :'success',
        data: {
            updatedGroup
        }
    });
});

exports.addUserToGroup = catchAsync(async (req, res, next)=>{
    const {chatId, userId} = req.body;
    const updatedGroup = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId}
        },
        {
            new: true
        }
    ).populate('users').populate('groupAdmin');
    if(!updatedGroup){
        return next(new AppError("Chat not found", 400));
    }
    res.status(200).json({
        status :'success',
        data: {
            updatedGroup
        }
    });
});

exports.removeUserToGroup = catchAsync(async (req, res, next)=>{
    const {chatId, userId} = req.body;
    const updatedGroup = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {users: userId}
        },
        {
            new: true
        }
    ).populate('users').populate('groupAdmin');
    if(!updatedGroup){
        return next(new AppError("Chat not found", 400));
    }
    res.status(200).json({
        status :'success',
        data: {
            updatedGroup
        }
    });
});
