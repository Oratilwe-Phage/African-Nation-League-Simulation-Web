import dotenv from "dotenv";
import mongoose from "mongoose";
import Player from "./models/playerModel.js";
import Federation from "./models/Federation.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();

const positions = ["GK", "DF", "MD", "AT"];

const seedData = async () => {
  try {
    await Player.deleteMany();

    const federations = await Federation.find(); // get all federations
    if (!federations.length) {
      console.error("No federations found — seed Federation first.");
      process.exit(1);
    }

    const players = [];

    for (const fed of federations) {
      for (let i = 1; i <= 23; i++) {
        const pos = positions[Math.floor(Math.random() * positions.length)];
        const rating = Math.floor(Math.random() * 40) + 60;
        players.push({
          name: `${fed.country} Player ${i}`,
          position: pos,
          rating,
          federation: fed._id, 
        });
      }
    }

    await Player.insertMany(players);
    console.log("Players seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding players:", err);
    process.exit(1);
  }
};

seedData();



