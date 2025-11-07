import express from "express";
import { subscribe } from "../controllers/subscriberController.js";

const router = express.Router();

// POST /api/subscribe
router.post("/", subscribe);

export default router;



