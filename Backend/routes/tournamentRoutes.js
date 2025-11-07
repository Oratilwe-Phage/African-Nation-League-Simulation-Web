import express from "express";
import {
  createTournament,
  getAllTournaments,
  simulateNextRound,
} from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/", getAllTournaments);
router.post("/create", createTournament);
router.post("/simulate-round", simulateNextRound);

export default router;









