import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../shopContext/ChatContext'

const Home = () => {
  const {selectedUser}=useContext(ChatContext)
  return (
    <div className='h-screen w-full border sm:px-[15%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border-2  border-gray-600 rounded-2xl overflow-hidden grid grid-cols-1 relative h-[100%] ${selectedUser?'md:grid-cols-[0.5fr_1.5fr] lg:grid-cols-[0.5fr_2fr_1.8fr]':'md:grid-cols-2'} text-white`}>
        <Sidebar />
        <ChatContainer />
        {selectedUser&&<RightSidebar />}
      </div>
    </div>
  )
}

export default Home
