const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  // 🔥 ADD THIS
  role: {
    type: String,
    default: "user" // normal users
  }
});

module.exports = mongoose.model("User", userSchema);