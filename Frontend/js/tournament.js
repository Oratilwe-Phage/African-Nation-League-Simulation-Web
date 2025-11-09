document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#tournamentTable tbody");
  const simulateBtn = document.getElementById("simulateBtn");

  // ✅ Use your backend Render service URL here
 const API_BASE = "https://african-nation-league-simulation-web.onrender.com/api/tournament";

  async function loadTournaments() {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();

      const tournaments = Array.isArray(data) ? data : data.tournaments || [];

      tableBody.innerHTML = tournaments
        .map(
          (t) => `
        <tr>
          <td>${t.name}</td>
          <td>${t.year}</td>
          <td>${t.winner?.country || "Pending"}</td>
        </tr>`
        )
        .join("");
    } catch (err) {
      console.error("Error loading tournaments:", err);
      tableBody.innerHTML = `<tr><td colspan="3">Error loading tournaments</td></tr>`;
    }
  }

  simulateBtn.addEventListener("click", async () => {
    try {
      let res = await fetch(`${API_BASE}/simulate-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 404) {
        res = await fetch(`${API_BASE}/simulate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      }

      if (res.ok) {
        const data = await res.json().catch(() => null);
        alert("Next round simulated!");
        await loadTournaments();
      } else {
        const errData = await res.json().catch(() => null);
        const msg = (errData && (errData.message || (errData.success === false && errData.message))) || "Error simulating round.";
        alert(msg);
      }
    } catch (err) {
      console.error("Error simulating round:", err);
      alert("Error simulating round.");
    }
  });

  loadTournaments();
});


