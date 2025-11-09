document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#tournamentTable tbody");
  const simulateBtn = document.getElementById("simulateBtn");

  // Detect if running on Render or locally
  const API_BASE = window.location.hostname.includes("render.com")
    ? "https://african-nation-league-simulation-backend.onrender.com/api/tournament"
    : "http://localhost:5000/api/tournament";

  // Load existing tournaments
  async function loadTournaments() {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();

      const tournaments = Array.isArray(data) ? data : data.tournaments || [];

      tableBody.innerHTML = tournaments.length
        ? tournaments
            .map(
              (t) => `
          <tr>
            <td>${t.name}</td>
            <td>${t.year}</td>
            <td>${t.winner?.country || "Pending"}</td>
          </tr>`
            )
            .join("")
        : `<tr><td colspan="3">No tournaments yet.</td></tr>`;
    } catch (err) {
      console.error("Error loading tournaments:", err);
      tableBody.innerHTML = `<tr><td colspan="3">Error loading tournaments</td></tr>`;
    }
  }

  // Simulate next round
  simulateBtn.addEventListener("click", async () => {
    try {
      let res = await fetch(`${API_BASE}/simulate-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Fallback for alternate endpoint name if needed
      if (res.status === 404) {
        res = await fetch(`${API_BASE}/simulate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      }

      if (res.ok) {
        const data = await res.json();
        alert("Next round simulated successfully!");
        await loadTournaments();
      } else {
        const errData = await res.json().catch(() => null);
        const msg =
          (errData && (errData.message || errData.error)) ||
          "Error simulating round.";
        alert("⚠️ " + msg);
      }
    } catch (err) {
      console.error("Error simulating round:", err);
      alert("❌ Failed to connect to server.");
    }
  });

  // Load tournaments on page load
  loadTournaments();
});



