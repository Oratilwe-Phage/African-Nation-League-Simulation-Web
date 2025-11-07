import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Federation" },
  },
  { timestamps: true }
);

export default mongoose.model("Tournament", tournamentSchema);




