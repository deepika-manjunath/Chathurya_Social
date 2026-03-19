const express = require("express")
const router = express.Router()

const { createEvent,markAttendance } = require("../controllers/eventController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/create", authMiddleware, createEvent)
router.post("/attendance", authMiddleware, markAttendance)

module.exports = router