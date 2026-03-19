const User = require("../models/User")
const bcrypt = require("bcryptjs")

exports.register = async (req, res) => {
  try {

    const { username, name, email, password } = req.body

    // check if user exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // generate memberId
    const userCount = await User.countDocuments()

    const memberNumber = String(userCount + 1).padStart(3, "0")

    const memberId = `CSDC${memberNumber}`

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      memberId,
      username,
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({
      message: "User registered successfully",
      memberId: user.memberId
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const jwt = require("jsonwebtoken")

exports.login = async (req, res) => {
  try {

    const { username, password } = req.body

    // find user by username
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, memberId: user.memberId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        memberId: user.memberId,
        username: user.username,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}