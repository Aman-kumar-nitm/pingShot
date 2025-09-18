import React from 'react'
import assets, { imagesDummyData } from '../chat-app-assets/assets'
import { useContext } from 'react'
import { ChatContext } from '../shopContext/ChatContext'
import { AuthContext } from '../shopContext/AuthContext'
import { useState } from 'react'
import { useEffect } from 'react'

const RightSidebar = () => {

  const {selectedUser,messages}=useContext(ChatContext);
  const {logout,onlineUser}=useContext(AuthContext)
  // from messages extract the image dummy data
  const [msgImages,setMsgImages]=useState([]);

  useEffect(()=>{
    setMsgImages(messages.filter((msg)=>msg.image).map(msg=>msg.image))
  },[messages])
  return selectedUser&& (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll scrollbar-hide flex flex-col justify-center items-center ${selectedUser?"max-lg:hidden":""}`}>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic||assets.avatar_icon} alt='pic' className='w-20 aspect-[1/1] rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUser.includes(selectedUser._id)&&<p className='w-2 h-2 rounded-full bg-green-500'></p>}{selectedUser.fullName}</h1>
          <p className='mx-auto'>{selectedUser.bio}</p>
      </div>
      <hr className='border-[#ffffff50] my-4'/>

      <div className='flex-1 px-5 text-xs'>
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll scrollbar-hide grid grid-cols-2 gap-4 opacity-80">
      {msgImages.map((url,index)=>{
       return <div className="cursor-pointer rounded" key={index} onClick={()=>{window.open(url)}}>
            <img src={url} alt="" className='h-full rounded-md'/>
        </div>
      
      })}

        </div>



      </div>

      <button className=' transform-translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light rounded-full cursor-pointer px-[3rem] py-2 my-2' onClick={logout}>
        Logout
      </button>
    </div>
  )
}

export default RightSidebar
