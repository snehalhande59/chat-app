const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});

require("./socket/socket")(io);

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/request", require("./routes/requestRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

// SAFE DB CONNECT 👇 (important)
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log("🚀 Server running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("DB Error:", err);
  });