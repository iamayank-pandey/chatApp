const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: { type: String, trim: true, required: [true, "Chat content is required."] },
    chat: {type: mongoose.Schema.Types.ObjectId, ref: "Chat"}
}, {timestamps: true})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
