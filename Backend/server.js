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

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FIXED CORS CONFIGURATION (with fallback)
const allowedOrigins = [
  "https://african-nation-league-simulation-web.onrender.com",
  "https://african-nation-league-simulation-web-1.onrender.com",
  "http://localhost:5000",
  "http://localhost:5500",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle all preflight requests
app.options("*", cors());

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/federations", federationRoutes);
app.use("/api/tournament", tournamentRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/subscribe", subscriberRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/players", playerRoutes);

// ✅ Serve static frontend (if any public assets)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Health route
app.get("/", (req, res) => {
  res.send("✅ African Nations League Backend is Running Successfully!");
});

// ✅ Error handler
app.use(errorHandler);

// ✅ Fallback to add missing CORS headers (Render bug workaround)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running successfully on port ${PORT}`)
);










