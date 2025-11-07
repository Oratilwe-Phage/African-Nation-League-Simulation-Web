// models/Federation.js
import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: String,
  rating: Number,
});

const federationSchema = new mongoose.Schema(
  {
    country: { type: String, required: true, unique: true, trim: true },
    coach: { type: String, required: true },
    rating: { type: Number, default: 70 },
    players: [playerSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Federation", federationSchema);





