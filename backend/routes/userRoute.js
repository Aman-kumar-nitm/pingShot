const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/auth')
const {signup,login,updateProfile,checkAuth}=require('../controller/userController');
router.post('/signup',signup);
router.post('/login',login);
router.post('/updateProfile',authenticate,updateProfile);
router.get('/check',authenticate,checkAuth)

module.exports=router;
