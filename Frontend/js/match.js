document.addEventListener("DOMContentLoaded", async () => {
  const team1Select = document.getElementById("team1");
  const team2Select = document.getElementById("team2");
  const simulateBtn = document.getElementById("simulateBtn");

  // ✅ Create "Recent Match Results" section
  const resultsContainer = document.createElement("div");
  resultsContainer.id = "resultsContainer";
  resultsContainer.style.marginTop = "20px";
  resultsContainer.innerHTML = "<h2>Recent Match Results</h2><div id='resultsList'></div>";
  document.querySelector(".tournament-container").appendChild(resultsContainer);

  // ✅ Load Federations
  try {
    const res = await fetch("http://localhost:5000/api/federations");
    const federations = await res.json();

    federations.forEach((fed) => {
      const opt1 = new Option(fed.country, fed._id);
      const opt2 = new Option(fed.country, fed._id);
      team1Select.add(opt1);
      team2Select.add(opt2);
    });
  } catch (err) {
    console.error("Failed to load federations:", err);
    Swal.fire("Error", "Failed to load teams.", "error");
  }

  // ✅ Simulate Match
  simulateBtn.addEventListener("click", async () => {
    const homeFederationId = team1Select.value;
    const awayFederationId = team2Select.value;

    if (!homeFederationId || !awayFederationId || homeFederationId === awayFederationId) {
      Swal.fire("Error", "Please select two different teams.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/match/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeFederationId, awayFederationId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Match simulation failed.");

      // ✅ Show success message
      Swal.fire({
        icon: "success",
        title: "Match Simulated!",
        html: `
          <b>${data.match.homeTeam}</b> ${data.match.homeScore} - ${data.match.awayScore} <b>${data.match.awayTeam}</b><br>
          <p>Winner: <strong>${data.match.winner}</strong></p>
        `,
      });

      // ✅ Add new match to the live results
      const resultItem = document.createElement("div");
      resultItem.classList.add("match-result");
      resultItem.style.margin = "10px 0";
      resultItem.style.padding = "10px";
      resultItem.style.border = "1px solid #ccc";
      resultItem.style.borderRadius = "8px";
      resultItem.style.backgroundColor = "#f9f9f9";
      resultItem.innerHTML = `
        <p><b>${data.match.homeTeam}</b> ${data.match.homeScore} - ${data.match.awayScore} <b>${data.match.awayTeam}</b></p>
        <p>Winner: <strong>${data.match.winner}</strong></p>
        <small>${new Date(data.match.date).toLocaleString()}</small>
      `;
      document.getElementById("resultsList").prepend(resultItem);

      // ✅ Try to update leaderboard automatically if open
      if (window.opener && !window.opener.closed) {
        try {
          const leaderboardWindow = window.opener;
          leaderboardWindow.location.reload();
        } catch (err) {
          console.warn("Could not refresh leaderboard window:", err);
        }
      } else {
        // If leaderboard is in another tab, show a reminder
        console.log("Leaderboard not open — please refresh leaderboard.html to see updated standings.");
      }
    } catch (err) {
      console.error("Simulation error:", err);
      Swal.fire("Error", "Failed to simulate match.", "error");
    }
  });
});




