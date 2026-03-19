const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: true,
      unique: true
    },

    username: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    events: [
      {
        name: String,
        date: Date
      }
    ]

  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)