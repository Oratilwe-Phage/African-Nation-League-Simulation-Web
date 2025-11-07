// utils/matchSimulator.js
import Stat from "../models/Stat.js";

/**
 * Updates stats in the database after a match.
 */
async function updateTeamStats(teamName, goalsFor, goalsAgainst) {
  let teamStats = await Stat.findOne({ federation: teamName });

  // If team does not have stats yet, create new stats entry
  if (!teamStats) {
    teamStats = new Stat({ federation: teamName });
  }

  teamStats.matchesPlayed += 1;
  teamStats.goalsFor += goalsFor;
  teamStats.goalsAgainst += goalsAgainst;

  // Determine win/loss/draw
  if (goalsFor > goalsAgainst) {
    teamStats.wins += 1;
  } else if (goalsFor < goalsAgainst) {
    teamStats.losses += 1;
  } else {
    teamStats.draws += 1;
  }

  await teamStats.save();
}

/**
 * Simulate a match between two teams and update stats
 * @param {string} homeTeam
 * @param {string} awayTeam
 * @returns {Object} match result + DB stats updated
 */
export const simulateMatch = async (homeTeam, awayTeam) => {
  // Generate random goals (0-5)
  const homeScore = Math.floor(Math.random() * 6);
  const awayScore = Math.floor(Math.random() * 6);

  // Determine match result
  let winner = "Draw";
  if (homeScore > awayScore) winner = homeTeam;
  if (awayScore > homeScore) winner = awayTeam;

  // ✅ Update stats in MongoDB
  await updateTeamStats(homeTeam, homeScore, awayScore);
  await updateTeamStats(awayTeam, awayScore, homeScore);

  return {
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    winner,
    message: "Match simulated and stats updated successfully ✅"
  };
};


