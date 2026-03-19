const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({

  eventId: {
    type: String,
    required: true,
    unique: true
  },

  title: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

}, { timestamps: true })

module.exports = mongoose.model("Event", eventSchema)