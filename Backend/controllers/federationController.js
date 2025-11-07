import Federation from "../models/Federation.js";
import Match from "../models/Match.js";

/**
 * Generate random players & compute team rating
 */
const generatePlayers = () => {
  const players = [];
  for (let i = 0; i < 11; i++) {
    players.push({
      name: `Player ${i + 1}`,
      rating: Math.floor(Math.random() * 51) + 50, // 50–100
    });
  }
  const avgRating =
    players.reduce((sum, p) => sum + p.rating, 0) / players.length;
  return { players, avgRating };
};

/**
 * Generate simple AI-like match commentary
 */
const generateCommentary = (home, away, homeScore, awayScore, winner) => {
  const phrases = [
    `${home} and ${away} went head-to-head in an exciting match!`,
    `The stadium erupted as ${winner} secured a narrow win.`,
    `${home} played well, but ${away} had the upper hand today.`,
    `A thrilling ${homeScore}-${awayScore} encounter with ${winner} coming out on top!`,
    `${winner} dominated possession and earned a well-deserved victory.`,
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

/**
 * Simulate a match between two federations
 */
const simulateMatch = async (home, away) => {
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

  const commentary = generateCommentary(
    home.country,
    away.country,
    homeScore,
    awayScore,
    winner.country
  );

  const match = await Match.create({
    homeTeam: home._id,
    awayTeam: away._id,
    homeScore,
    awayScore,
    winner: winner._id,
    round: "Friendly",
    commentary,
  });

  return await match.populate(
    "homeTeam awayTeam winner",
    "country rating"
  );
};

/**
 * Get all federations
 */
export const getAllFederations = async (req, res, next) => {
  try {
    const federations = await Federation.find().sort({ country: 1 });
    res.json(federations);
  } catch (err) {
    next(err);
  }
};

/**
 * Register a new federation
 */
export const registerFederation = async (req, res, next) => {
  try {
    const { country, coach } = req.body;
    if (!country || !coach) {
      res.status(400);
      throw new Error("Country and coach name are required.");
    }

    const exists = await Federation.findOne({ country });
    if (exists) {
      res.status(400);
      throw new Error("Federation already registered for this country.");
    }

    const { players, avgRating } = generatePlayers();

    const federation = await Federation.create({
      country,
      coach,
      players,
      rating: avgRating,
    });

    res.status(201).json({
      message: "Federation registered successfully.",
      federation,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ⚔️ Simulate a friendly match between two federations
 */
export const simulateFederationMatch = async (req, res, next) => {
  try {
    const { homeId, awayId } = req.body;

    if (!homeId || !awayId) {
      res.status(400);
      throw new Error("Home and Away federation IDs are required.");
    }
    if (homeId === awayId) {
      res.status(400);
      throw new Error("Home and Away teams must be different.");
    }

    const home = await Federation.findById(homeId);
    const away = await Federation.findById(awayId);

    if (!home || !away) {
      res.status(404);
      throw new Error("One or both federations not found.");
    }

    const match = await simulateMatch(home, away);

    res.json({
      message: "Friendly match simulated successfully.",
      match,
    });
  } catch (err) {
    next(err);
  }
};


















