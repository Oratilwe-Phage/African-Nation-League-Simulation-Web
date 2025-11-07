import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: String,
  year: Number,
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Federation" },
});
const Tournament = mongoose.model("Tournament", tournamentSchema);
export default Tournament;


