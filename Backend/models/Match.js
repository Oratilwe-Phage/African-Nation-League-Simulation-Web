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
    homeScore: {
      type: Number,
      required: true,
    },
    awayScore: {
      type: Number,
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Federation",
      required: true,
    },
    round: {
      type: String,
      default: "Friendly",
    },
    date: {
      type: Date,
      default: Date.now, // ✅ ensures valid date automatically
    },
    commentary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // ✅ also adds createdAt & updatedAt for records
  }
);

const Match = mongoose.model("Match", matchSchema);

export default Match;



