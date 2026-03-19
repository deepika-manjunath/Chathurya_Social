const express = require("express");
const router = express.Router();
const { getDashboardStats,searchMembers,getRecentActivities,getMemberStats } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/recent", authMiddleware, getRecentActivities);
router.get("/stats", authMiddleware, getDashboardStats);
router.get("/search", authMiddleware, searchMembers);
router.get("/member-stats", authMiddleware, getMemberStats);

module.exports = router;