import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import federationRoutes from "./routes/federationRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ For ES Modules (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "https://african-nation-league-simulation-web.onrender.com",
      "https://african-nation-league-simulation-web-1.onrender.com",
      "http://localhost:5000",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use("/api/federations", federationRoutes);
app.use("/api/tournament", tournamentRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/subscribe", subscriberRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/players", playerRoutes);

// ✅ Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Express 5-compatible fallback route (regex-based)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Global error handling
app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));







