import React, { useState } from 'react'
import assets from '../chat-app-assets/assets'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../shopContext/AuthContext';

const Login = () => {
  const [currState,setCurrState]=useState("Signup");
  const [Name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  const [bio,setBio]=useState("");
  const [isDataSubmitted,setIsDataSubmitted]=useState(true);

  const {login}=useContext(AuthContext)
  const submitHandler=(e)=>{
    e.preventDefault();
    // verify with backend
    console.log(Name,password,email,bio);
    login(currState==="Signup"?'signup':'login',{fullName:Name,email,password,bio})
    // clear the data
    setName("");
    setPassword("");
    setEmail("");
    setBio("");

  }
  const navigate=useNavigate();
  return (
    
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left container */}
      <img src={assets.logo_big} alt='logo' className='w-[20%]'/>
      {/* right container */}
      <form className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[40%]' onSubmit={(e)=>{submitHandler(e)}}>
    <h2 className='font-medium text-2xl flex justify-between items-center'>{currState}
      <img src={assets.arrow_icon} alt='arrow' className='cursor-pointer w-5' onClick={()=>navigate('/')}/>
    </h2>
      {currState==="Signup"&&<input type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none  ' placeholder='fullName' onChange={(e)=>{setName(e.target.value)}} required value={Name}/>}
      <input type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none  ' onChange={(e)=>{setEmail(e.target.value)}} placeholder='Email' required value={email}/>
      <input type="password" className='p-2 border border-gray-500 rounded-md focus:outline-none  ' onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password' required value={password}/>

      {isDataSubmitted&&currState==='Signup'&&<input type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none  ' onChange={(e)=>{setBio(e.target.value)}} placeholder='Bio' required value={bio}/>}

      {currState==='Signup'?<p className='text-purple-500 font-light cursor-pointer' onClick={()=>{setCurrState("login")}} >Already have account login</p>:<p className='text-purple-500 font-light cursor-pointer'  onClick={()=>{setCurrState("Signup")}}>Sign Up</p>}



<button className=' transform-translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light rounded-full cursor-pointer px-[3rem] py-2 my-2' type='submit'>
        Submit
      </button>
      </form>
      
    </div>
  )
}

export default Login
