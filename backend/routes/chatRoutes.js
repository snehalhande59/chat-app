const router = require("express").Router();
const Message = require("../models/Message");
const Request = require("../models/Request");
const Block = require("../models/Block");

// ================= SEND MESSAGE =================
router.post("/send", async (req, res) => {
  try {
    const { from, to, message } = req.body;

    // ❌ BLOCK CHECK
    const blocked = await Block.findOne({
      $or: [
        { user: from, blockedUser: to },
        { user: to, blockedUser: from }
      ]
    });

    if (blocked) {
      return res.json({ msg: "User is blocked. Chat not allowed." });
    }

    // 🔥 ABUSE CHECK (SERVER SIDE)
    const badWords = ["fuck", "abuse", "badword"];

    if (badWords.some(w => message.toLowerCase().includes(w))) {

      // 👉 AUTO BLOCK USER
      await Block.create({
        user: from,
        blockedUser: to
      });

      return res.json({
        msg: "Abusive message! You are blocked."
      });
    }

    // ✅ SAVE MESSAGE
    const msg = await Message.create({ from, to, message });

    res.json(msg);

  } catch (err) {
    res.status(500).json({ msg: "Chat error" });
  }
});


// ================= GET CHAT =================
router.get("/:u1/:u2", async (req, res) => {
  try {
    const msgs = await Message.find({
      $or: [
        { from: req.params.u1, to: req.params.u2 },
        { from: req.params.u2, to: req.params.u1 }
      ]
    });

    res.json(msgs);

  } catch (err) {
    res.status(500).json({ msg: "Fetch error" });
  }
});


module.exports = router;