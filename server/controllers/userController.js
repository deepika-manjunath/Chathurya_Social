const User = require("../models/User");

exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("events"); // populate timeline if needed

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      memberId: user.memberId,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null, // optional
      qrCode: user.memberId,
      events: user.events // timeline
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};