const router = require("express").Router();
const Notification = require("../models/Notification");

// ================= GET ALL NOTIFICATIONS =================
router.get("/:user", async (req, res) => {
  try {
    const data = await Notification.find({ user: req.params.user })
      .sort({ _id: -1 }); // latest first

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching notifications" });
  }
});


// ================= MARK AS READ =================
router.post("/read", async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.body.user },
      { read: true }
    );

    res.json({ msg: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating notifications" });
  }
});


module.exports = router;