const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  from: String,
  to: String,
  status: { type: String, default: "pending" }, // pending/accepted/rejected
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", requestSchema);