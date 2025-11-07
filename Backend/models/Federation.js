import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
});

const federationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, "Country name is required"],
      unique: true,
      trim: true,
    },
    coach: {
      type: String,
      required: [true, "Coach name is required"],
      trim: true,
    },
    players: [playerSchema],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

const Federation = mongoose.model("Federation", federationSchema);
export default Federation;




