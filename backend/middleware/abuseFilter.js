const badWords = ["abuse", "badword", "fuck"];

module.exports = (req, res, next) => {
  const msg = req.body.message || "";

  if (badWords.some(w => msg.includes(w))) {
    return res.json({ msg: "Abusive message blocked" });
  }

  next();
};