
const jwt=require('jsonwebtoken');
const user = require('../schema/user');
require('dotenv').config();
const authenticate=async(req,res,next)=>{
//if user is logged in permit(next) otherwise go outside
try {
    const {token}=req.headers;
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const User=await user.findById(decoded.userId).select('-password');
    if(!User){
       return res.json({success:false,msg:'user not found'})
    }

    req.User=User;
    next();

} catch (error) {
    res.json({success:false,msg:'Error of type 105'})
}
}


module.exports=authenticate;