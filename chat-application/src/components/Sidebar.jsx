import React from 'react'
import assets, { userDummyData } from '../chat-app-assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../shopContext/AuthContext';
import { ChatContext } from '../shopContext/ChatContext';
import { useEffect } from 'react';
import { useState } from 'react';


const Sidebar = () => {
    const navigate=useNavigate();
    const {logout,onlineUser}=useContext(AuthContext);
    const {selectedUser,setSelectedUser,getAllUsers,users,unseenMessage,setUnseenMessage}=useContext(ChatContext)
    const [inputText,setInputText]=useState('')
   

    // filter the user based on search bar
    const filterData=inputText?users.filter((user)=>user.fullName.toLowerCase().includes(inputText.toLowerCase())) :users;

    useEffect(()=>{
       getAllUsers();
    },[onlineUser])
  return (
    <div className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl  text-white ${selectedUser?"max-md:hidden":""}`}>
        <div className="pb-5">
             <div className="flex justify-between items-center ">
            <img src={assets.logo} alt='logo' className='max-w-40'/>
            <div className="relative py-2 group">
                 <img src={assets.menu_icon} alt='menu_icon' className='max-h-5 cursor-pointer'/>
        <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
        <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'> Profile</p>
        <hr className='my-2 border-t border-gray-500'/>
        <p className='cursor-pointer text-sm' onClick={()=>logout()}>Logout</p>
            </div>
            
    </div>
            </div>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 m-2 py-2 px-5">
            <img src={assets.search_icon} alt='Search' className='w-3' />
            <input onChange={(e)=>setInputText(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='search User...' />
        </div>
    </div>

    <div className='flex flex-col'>
        {filterData.map((user,index)=>(
            <div key={index} onClick={()=>{setSelectedUser(user);setUnseenMessage(prev=>({...prev,[user._id]:0}))}} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id===user._id&&'bg-[#282142]/50'}`}>
                <img src={user?.profilePic||assets.avatar_icon} alt="profile_pic" className='w-[35px] aspect-square rounded-full'></img>
                <div className='flex flex-col leading-5'>
                <p className=' text-white font-medium'>{user.fullName}</p>
               {
                onlineUser.includes(user._id)?<span className='text-green-400 text-xs'>Online</span>:<span className='text-orange-400 text-xs'>Offline</span>}
                </div>

                {unseenMessage[user._id]>0&&<p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessage[user._id]}</p>}
                
            </div>
        )
        
        )}
    </div>
    </div>
 

    
  )
}

export default Sidebar
