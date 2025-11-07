// routes/statsRoutes.js
import express from "express";
import { getLeaderboard, getTeamAnalytics } from "../controllers/statsController.js";

const router = express.Router();

// Leaderboard route
router.get("/leaderboard", getLeaderboard);

// Team analytics route (now using controller)
router.get("/team/:teamId", getTeamAnalytics);

export default router;











