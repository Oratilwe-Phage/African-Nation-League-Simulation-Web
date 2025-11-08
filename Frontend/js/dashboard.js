// Redirect if not logged in
if (!localStorage.getItem("isAdminLoggedIn")) {
  window.location.href = "adminLogin.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const homeSelect = document.getElementById("homeFederationId");
  const awaySelect = document.getElementById("awayFederationId");
  const simulateBtn = document.getElementById("simulateMatchBtn");
  const matchHistoryTable = document.getElementById("matchHistoryTable").querySelector("tbody");
  const sortSelect = document.getElementById("sortFederations");

  let federations = []; 

  // Populate dropdowns
  function populateFederationDropdowns() {
    homeSelect.innerHTML = `<option value="">Select Home Team</option>`;
    awaySelect.innerHTML = `<option value="">Select Away Team</option>`;

    federations.forEach(fed => {
      homeSelect.innerHTML += `<option value="${fed._id}">${fed.country} (${fed.teamRating || 0})</option>`;
      awaySelect.innerHTML += `<option value="${fed._id}">${fed.country} (${fed.teamRating || 0})</option>`;
    });
  }

  // Sorting Function
  function sortFederations(criteria) {
    if (criteria === "name") {
      federations.sort((a, b) => a.country.localeCompare(b.country));
    } 
    else if (criteria === "rating") {
      federations.sort((a, b) => (b.teamRating || 0) - (a.teamRating || 0));
    } 
    else if (criteria === "position") {
      federations.sort((a, b) => (a.position || 999) - (b.position || 999));
    }

    populateFederationDropdowns();
  }

  // Load Federations
  async function loadFederations() {
    try {
      const res = await fetch("https://african-nation-league-simulation-web.onrender.com/api/federations");
      federations = await res.json(); 

      sortFederations("name");

      // ✅ UPDATED REQUIREMENT: At least 2 federations needed to simulate
      if (federations.length < 2) {
        simulateBtn.disabled = true;
        document.getElementById("simulationNotice").style.display = "block";
        document.getElementById("simulationNotice").textContent =
          "You need at least 2 federations to simulate matches.";
      } else {
        simulateBtn.disabled = false;
        document.getElementById("simulationNotice").style.display = "none";
      }

    } catch (err) {
      console.error("Error loading federations:", err);
    }
  }

  // Sorting Dropdown Listener
  sortSelect.addEventListener("change", (e) => {
    sortFederations(e.target.value);
  });

  // Load Analytics Summary
  async function loadAnalytics() {
    try {
      const fedRes = await fetch("https://african-nation-league-simulation-web.onrender.com/api/federations");
      const feds = await fedRes.json();

      const matchRes = await fetch("https://african-nation-league-simulation-web.onrender.com/api/match");
      const matches = await matchRes.json();

      document.getElementById("totalFederations").textContent = feds.length;
      document.getElementById("totalMatches").textContent = matches.length;

      const avgRating =
        feds.length > 0
          ? (feds.reduce((sum, f) => sum + (f.teamRating || 0), 0) / feds.length).toFixed(1)
          : 0;

      document.getElementById("avgRating").textContent = avgRating;

    } catch (err) {
      console.error("Error loading analytics:", err);
    }
  }

  // Load Match History
  async function loadMatchHistory() {
    try {
      const res = await fetch("https://african-nation-league-simulation-web.onrender.com/api/match");
      const matches = await res.json();

      matchHistoryTable.innerHTML = "";

      if (!matches.length) {
        matchHistoryTable.innerHTML = `<tr><td colspan="5">No matches simulated yet.</td></tr>`;
        return;
      }

      matches.reverse().forEach(match => {
        matchHistoryTable.innerHTML += `
          <tr>
            <td>${new Date(match.date).toLocaleString()}</td>
            <td>${match.homeTeam}</td>
            <td>${match.homeScore} - ${match.awayScore}</td>
            <td>${match.awayTeam}</td>
            <td>${match.winner}</td>
          </tr>
        `;
      });

    } catch (err) {
      console.error("Error loading match history:", err);
    }
  }

// Simulate Match
simulateBtn.addEventListener("click", async () => {
  const homeFederationId = homeSelect.value;
  const awayFederationId = awaySelect.value;

  if (!homeFederationId || !awayFederationId) {
    return Swal.fire("Error", "Please select both federations.", "error");
  }

  if (homeFederationId === awayFederationId) {
    return Swal.fire("Error", "Home and away teams cannot be the same.", "error");
  }

  try {
    const res = await fetch("https://african-nation-league-simulation-web.onrender.com/api/federations/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homeId: homeFederationId, awayId: awayFederationId }),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Match Simulated!",
        html: `
          <p><strong>${data.match.homeTeam}</strong> ${data.match.homeScore} - ${data.match.awayScore} <strong>${data.match.awayTeam}</strong></p>
          <p>Winner: <strong>${data.match.winner}</strong></p>
          <p>Subscribers have been notified.</p>
        `,
      });

      await loadAnalytics();
      await loadMatchHistory();

    } else {
      Swal.fire("Error", data.message || "Simulation failed.", "error");
    }

  } catch (err) {
    console.error("Match error:", err);
    Swal.fire("Server Error", "Unable to simulate match.", "error");
  }
});

  // Initial Page Load
  loadFederations();
  loadAnalytics();
  loadMatchHistory();
});













