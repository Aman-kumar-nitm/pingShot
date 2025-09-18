// const express = require("express");
// require("dotenv").config();
// const cors = require("cors");
// const http = require("http");
// const {Server}=require('socket.io')
// const connectDB = require("./db/connect");
// // create http server and express app
// const app=express();
// const server=http.createServer(app);

// // initialize socket.io server
// const io=new Server(server,{
//     cors:{origin:"*"}
// });

// // store online Users
// const userSocketMap={};//{userId:socketId}
// // socket.io connection handler
// io.on("connection",(socket)=>{
// const userId=socket.handshake.query.userId;
// console.log("user Connected",userId);

// if(userId){
// userSocketMap[userId]=socket.id;
// }

// // emit online users to all connected client
// // broadcasting
// io.emit("getOnlineUsers",Object.keys(userSocketMap));

// socket.on('disconnect',()=>{console.log('user disconnected',userId)});
// delete userSocketMap[userId];
// io.emit('getOnlineUsers',Object.keys(userSocketMap));
// })

// //middleware setup
// app.use(express.json({limit:"4mb"}));//so that maximum image size that we can upload is 4mb

// app.use(cors());
// app.use('/api/status',(req,res)=>res.send('server is live'));

// const port=process.env.PORT||5000;

// // routes
// const userRouter=require('./routes/userRoute');
// const messageRouter=require('./routes/messageRoute')
// app.use("/api/auth",userRouter);
// app.use("/api/messages",messageRouter);
// const start=async()=>{
//     try {
//         await connectDB(process.env.MONGO_URI);
//         // await connectCloudinary();
//         server.listen(port,()=>{
//         console.log(`server is listening on port ${port}`)
//         });
//     } catch (error) {
//         console.log('unable to connectDB')
//     }
// }

// start();

// module.exports={io,userSocketMap}

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const connectDB = require("./db/connect");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

// initialize socket.io
initSocket(server);

// middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.use('/api/status', (req, res) => res.send('server is live'));

const port = process.env.PORT || 5000;

// routes
const userRouter = require('./routes/userRoute');
const messageRouter = require('./routes/messageRoute');
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  } catch (error) {
    console.log('unable to connectDB');
  }
};

start();
