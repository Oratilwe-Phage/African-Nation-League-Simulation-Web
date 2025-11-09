// routes/tournamentRoutes.js
import express from "express";
import {
  getAllTournaments,
  createTournament,
  simulateNextRound,
} from "../controllers/tournamentController.js";

const router = express.Router();

// ✅ Get all tournaments
router.get("/", getAllTournaments);

// ✅ Create a new tournament
router.post("/create", createTournament);

// ✅ Simulate the next round
router.post("/simulate-round", simulateNextRound);

export default router;













