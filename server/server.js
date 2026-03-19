const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const eventRoutes = require("./routes/eventRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // your Vite frontend URL
  credentials: true
}))
app.use(express.json());
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/dashboard", dashboardRoutes);

// connect database
connectDB();

app.get("/", (req, res) => {
  res.send("CSDC");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});