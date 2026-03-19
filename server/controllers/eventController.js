const Event = require("../models/Event")

exports.createEvent = async (req, res) => {
  try {

    const { title, date } = req.body

    const count = await Event.countDocuments()

    const eventId = "EVT" + String(count + 1).padStart(3, "0")

    const event = new Event({
      eventId,
      title,
      date
    })

    await event.save()

    res.status(201).json(event)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.markAttendance = async (req, res) => {
  try {

    const { eventId, memberId } = req.body

    const Event = require("../models/Event")
    const User = require("../models/User")

    const event = await Event.findOne({ eventId })
    const user = await User.findOne({ memberId })

    if (!event || !user) {
      return res.status(404).json({ message: "User or Event not found" })
    }

    if (event.attendees.includes(user._id)) {
      return res.status(400).json({ message: "Attendance already marked" })
    }

    event.attendees.push(user._id)
    await event.save()

    user.events.push({
      name: event.title,
      date: event.date
    })

    await user.save()

    res.json({
      message: "Attendance marked",
      member: {
        memberId: user.memberId,
        name: user.name,
        username: user.username
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}