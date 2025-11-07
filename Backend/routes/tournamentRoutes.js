// routes/tournamentRoutes.js
import express from "express";
import {
  getAllTournaments,
  createTournament,
  simulateNextRound,
} from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/", getAllTournaments);
router.post("/", createTournament);
router.post("/simulate-round", simulateNextRound);

export default router;











