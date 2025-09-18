// socket.js
const { Server } = require("socket.io");

let io;
const userSocketMap = {}; // { userId: socketId }

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected:", userId);

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("user disconnected:", userId);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

// helpers to access io and userSocketMap from anywhere
const getIO = () => io;
const getUserSocketMap = () => userSocketMap;

module.exports = { initSocket, getIO, getUserSocketMap };
