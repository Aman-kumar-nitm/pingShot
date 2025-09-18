const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); // create HTTP server
const io = new Server(server); // attach socket.io to server

// Serve static files (frontend HTML/JS)
app.use(express.static("public"));

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for custom events
  socket.on("chat message", (msg) => {
    console.log("Message from client:", msg);

    // Send message back to all clients
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
