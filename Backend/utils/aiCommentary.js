// utils/aiCommentary.js

/**
 * Generate a commentary string for a simulated match
 * @param {Object} matchResult
 * @param {string} matchResult.homeTeam
 * @param {string} matchResult.awayTeam
 * @param {number} matchResult.homeScore
 * @param {number} matchResult.awayScore
 * @param {string} matchResult.winner
 * @returns {string}
 */
export const generateCommentary = (matchResult) => {
  const { homeTeam, awayTeam, homeScore, awayScore, winner } = matchResult;

  let commentary = `⚽ The match between ${homeTeam} and ${awayTeam} ended `;
  commentary += `${homeScore} - ${awayScore}. `;

  if (winner === "Draw") {
    commentary += "It was a thrilling draw!";
  } else {
    commentary += `${winner} emerged victorious!`;
  }

  return commentary;
};




