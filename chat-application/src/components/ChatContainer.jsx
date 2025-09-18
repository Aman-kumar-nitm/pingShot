import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../chat-app-assets/assets'
import { convertMessageTime } from '../lib/utils'
import { useContext } from 'react'
import { ChatContext } from '../shopContext/ChatContext'
import { AuthContext } from '../shopContext/AuthContext'
import { useState } from 'react'

const ChatContainer = () => {
  const scrollEnd=useRef();
  const {messages,selectedUser,getAllMessages,sendMessage,setSelectedUser,unseenMessage}=useContext(ChatContext)
  const {authUser,onlineUser}=useContext(AuthContext)

  const [inputMess,setInputMess]=useState("");

  const handleSendMessage=async(e)=>{
    e.preventDefault();
    if(inputMess.trim()===""){return null;}
    await sendMessage({text:inputMess.trim()});
    setInputMess("");
  }

  const handleSendImage=async(e)=>{
    const file=e.target.files[0];
    if(!file||!file.type.startsWith("image/")){
      toast.error('select an image file');
      return;
    }

    const reader=new FileReader();
    reader.onloadend=async()=>{
      await sendMessage({image:reader.result});
      e.target.value="";
    }
    reader.readAsDataURL(file)
  }
  useEffect(()=>{
    if(selectedUser){
      getAllMessages(selectedUser._id)
    }
  },[selectedUser])
  useEffect(()=>{
    if(scrollEnd.current&&messages){
      scrollEnd.current.scrollIntoView({behavior:"smooth"});
    }
  },[messages])
  return selectedUser?(
    <div className='h-full overflow-scroll relative backdrop-blur-lg scrollbar-hide flex flex-col'>
      {/* header */}
      <div className="  flex items-center justify-between  py-3 mx-4 border-b border-stone-500">
<div className='flex items-center gap-3'>
  <img src={selectedUser.profilePic||assets.avatar_icon} alt='profile-icon' className='w-8 rounded-full'/>
    <p className="text-violet-400">
  {selectedUser.fullName}
  <span
    className={`inline-block w-3 h-3 rounded-full ml-2 ${
      Array.isArray(onlineUser) && onlineUser.includes(selectedUser._id.toString())
        ? "bg-green-500"   // online = green
        : "bg-gray-400"    // offline = gray
    }`}
  ></span>
</p>

</div>
        
    
    <img src={assets.help_icon} alt='help_icon' className=' max-w-5 cursor-pointer' onClick={()=>{setSelectedUser(null)}}/>
      </div>
      {/* chat Area */}
    {/* chat section */}
    <div className="flex-1 flex-col overflow-y-scroll p-3 pb-3 scrollbar-hide ">
      {messages.map((msg,index)=>{
        return (<div className={`flex items-end gap-2 justify-end ${msg.senderId!==authUser._id&&'flex-row-reverse'}`} key={index}>
          {msg.image?(<img src={msg.image} alt="assets_image" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>):(<p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId!==authUser._id?'rounded-br-none':'rounded-bl-none'}`}>{msg.text}</p>)}

           <div className='text-center text-xs'>
      <img src={msg.senderId===authUser._id?authUser?.profilePic||assets.avatar_icon:selectedUser?.profilePic||assets.avatar_icon} alt="profile" className='w-7 rounded-full'/>
      <p className='text-gray-500'>{convertMessageTime(msg.createdAt) }</p>
    </div>
        </div>)
      })}

      <div ref={scrollEnd}></div>
      
    </div>

   {/* bottom area */}
    <div className="flex w-[95%] justify-between items-center m-2">
      <div className="flex justify-between items-center flex-1 bg-gray-100/12 px-3 rounded-full m-2">
        <input type="text" placeholder='Send Message' className='flex w-[90%] text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' onChange={(e)=>{setInputMess(e.target.value)}} value={inputMess} onKeyDown={(e)=>e.key==="Enter"?handleSendMessage(e):null}/>
        <input type="file" onChange={handleSendImage} id="image" accept='image/png,image/jpeg' hidden/>
        <label htmlFor="image"><img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' alt='send'/></label>
      </div>
       <img src={assets.send_button} onClick={handleSendMessage} alt='send' className='w-7 cursor-pointer'/>
    </div>
     




    </div>
  ):(<div className='h-full  relative backdrop-blur-lg flex items-center justify-center'>
      {/* header */}
      <div className="flex flex-col items-center justify-center gap-5">
        <img src={assets.logo_icon} alt='logo-icon' className='w-16 rounded-full'></img>
        <p className='text-violet-400 text-xl'>Ping Shot is For You</p>
        <p className='text-violet-200 text-sm text-center'>Connect instantly with friends in a secure, <br/>fun, and reliable chat app offering private, global, fast, and <br/>truly unlimited conversations.</p>
      </div>
        
  
      
    </div>)
}

export default ChatContainer
