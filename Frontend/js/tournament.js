document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#tournamentTable tbody");
  const simulateBtn = document.getElementById("simulateBtn");

  async function loadTournaments() {
    try {
      const res = await fetch("https://african-nation-league-simulation-web.onrender.com/api/tournament");
      const data = await res.json();

      // Accept both raw array or { success: true, tournaments: [...] }
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
      // Try the canonical route first
      let res = await fetch("https://african-nation-league-simulation-web.onrender.com/api/tournament/simulate-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // If route not found (404), try the alias route /simulate
      if (res.status === 404) {
        res = await fetch("https://african-nation-league-simulation-web.onrender.com/api/tournament/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      }

      if (res.ok) {
        // if the simulate endpoint returns JSON with { tournament }, we can optionally show that
        const data = await res.json().catch(() => null);
        alert("Next round simulated!");
        // refresh table list
        await loadTournaments();
      } else {
        // read message if possible
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

