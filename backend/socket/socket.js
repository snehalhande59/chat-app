const Message = require("../models/Message");

let users = {}; // store socket ids

module.exports = (io) => {
  io.on("connection", (socket) => {

    // register user
    socket.on("register", (email) => {
      users[email] = socket.id;
    });

    // send message
    socket.on("send_message", async (data) => {
      const { from, to, message } = data;

      // save in DB
      const msg = await Message.create({ from, to, message });

      // send to receiver only
      const receiverSocket = users[to];

      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", msg);
      }

      // also send back to sender
      socket.emit("receive_message", msg);
    });

  });
};