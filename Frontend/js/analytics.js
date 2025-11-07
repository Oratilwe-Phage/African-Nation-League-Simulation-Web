const API_BASE = "https://african-nation-league-simulation-web.onrender.com/api";
const teamSelect = document.getElementById("teamSelect");
const analyticsContainer = document.getElementById("analyticsContainer");
const chartCanvas = document.getElementById("analyticsChart");
let analyticsChart;

// Load all teams into dropdown
async function loadTeams() {
  try {
    const res = await fetch(`${API_BASE}/federations`);
    if (!res.ok) throw new Error("Failed to fetch federations");
    const data = await res.json();

    teamSelect.innerHTML = `<option value="">-- Select a Federation --</option>`;
    data.forEach(fed => {
      teamSelect.innerHTML += `<option value="${fed._id}">${fed.country}</option>`;
    });
  } catch (err) {
    console.error("Error loading federations:", err);
    Swal.fire({
      icon: "error",
      title: "Error Loading Teams",
      text: "Unable to load the list of federations. Please try again later.",
    });
    teamSelect.innerHTML = `<option value="">(Error loading federations)</option>`;
  }
}

// Fetch and display analytics for a selected team
async function loadAnalytics(teamId) {
  try {
    Swal.fire({
      title: "Loading Analytics...",
      text: "Fetching team performance data...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const res = await fetch(`${API_BASE}/stats/team/${teamId}`);
    const data = await res.json();
    Swal.close();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch analytics data");
    }

    // Display team analytics
    analyticsContainer.innerHTML = `
      <h2>${data.country} - Performance Overview</h2>
      <p><strong>Matches Played:</strong> ${data.matchesPlayed}</p>
      <p><strong>Wins:</strong> ${data.wins}</p>
      <p><strong>Draws:</strong> ${data.draws}</p>
      <p><strong>Losses:</strong> ${data.losses}</p>
      <p><strong>Win Rate:</strong> ${data.winRate}</p>
    `;

    // Chart.js Visualization
    if (analyticsChart) analyticsChart.destroy();
    analyticsChart = new Chart(chartCanvas, {
      type: "bar",
      data: {
        labels: ["Wins", "Draws", "Losses"],
        datasets: [{
          label: `${data.country} Performance`,
          data: [data.wins, data.draws, data.losses],
          backgroundColor: ["#27ae60", "#f1c40f", "#e74c3c"],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      },
    });
  } catch (err) {
    console.error("Error loading analytics:", err);
    Swal.fire({
      icon: "error",
      title: "Analytics Error",
      text: err.message || "Could not load analytics data. Please try again later.",
    });
    analyticsContainer.innerHTML = `<p>Error loading analytics data.</p>`;
  }
}

// Event listener for dropdown change
teamSelect.addEventListener("change", (e) => {
  const teamId = e.target.value;
  if (teamId) loadAnalytics(teamId);
});

// Auto-load a team if ?teamId= is in URL
const urlTeamId = new URLSearchParams(window.location.search).get("teamId");
if (urlTeamId) {
  loadTeams().then(() => {
    teamSelect.value = urlTeamId;
    loadAnalytics(urlTeamId);
  });
} else {
  loadTeams();
}


