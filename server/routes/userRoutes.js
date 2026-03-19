const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")
const { getUserByUsername } = require("../controllers/userController")

router.get("/:username", authMiddleware, getUserByUsername)

module.exports = router