const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// CONFIG
dotenv.config();
connectDB();

// INIT APP
const app = express();
const server = http.createServer(app);

// SOCKET.IO
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});

// SOCKET LOGIC
require("./socket/socket")(io);

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ================= ROUTES =================

// AUTH
app.use("/api/auth", require("./routes/authRoutes"));

// USERS (👉 हे तू add करायचं होतं)
app.use("/api/users", require("./routes/userRoutes"));

// REQUEST
app.use("/api/request", require("./routes/requestRoutes"));

// CHAT
app.use("/api/chat", require("./routes/chatRoutes"));

// NOTIFICATION
app.use("/api/notification", require("./routes/notificationRoutes"));

// ==========================================

// DEFAULT ROUTE (test)
app.get("/", (req, res) => {
  res.send("API Running...");
});

// START SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});