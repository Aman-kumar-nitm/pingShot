import React from 'react'
import { createContext } from 'react'
import axios  from 'axios'
import { useState } from 'react';
import toast from 'react-hot-toast';
import {io} from "socket.io-client"
import { useEffect } from 'react';
const backendUrl=import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL=backendUrl
export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [token,setToken]=useState(localStorage.getItem('token'));
    const [authUser,setAuthUser]=useState(null);
    const [onlineUser,setOnlineUser]=useState([]);
    const [socket,setSocket]=useState(null)
// check if user is authenticated and if yes then connect the socket
const checkAuth=async()=>{
    try {
       const response =await axios.get('/api/auth/check');
       if(response.data.success===true){
        setAuthUser(response.data.User);
        connectSocket(response.data.User);
       }
    } catch (error) {
        toast.error('you are not logged in')
    }
}
// login function to handle user authentication and socket connection
const login=async(state,credentials)=>{
    try {
       
        const response=await axios.post(`/api/auth/${state}`,credentials);
    
        if(response.data.success){
            setAuthUser(response.data.userData);
            connectSocket(response.data.userData);
            axios.defaults.headers.common['token']=response.data.token;
            localStorage.setItem('token',response.data.token);
            toast.success('Successfull')
        }else{
            toast.error(response.data.msg)
        }
    } catch (error) {
        toast.error('unable to login/signup ')
    }
}

//logout  function
const logout=async()=>{
    localStorage.removeItem('token');
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    axios.defaults.headers.common['token']=null;
    toast.success('Successfully logout');
    socket.disconnect();
}

//update profile function to handle user profile update
const updateProfile=async(body)=>{
try {
    const response=await axios.post('/api/auth/updateProfile',body);
   
   
    if(response.data.success===true){
        setAuthUser(response.data.userData);
        toast.success('profile updated successfully')
    }else{
        toast.error('unable to upload profile1')
    }
} catch (error) {
    toast.error('unable to upload profile2')
}
}
// connect socket function to handle online users
const connectSocket=(userData)=>{
if(!userData||socket?.connected){
return;
}
const newSocket=io(backendUrl,{query:{
    userId:userData._id,
}});
newSocket.connect();
setSocket(newSocket);

newSocket.on("getOnlineUsers",(userIds)=>{setOnlineUser(userIds)})
}
useEffect(()=>{
    if(token){
        axios.defaults.headers.common["token"]=token;
    }
    checkAuth();
},[])
const value={
    axios,token,setToken,authUser,setAuthUser,onlineUser,setOnlineUser,socket,setSocket,
    login,logout,updateProfile,checkAuth
};
return (<AuthContext.Provider value={value}>
    {children}
</AuthContext.Provider>);
}


