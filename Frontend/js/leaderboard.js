document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#leaderboardTable tbody");
  const lastUpdated = document.getElementById("lastUpdated");

  // Format time nicely
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Function to fetch and display leaderboard
  async function loadLeaderboard() {
    try {
      const res = await fetch("http://localhost:5000/api/stats/leaderboard");
      const leaderboard = await res.json();

      tableBody.innerHTML = "";

      if (!leaderboard.length) {
        tableBody.innerHTML = "<tr><td colspan='10'>No matches played yet.</td></tr>";
        lastUpdated.textContent = `Last updated: ${formatTime(Date.now())}`;
        return;
      }

      leaderboard.forEach((team, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${team.federation}</td>
          <td>${team.matchesPlayed}</td>
          <td>${team.wins}</td>
          <td>${team.draws}</td>
          <td>${team.losses}</td>
          <td>${team.goalsFor}</td>
          <td>${team.goalsAgainst}</td>
          <td>${team.goalDifference}</td>
          <td><b>${team.points}</b></td>
        `;
        tableBody.appendChild(row);
      });

      // Update last updated timestamp
      lastUpdated.textContent = `Last updated: ${formatTime(Date.now())}`;
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      tableBody.innerHTML = "<tr><td colspan='10'>Error loading leaderboard data.</td></tr>";
    }
  }

  // Load initially
  await loadLeaderboard();

  // Auto-refresh every 10 seconds
  setInterval(loadLeaderboard, 10000);
});


