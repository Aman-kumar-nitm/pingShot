
const user=require('../schema/user')
const Message=require('../schema/Message');
const connectCloudinary = require('../db/cloudinary');
const { getIO, getUserSocketMap } = require("../socket");

const io = getIO();
const userSocketMap = getUserSocketMap();

// get all user except the logged in user
const getAllUser=async(req,res)=>{
try {
    const userId=req.User._id;
    const filterUser=await user.find({_id:{$ne:userId}}).select('-password');
    // count no of messages not seen
    const unSeenMessage={};
    const promises=filterUser.map(async(User)=>{
        const messages=await Message.find({senderId:User._id,receiverId:userId,seen:false});
        if(messages.length>0){
            unSeenMessage[User._id]=messages.length;
        }
    })

    await Promise.all(promises);
    res.json({success:true,users:filterUser,unSeenMessage})

} catch (error) {
    res.json({success:false,msg:'internal server error'})
}
}

// get all messages for selected User
const getAllMessages=async(req,res)=>{
try {
    // find all the messages send by selected user to the receiver
    const {id:selectedUserId}=req.params;
    const myId=req.User._id;
    const messages=await Message.find({$or:[
        {senderId:myId,receiverId:selectedUserId},
        {senderId:selectedUserId,receiverId:myId},
    ]});
    // mark the messages read
    await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true});
    res.json({success:true,msg:messages});
} catch (error) {
    res.json({success:false,msg:'internal server error'})
}
}
// mark message as seen by their id
const seenMessages=async(req,res)=>{
    try {
        const {id}=req.params;
        await Message.findOneAndUpdate(id,{seen:true});
        res.json({success:true})
    } catch (error) {
        res.json({success:false,msg:'internal server error'})
    }
}
// send message to selected user
const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const senderId=req.User._id;
        const receiverId=req.params.id;
        let imageUrl;
        if(image){
            const uploadResponse=await connectCloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=await Message.create({senderId,receiverId,text,image:imageUrl});
        // emit the newMessage to receiverSocket
        const receiverSocketId=userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.json({success:true,newMessage});
    } catch (error) {
        res.json({success:false,msg:'internal server error'})
    }
}
module.exports={getAllUser,getAllMessages,seenMessages,sendMessage}