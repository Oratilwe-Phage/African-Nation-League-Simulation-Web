import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
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


app.use(
  cors({
    origin: ["https://african-nation-league-simulation-web-1.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use("/api/federations", federationRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/subscribe", subscriberRoutes);
app.use("/api/error", errorHandler);
app.use("/api/admin", adminRoutes);
app.use("/api/players", playerRoutes);

// 404 Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




