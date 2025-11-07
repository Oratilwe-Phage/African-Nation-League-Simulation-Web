// routes/matchRoutes.js
import express from "express";
import { getAllMatches, simulateMatchController } from "../controllers/matchController.js";

const router = express.Router();

// Get all matches
router.get("/", getAllMatches);

// Simulate a match
router.post("/simulate", simulateMatchController);

export default router;








