const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    receiverId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    text:{type:String},
    image:{type:String},
    seen:{type:Boolean,default:false}
}, { timestamps: true });

// ✅ lowercase 'model'
module.exports = mongoose.model('Message', MessageSchema);
