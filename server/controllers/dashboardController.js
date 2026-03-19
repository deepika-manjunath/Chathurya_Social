const User = require("../models/User");
const Event = require("../models/Event");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();

    const events = await Event.find();

    let totalAttendance = 0;

    events.forEach(event => {
      totalAttendance += event.attendees.length;
    });
    res.json({
      totalMembers,
      totalEvents,
      totalAttendance
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/dashboardController.js
exports.getMemberStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean(); // <--- fixed
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalAttendance = Array.isArray(user.events) ? user.events.length : 0;
    const totalEvents = await Event.countDocuments();
    const totalMembers = await User.countDocuments();

    res.json({ totalMembers, totalEvents, totalAttendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchMembers = async (req, res) => {
  try {

    const query = req.query.q;

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { memberId: { $regex: query, $options: "i" } }
      ]
    }).select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    // Fetch the 10 most recent events sorted by date descending
    const events = await Event.find()
      .sort({ date: -1 })
      .limit(10)
      .populate("attendees", "memberId username name"); // populate attendees with basic info

    // Format: { eventId, title, date, attendees }
    const activities = events.map(event => ({
      eventId: event.eventId,
      title: event.title,
      date: event.date,
      attendees: event.attendees
    }));

    res.json(activities);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

