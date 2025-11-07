// routes/tournamentRoutes.js
import express from "express";
import {
  getAllTournaments,
  createTournament,
  simulateNextRound, 
} from "../controllers/tournamentController.js";

const router = express.Router();

// GET all tournaments
router.get("/", getAllTournaments);

// POST: create tournament
router.post("/", createTournament);

// POST: simulate next round
router.post("/simulate-round", simulateNextRound);

export default router;









