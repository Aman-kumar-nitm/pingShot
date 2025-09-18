import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";


export const ChatContext=createContext();

export const ChatProvider=({children})=>{
    const [messages,setMessages]=useState([]);
    const [users,setUsers]=useState([]);//list of left side users
    const [selectedUser,setSelectedUser]=useState(null);
    const [unseenMessage,setUnseenMessage]=useState({});
    const {socket,axios}=useContext(AuthContext);

    // all users for left sidebar
const getAllUsers=async()=>{
    try {
        const response=await axios.get('/api/messages/users');
        if(response.data.success){
            setUsers(response.data.users);
            setUnseenMessage(response.data.unSeenMessage);
        }else{
            toast.error('unable to fetch user')
        }
        
    } catch (error) {
        toast.error('unable to fetch User list')
    }
}

    // get all messages for selected user
    const getAllMessages=async(userId)=>{
        try {
            const response=await axios.get( `/api/messages/${userId}`);
            if(response.data.success){
                setMessages(response.data.msg)
            }
        } catch (error) {
            toast.error('unable to fetch messages')
        }
    }

    // function to send messages to selected User
    const sendMessage=async(messageData)=>{
try {
    const {data}=await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
if(data.success){
    setMessages((previousMessages)=>[...previousMessages,data.newMessage])
}else{
    toast.error('unable to send message')
}
} catch (error) {
    toast.error('unable to send message')
}
    }

    //to get messages in real time this is for whenever message commit we can see on our app
    const subscribeToMessage=async()=>{
        if(!socket)return;
        socket.on("newMessage",(newMessage)=>{
            if(selectedUser&&newMessage.senderId===selectedUser._id){
                newMessage.seen=true;
                setMessages((previousMessages)=>[...previousMessages,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }else{
                setUnseenMessage((prevUnseenMessage)=>({...prevUnseenMessage,[newMessage.senderId]:prevUnseenMessage[newMessage.senderId]?prevUnseenMessage[newMessage.senderId]+1:1}))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeMessage=async()=>{
        if(socket) socket.off("newMessage")
    }


    useEffect(()=>{
        subscribeToMessage();
        return ()=>unsubscribeMessage();
    },[socket,selectedUser])
    const value={
        messages,users,selectedUser,getAllUsers,getAllMessages,sendMessage,subscribeToMessage,setSelectedUser,unseenMessage,setUnseenMessage,unsubscribeMessage
    };
    return (<ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>)
}