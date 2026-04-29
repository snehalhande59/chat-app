const router = require("express").Router();
const Request = require("../models/Request");
const Notification = require("../models/Notification");


// ================= SEND REQUEST =================
router.post("/send", async (req, res) => {
  try {
    const { from, to } = req.body;

    if (from === to) {
      return res.status(400).json({ msg: "Cannot send request to yourself" });
    }

    // duplicate check
    const exists = await Request.findOne({ from, to });
    if (exists) {
      return res.json({ msg: "Request already sent" });
    }

    // create request
    const data = await Request.create({
      from,
      to,
      status: "pending"
    });

    // 🔔 notification
    await Notification.create({
      user: to,
      message: `${from} sent you a request`
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ msg: "Send error" });
  }
});


// ================= GET ALL REQUESTS =================
router.get("/:email", async (req, res) => {
  try {
    const data = await Request.find({
      $or: [
        { to: req.params.email },
        { from: req.params.email }
      ]
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ msg: "Fetch error" });
  }
});


// ================= CHECK ACCEPTED (IMPORTANT 🔥) =================
router.get("/check/:user/:other", async (req, res) => {
  try {
    const { user, other } = req.params;

    const found = await Request.findOne({
      $or: [
        { from: user, to: other, status: "accepted" },
        { from: other, to: user, status: "accepted" }
      ]
    });

    res.json({ accepted: !!found });

  } catch (err) {
    res.status(500).json({ msg: "Check error" });
  }
});


// ================= ACCEPT REQUEST =================
router.post("/accept", async (req, res) => {
  try {
    const { from, to } = req.body;

    await Request.updateOne(
      { from, to },
      { status: "accepted" }
    );

    // 🔔 notification
    await Notification.create({
      user: from,
      message: `${to} accepted your request`
    });

    res.json({ msg: "Accepted" });

  } catch (err) {
    res.status(500).json({ msg: "Accept error" });
  }
});


// ================= REJECT REQUEST =================
router.post("/reject", async (req, res) => {
  try {
    const { from, to } = req.body;

    await Request.deleteOne({ from, to });

    res.json({ msg: "Rejected" });

  } catch (err) {
    res.status(500).json({ msg: "Reject error" });
  }
});


module.exports = router;