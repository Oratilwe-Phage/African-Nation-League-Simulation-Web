import express from "express";
import {
  registerFederation,
  getAllFederations,
  simulateFederationMatch,
} from "../controllers/federationController.js";

const router = express.Router();

// ✅ Get all federations
router.get("/", getAllFederations);

// ✅ Register a new federation
router.post("/", registerFederation);

// ✅ Simulate a friendly match
router.post("/simulate", simulateFederationMatch);

export default router;








