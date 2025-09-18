const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/auth')
const {getAllUser,getAllMessages,seenMessages,sendMessage}=require('../controller/messageController')

router.get('/users',authenticate,getAllUser);
router.get('/:id',authenticate,getAllMessages);
router.put('/mark/:id',authenticate,seenMessages);
router.post('/send/:id',authenticate,sendMessage)

module.exports=router;
