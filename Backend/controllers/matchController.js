// controllers/matchController.js
import Federation from "../models/Federation.js";
import Match from "../models/Match.js";
import Stat from "../models/Stat.js";
import Subscriber from "../models/Subscriber.js";
import { simulateMatch } from "../utils/matchSimulator.js";
import { generateCommentary } from "../utils/aiCommentary.js";
import { sendEmail } from "../utils/emailService.js";

/**
 * Simulates a match between two federations, saves the result,
 * updates statistics using atomic operations (upsert), and notifies subscribers.
 */
export const simulateMatchController = async (req, res) => {
  try {
    const { homeFederationId, awayFederationId } = req.body;

    // --- 1. Initial Validation ---
    if (!homeFederationId || !awayFederationId) {
      return res.status(400).json({ message: "Both federations must be selected." });
    }

    if (homeFederationId === awayFederationId) {
      return res.status(400).json({ message: "Cannot simulate a match between the same federation." });
    }

    const federationCount = await Federation.countDocuments();
    if (federationCount < 8) {
      return res.status(403).json({
        message: `A tournament can only begin when at least 8 federations are registered. Currently, there are ${federationCount}.`,
      });
    }

    // --- 2. Fetch Federations ---
    const homeFed = await Federation.findById(homeFederationId);
    const awayFed = await Federation.findById(awayFederationId);

    if (!homeFed || !awayFed) {
      return res.status(404).json({ message: "Federation not found." });
    }

    // --- 3. Prevent duplicate matches ---
    const existingMatch = await Match.findOne({
      $or: [
        { homeTeam: homeFed.country, awayTeam: awayFed.country },
        { homeTeam: awayFed.country, awayTeam: homeFed.country },
      ],
    });

    if (existingMatch) {
      return res.status(400).json({
        message: `A match between ${homeFed.country} and ${awayFed.country} has already been simulated.`,
      });
    }

    // --- 4. Simulate Match and Generate Commentary ---
    const matchResult = await simulateMatch(homeFed.country, awayFed.country);
    const commentary = generateCommentary(matchResult);

    console.log("Match Result:", matchResult);

    // --- 5. Save Match Result ---
    const match = await Match.create({
      homeTeam: homeFed.country,
      awayTeam: awayFed.country,
      homeScore: matchResult.homeScore,
      awayScore: matchResult.awayScore,
      winner: matchResult.winner,
      commentary,
      date: Date.now(),
    });

    // --- 6. Update Stats (Upsert + $inc for atomicity) ---
    const homeUpdate = {
      $inc: {
        matchesPlayed: 1,
        goalsFor: matchResult.homeScore,
        goalsAgainst: matchResult.awayScore,
      },
      $setOnInsert: { federation: homeFed.country },
    };

    const awayUpdate = {
      $inc: {
        matchesPlayed: 1,
        goalsFor: matchResult.awayScore,
        goalsAgainst: matchResult.homeScore,
      },
      $setOnInsert: { federation: awayFed.country },
    };

    if (matchResult.homeScore > matchResult.awayScore) {
      homeUpdate.$inc.wins = 1;
      awayUpdate.$inc.losses = 1;
    } else if (matchResult.awayScore > matchResult.homeScore) {
      awayUpdate.$inc.wins = 1;
      homeUpdate.$inc.losses = 1;
    } else {
      homeUpdate.$inc.draws = 1;
      awayUpdate.$inc.draws = 1;
    }

    const [updatedHomeStat, updatedAwayStat] = await Promise.all([
      Stat.findOneAndUpdate(
        { federation: homeFed.country },
        homeUpdate,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ),
      Stat.findOneAndUpdate(
        { federation: awayFed.country },
        awayUpdate,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ),
    ]);

    // --- 7. Notify Subscribers ---
    const subscribers = await Subscriber.find();
    let subscribersNotified = false;

    if (subscribers.length > 0) {
      const emailPromises = subscribers.map((sub) =>
        sendEmail(
          sub.email,
          "African Nations League: Match Result",
          `Match Result: ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}\nWinner: ${match.winner}\n\nCommentary:\n${commentary}`
        )
      );

      try {
        await Promise.all(emailPromises);
        subscribersNotified = true;
      } catch (emailErr) {
        console.error(`Email notification failed: ${emailErr.message}`);
      }
    }

    // --- 8. Final Response ---
    res.status(201).json({
      match,
      updatedStats: { homeStat: updatedHomeStat, awayStat: updatedAwayStat },
      subscribersNotified,
    });

  } catch (err) {
    console.error("Error in simulateMatchController:", err);
    res.status(500).json({ message: "Failed to simulate match.", error: err.message });
  }
};

/**
 * Get all matches (for analytics or admin view)
 */
export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.status(200).json(matches);
  } catch (err) {
    console.error("Error in getAllMatches:", err);
    res.status(500).json({ message: "Failed to fetch matches.", error: err.message });
  }
};













