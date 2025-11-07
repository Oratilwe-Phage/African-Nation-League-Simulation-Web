import mongoose from "mongoose";
import dotenv from "dotenv";
import Federation from "./models/Federation.js";
import Player from "./models/Player.js";
import Match from "./models/Match.js";
import Tournament from "./models/Tournament.js";
import Stat from "./models/Stat.js";
import { generatePlayerRatings } from "./utils/ratingGenerator.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear old data
    await Federation.deleteMany();
    await Player.deleteMany();
    await Match.deleteMany();
    await Tournament.deleteMany();
    await Stat.deleteMany();

    console.log("🧹 Cleared existing collections");

    const countries = [
      "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
      "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros",
      "Congo", "Democratic Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea",
      "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
      "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya",
      "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco",
      "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe",
      "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa",
      "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
    ];

    const positions = ["GK", "DF", "MD", "AT"];
    const federations = [];

    // Create federations and their players
    for (const country of countries) {
      // Create the federation first
      const federation = await Federation.create({
        country,
        representativeName: `${country} Rep`,
        managerName: `${country} Manager`,
        email: `${country.toLowerCase()}@example.com`,
        teamRating: 0,
      });

      //  Create 23 players referencing this federation
      const players = [];
      for (let i = 0; i < 23; i++) {
        const pos = positions[Math.floor(Math.random() * positions.length)];
        const ratings = generatePlayerRatings(pos);

        const player = await Player.create({
          name: `${country} Player ${i + 1}`,
          position: pos,
          ratings,
          isCaptain: i === 0,
          federation: federation._id, // link to federation
        });

        players.push(player._id);
      }

      //  Compute and update team rating
      const playerDocs = await Player.find({ _id: { $in: players } });
      const teamRating =
        playerDocs.reduce((sum, p) => sum + p.ratings[p.position], 0) /
        playerDocs.length;

      federation.squad = players;
      federation.teamRating = Math.round(teamRating);
      await federation.save();

      federations.push(federation);
    }

    console.log(`✅ Created ${federations.length} federations with players`);

    // Initialize stats for each federation
    for (const federation of federations) {
      await Stat.create({
        federation: federation.country,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      });
    }

    console.log("📊 Team stats initialized");

    // Create example tournament and matches
    const shuffled = federations.sort(() => 0.5 - Math.random());
    const matches = [];

    for (let i = 0; i < 8; i += 2) {
      const match = await Match.create({
        homeTeam: shuffled[i].country,
        awayTeam: shuffled[i + 1].country,
        homeScore: null,
        awayScore: null,
        played: false,
        stage: "Quarter Finals",
      });
      matches.push(match);
    }

    await Tournament.create({
      name: "African Nations League",
      year: 2025,
      stage: "Quarter Finals",
      teams: federations.map((f) => f.country),
      matches: matches.map((m) => m._id),
    });

    console.log("🏆 Tournament and matches created");
    console.log("✅ Dummy data seeded successfully");

    mongoose.connection.close();
  } catch (err) {
  console.error("❌ Error seeding data:", err);
  console.error(err.stack); 
  mongoose.connection.close();
}
};
connectDB().then(seedData);
