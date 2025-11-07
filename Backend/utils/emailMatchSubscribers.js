// utils/emailMatchSubscribers.js

import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "./emailService.js";

/**
 * Send a detailed match update to all subscribers
 * @param {Object} matchResult
 * @param {string} matchResult.homeTeam
 * @param {string} matchResult.awayTeam
 * @param {number} matchResult.homeScore
 * @param {number} matchResult.awayScore
 * @param {string} matchResult.winner
 * @param {Array} homeSquad - Array of player objects { name, position }
 * @param {Array} awaySquad - Array of player objects { name, position }
 */
export const emailAllSubscribers = async (matchResult, homeSquad = [], awaySquad = []) => {
  try {
    const subscribers = await Subscriber.find();

    if (!subscribers.length) {
      console.log("No subscribers found.");
      return;
    }

    const { homeTeam, awayTeam, homeScore, awayScore, winner } = matchResult;

    // Build HTML content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>🏆 African Nations League Match Update</h2>
        <p><strong>${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}</strong></p>
        <p>Winner: <strong>${winner}</strong></p>
        
        <h3>${homeTeam} Squad</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th>Player</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            ${homeSquad.map(p => `<tr><td>${p.name}</td><td>${p.position}</td></tr>`).join('')}
          </tbody>
        </table>

        <h3>${awayTeam} Squad</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th>Player</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            ${awaySquad.map(p => `<tr><td>${p.name}</td><td>${p.position}</td></tr>`).join('')}
          </tbody>
        </table>

        <p style="margin-top: 20px;">Thank you for subscribing to African Nations League updates!</p>
      </div>
    `;

    // Send email to each subscriber
    for (const sub of subscribers) {
      await sendEmail(sub.email, `Match Update: ${homeTeam} vs ${awayTeam}`, htmlContent);
    }

    console.log("✅ All subscribers have been notified with detailed match info.");
  } catch (err) {
    console.error("❌ Failed to email subscribers:", err);
  }
};


