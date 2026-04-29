const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  user: String,
  blockedUser: String
});

module.exports = mongoose.model("Block", blockSchema);