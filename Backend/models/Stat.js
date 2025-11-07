import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  federation: { type: String, required: true }, 
  matchesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
}, { timestamps: true });

const Stat = mongoose.model("Stat", statSchema);
export default Stat;



