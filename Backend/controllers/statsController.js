// controllers/statsController.js
import Stat from "../models/Stat.js";
import Federation from "../models/Federation.js";

/**
 * GET /api/stats/leaderboard
 * Returns federations ranked by points
 */
export const getLeaderboard = async (req, res) => {
  try {
    const stats = await Stat.find();

    const leaderboard = stats
      .map((team) => ({
        federation: team.federation,
        matchesPlayed: team.matchesPlayed,
        wins: team.wins,
        draws: team.draws,
        losses: team.losses,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        points: team.wins * 3 + team.draws,
        goalDifference: team.goalsFor - team.goalsAgainst,
      }))
      .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);

    res.json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

/**
 * GET /api/stats/team/:teamId
 * Returns detailed analytics for a specific federation
 */
export const getTeamAnalytics = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Try finding federation by ID
    let federation = null;
    try {
      federation = await Federation.findById(teamId);
    } catch (e) {
      // If teamId is not a valid ObjectId, ignore the error
    }

    // If not found by ID, try by name (optional flexibility)
    if (!federation) {
      federation = await Federation.findOne({ country: teamId });
    }

    if (!federation) {
      return res.status(404).json({ message: "Federation not found" });
    }

    // Find stats record by federation name
    const stats = await Stat.findOne({ federation: federation.country });
    if (!stats) {
      return res.status(404).json({ message: "No stats found for this federation" });
    }

    const totalMatches = stats.matchesPlayed || 0;
    const wins = stats.wins || 0;
    const draws = stats.draws || 0;
    const losses = stats.losses || 0;
    const winRate = totalMatches
      ? ((wins / totalMatches) * 100).toFixed(2) + "%"
      : "0%";

    res.json({
      country: federation.country,
      matchesPlayed: totalMatches,
      wins,
      draws,
      losses,
      goalsFor: stats.goalsFor,
      goalsAgainst: stats.goalsAgainst,
      goalDifference: stats.goalsFor - stats.goalsAgainst,
      winRate,
    });
  } catch (err) {
    console.error("Error fetching team analytics:", err);
    res.status(500).json({ message: "Error fetching team analytics" });
  }
};






