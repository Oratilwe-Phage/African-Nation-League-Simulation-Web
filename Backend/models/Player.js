import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true, enum: ["GK", "DF", "MD", "AT"] },
  ratings: {
    GK: { type: Number, default: 0 },
    DF: { type: Number, default: 0 },
    MD: { type: Number, default: 0 },
    AT: { type: Number, default: 0 },
  },
  federation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Federation",
    required: true,
  },
  isCaptain: { type: Boolean, default: false },
});

export default mongoose.model("Player", playerSchema);



