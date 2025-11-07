// controllers/tournamentController.js
import Tournament from "../models/Tournament.js";
import Federation from "../models/Federation.js";
import Match from "../models/Match.js";

/* -------------------------------------------------------
   Helper: Generate random players & calculate avg rating
------------------------------------------------------- */
const generatePlayers = () => {
  const players = [];
  for (let i = 0; i < 23; i++) {
    players.push({
      name: `Player ${i + 1}`,
      rating: Math.floor(Math.random() * 51) + 50, // 50–100
    });
  }
  const avgRating = Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length);
  return { players, avgRating };
};

/* -------------------------------------------------------
   Helper: Commentary generator
------------------------------------------------------- */
const generateCommentary = (home, away, homeScore, awayScore, winner) => {
  const phrases = [
    `${home} and ${away} went head-to-head in an intense match!`,
    `The crowd erupted as ${winner} secured a crucial victory.`,
    `${home} showed great attacking play, but ${away} held firm in defense.`,
    `It was a thrilling ${homeScore}-${awayScore} encounter with ${winner} taking the win!`,
    `${winner} dominated possession and deservedly advanced to the next round.`,
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

/* -------------------------------------------------------
   Helper: Simulate a single match
------------------------------------------------------- */
const simulateMatch = async (home, away, round) => {
  const homeBias = home.rating > away.rating ? 1 : 0;
  const awayBias = away.rating > home.rating ? 1 : 0;

  const homeScore = Math.floor(Math.random() * 3) + homeBias;
  const awayScore = Math.floor(Math.random() * 3) + awayBias;

  const winner =
    homeScore > awayScore
      ? home
      : awayScore > homeScore
      ? away
      : Math.random() < 0.5
      ? home
      : away;

  const commentary = generateCommentary(home.country, away.country, homeScore, awayScore, winner.country);

  const match = await Match.create({
    homeTeam: home._id,
    awayTeam: away._id,
    homeScore,
    awayScore,
    winner: winner._id,
    round,
    commentary,
  });

  return match;
};

/* -------------------------------------------------------
   Get all tournaments
------------------------------------------------------- */
export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate({
        path: "matches",
        populate: [
          { path: "homeTeam", select: "country" },
          { path: "awayTeam", select: "country" },
          { path: "winner", select: "country" },
        ],
      })
      .populate("winner", "country")
      .sort({ createdAt: -1 });

    res.status(200).json(tournaments);
  } catch (err) {
    console.error("Error in getAllTournaments:", err);
    res.status(500).json({ message: "Failed to fetch tournaments", error: err.message });
  }
};

/* -------------------------------------------------------
   Create new tournament
------------------------------------------------------- */
export const createTournament = async (req, res) => {
  try {
    const { name, year } = req.body;

    if (!name || !year) {
      return res.status(400).json({ message: "Tournament name and year are required." });
    }

    let federations = await Federation.find();
    if (federations.length < 8) {
      return res.status(400).json({
        message: `At least 8 federations required. Found ${federations.length}.`,
      });
    }

    // Generate random players if missing
    for (const fed of federations) {
      if (!fed.players || fed.players.length === 0) {
        const { players, avgRating } = generatePlayers();
        fed.players = players;
        fed.rating = avgRating;
        await fed.save();
      }
    }

    // Select 8 random federations
    const shuffled = federations.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8);

    // Quarterfinals
    const quarterFinals = [];
    for (let i = 0; i < selected.length; i += 2) {
      const match = await simulateMatch(selected[i], selected[i + 1], "Quarter Final");
      quarterFinals.push(match);
    }

    const tournament = await Tournament.create({
      name,
      year,
      matches: quarterFinals,
    });

    const populated = await Tournament.findById(tournament._id)
      .populate({
        path: "matches",
        populate: [
          { path: "homeTeam", select: "country" },
          { path: "awayTeam", select: "country" },
          { path: "winner", select: "country" },
        ],
      });

    res.status(201).json({
      message: "Tournament created successfully! Quarter Finals ready.",
      tournament: populated,
    });
  } catch (err) {
    console.error("Error in createTournament:", err);
    res.status(500).json({ message: "Error starting tournament", error: err.message });
  }
};

/* -------------------------------------------------------
   Simulate next round
------------------------------------------------------- */
export const simulateNextRound = async (req, res) => {
  try {
    const tournament = await Tournament.findOne()
      .sort({ createdAt: -1 })
      .populate({
        path: "matches",
        populate: [
          { path: "homeTeam", select: "country rating" },
          { path: "awayTeam", select: "country rating" },
          { path: "winner", select: "country rating" },
        ],
      });

    if (!tournament) return res.status(404).json({ message: "No active tournament found." });

    const currentRounds = tournament.matches.map((m) => m.round);
    let nextRound;

    if (!currentRounds.includes("Semi Final")) nextRound = "Semi Final";
    else if (!currentRounds.includes("Final")) nextRound = "Final";
    else return res.status(400).json({ message: "Tournament already completed." });

    const prevWinners = tournament.matches
      .filter((m) =>
        nextRound === "Semi Final" ? m.round === "Quarter Final" : m.round === "Semi Final"
      )
      .map((m) => m.winner);

    const federations = await Federation.find({ _id: { $in: prevWinners } });

    const newMatches = [];
    for (let i = 0; i < federations.length; i += 2) {
      const match = await simulateMatch(federations[i], federations[i + 1], nextRound);
      newMatches.push(match);
    }

    if (nextRound === "Final") {
      tournament.winner = newMatches[0].winner;
    }

    tournament.matches.push(...newMatches);
    await tournament.save();

    const updated = await Tournament.findById(tournament._id)
      .populate({
        path: "matches",
        populate: [
          { path: "homeTeam", select: "country" },
          { path: "awayTeam", select: "country" },
          { path: "winner", select: "country" },
        ],
      })
      .populate("winner", "country");

    res.status(200).json({
      message: `${nextRound} simulated successfully.`,
      tournament: updated,
    });
  } catch (err) {
    console.error("Error in simulateNextRound:", err);
    res.status(500).json({ message: "Error simulating next round", error: err.message });
  }
};
















