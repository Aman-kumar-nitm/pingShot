import React, { useState } from 'react'
import assets from '../chat-app-assets/assets'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../shopContext/AuthContext';

const Profile = () => {
  const {authUser,updateProfile}=useContext(AuthContext);
  const [Name,setName]=useState(authUser.fullName);
  
  
  const [bio,setBio]=useState(authUser.bio);

  const [selectedImage,setSelectedImage]=useState(authUser.profilePic)
  
  

  const submitHandler=async(e)=>{
    e.preventDefault();
    // update the profile pic
    if(!selectedImage){
      await updateProfile({fullName:Name,bio});
       navigate('/')
       return;
    }
// if image is selected
const reader=new FileReader();
reader.readAsDataURL(selectedImage);
reader.onload=async()=>{
  const base64Image=reader.result;
  await updateProfile({fullName:Name,bio,profilePic:base64Image});
  navigate('/');
  
}
   
   


  }
  const navigate=useNavigate();
  return (
    
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
    
   {/* left container */}
      <form className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[40%]' onSubmit={(e)=>{submitHandler(e)}}>
    <h2 className='font-medium text-2xl '>Profile details
    </h2>

    <div className=" flex items-center">
      <input type="file"  id="profile" className='hidden' accept='.png, .jpeg, .jpg' onChange={(e)=>{setSelectedImage(e.target.files[0])}} />
      <label htmlFor="profile">
    {/* <img src={selectedImage?URL.createObjectURL(selectedImage):assets.avatar_icon} alt='arrow' className='cursor-pointer w-12 rounded-full' /> */}
      <img src={selectedImage?selectedImage:assets.avatar_icon} alt='arrow' className='cursor-pointer w-12 rounded-full' />
      </label>
      
      <p className='text-purple-400 mx-4 '>Upload Profile Pic</p>
    </div>
      <input type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none  ' placeholder='fullName' onChange={(e)=>{setName(e.target.value)}} required value={Name}/>
      

      <input type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none  ' onChange={(e)=>{setBio(e.target.value)}} placeholder='Bio' required value={bio}/>

      



<button className=' transform-translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light rounded-full cursor-pointer px-[3rem] py-2 my-2' type='submit'>
        Save
      </button>
      </form>
      
        {/* right container */}
      <img src={assets.logo_big} alt='logo' className='w-[20%]'/>
    </div>
  )
}

export default Profile
