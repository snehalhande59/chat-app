const router = require("express").Router();
const User = require("../models/User");
const Block = require("../models/Block");


// ================== GET ALL USERS ==================
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users" });
  }
});


// ================== BLOCK USER ==================
router.post("/block", async (req, res) => {
  try {
    const { user, blockedUser } = req.body;

    const exists = await Block.findOne({ user, blockedUser });
    if (exists) {
      return res.json({ msg: "Already blocked" });
    }

    await Block.create({ user, blockedUser });

    res.json({ msg: "User blocked successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Block error" });
  }
});


// ================== UNBLOCK USER ==================
router.post("/unblock", async (req, res) => {
  try {
    const { user, blockedUser } = req.body;

    await Block.deleteOne({ user, blockedUser });

    res.json({ msg: "User unblocked" });
  } catch (err) {
    res.status(500).json({ msg: "Unblock error" });
  }
});


// ================== UPDATE LAST SEEN ==================
router.post("/lastseen", async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ msg: "Email required" });
    }

    await User.updateOne(
      { email: req.body.email },
      { lastSeen: new Date() }
    );

    res.json({ msg: "Last seen updated" });
  } catch (err) {
    res.status(500).json({ msg: "Last seen error" });
  }
});


// ================== DELETE USER ==================
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // delete user
    await User.findByIdAndDelete(userId);

    // optional: cleanup blocks
    await Block.deleteMany({
      $or: [
        { user: userId },
        { blockedUser: userId }
      ]
    });

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Delete error" });
  }
});


module.exports = router;