// models/Match.js
import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Federation", required: true },
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Federation", required: true },
    homeScore: Number,
    awayScore: Number,
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Federation" },
    round: { type: String, enum: ["Quarter Final", "Semi Final", "Final"], required: true },
    commentary: String,
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);




