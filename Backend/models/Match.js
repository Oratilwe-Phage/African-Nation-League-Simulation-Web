import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Federation",
      required: true,
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Federation",
      required: true,
    },
    homeScore: { type: Number, required: true },
    awayScore: { type: Number, required: true },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Federation",
    },
    round: {
      type: String,
      enum: ["Quarter Final", "Semi Final", "Final"],
      required: true,
    },
    commentary: {
      type: String,
      default: "No commentary available.",
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;


