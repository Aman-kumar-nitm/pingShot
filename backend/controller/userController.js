
const bcrypt=require('bcryptjs');
const generateToken = require("../utils/createToken");
require('dotenv').config();
const jwt=require('jsonwebtoken');
const user = require('../schema/user');
const cloudinary= require('../db/cloudinary');


const signup=async(req,res)=>{
try {
    const {fullName,email,password,bio}=req.body;
    // check for unique email{done by schema} and for double checking we can write any field should not be empty
    if(!fullName||!email||!password||!bio){
       return res.json({success:false,msg:'please fill all the credentials'})
    }
   const User=await user.findOne({email});
   if(User){
    return res.json({success:false,msg:'user already exist'})
   }
    //bcrypt the password create the token and save to user schema
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser=await user.create({fullName,email,password:hashedPassword,bio});

    const token=generateToken(newUser._id);
    res.json({success:true,userData:User,token:token})
    

} catch (error) {
    res.json({success:false,msg:'Internal Server Error 101'})
}
}
const login=async(req,res)=>{
   try {
    
    const {email,password}=req.body;
   
    if(!email||!password){
      return  res.json({success:false,msg:'please provide all Credentials'})
    }

    const userData=await user.findOne({email});
    
    if(!userData){
      return  res.json({success:false,msg:'not registered singUp first'})
    }
    //verify the password and return the token

    const ismatch=await bcrypt.compare(password,userData.password)
    console.log(ismatch);
    if(ismatch){
        const token=generateToken(userData._id);
        res.json({success:true,userData,token});
    }else{
        res.json({success:false,msg:'invalid password'})
    }

    
} catch (error) {
    res.json({success:false,msg:'Internal Server Error 102'})
} 

}
const updateProfile=async(req,res)=>{
try {

    const {profilePic,bio,fullName}=req.body;
    //since middleware will be called
    const userId=req.User._id;

    let updateUser;
    if(!profilePic){
        updateUser=await user.findByIdAndUpdate(userId,{bio,fullName},{new:true})
    }else{
        
        const upload=await cloudinary.uploader.upload(profilePic);
        updateUser=await user.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});
    }

    res.json({success:true,userData:updateUser});
    
} catch (error) {
    res.json({success:false,msg:'Internal Server Error 103'})
}
}
const checkAuth=async(req,res)=>{
try {
    const userId=req.User._id;
    // find user with this id and send
    const User=await user.findOne({_id:userId});
    res.json({success:true,User});

} catch (error) {
    res.json({success:false,msg:'not authorized please check'})
}
}
module.exports={signup,login,updateProfile,checkAuth}