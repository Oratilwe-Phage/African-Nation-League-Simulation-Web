// Backend/routes/playerRoutes.js
import express from "express";
import {
  getPlayers,
  getTopPlayers,
  getPlayersByFederation,
} from "../controllers/playerController.js";

const router = express.Router();

// GET all players (with optional query filters like ?position=GK&federationId=...)
router.get("/", getPlayers);

// GET top players (used for leaderboard)
router.get("/top", getTopPlayers);

// GET players by federation country name (for your frontend filter)
router.get("/federation/:country", getPlayersByFederation);

export default router;






