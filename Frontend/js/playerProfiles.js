// js/playerProfiles.js
const API_BASE = "http://localhost:5000/api";


// DOM elements
const federationFilter = document.getElementById("federationFilter");
const viewSquadBtn = document.getElementById("viewSquadBtn");
const squadContainer = document.getElementById("squadContainer");
const squadTitle = document.getElementById("squadTitle");
const topPlayersList = document.getElementById("topPlayersList");
const positionFilter = document.getElementById("positionFilter");
const limitInput = document.getElementById("limitInput");

//  Load federations for dropdown
async function loadFederations() {
  try {
    const res = await fetch(`${API_BASE}/federations`);
    const data = await res.json();

    federationFilter.innerHTML = `<option value="">-- Select Country --</option>`;

    data.forEach(fed => {
      const fedName = fed.country || fed.name || "Unknown";
      federationFilter.innerHTML += `<option value="${fed._id}">${fedName}</option>`;
    });
  } catch (err) {
    console.error("Error loading federations:", err);
    federationFilter.innerHTML = `<option value="">(Error loading federations)</option>`;
  }
}

// Load players by federation
async function loadSquad() {
  const federationId = federationFilter.value;
  const selectedText = federationFilter.options[federationFilter.selectedIndex]?.text || "Unknown";

  if (!federationId) {
    Swal.fire("Please select a federation first!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/players?federationId=${federationId}`);
    const players = await res.json();

    if (!Array.isArray(players) || players.length === 0) {
      squadTitle.textContent = `${selectedText} Squad`;
      squadContainer.innerHTML = `<p>No players found for ${selectedText}.</p>`;
      return;
    }

    squadTitle.textContent = `${selectedText} Squad (${players.length})`;
    squadContainer.innerHTML = `
      <div class="squad-grid">
        ${players
          .map(
            p => `
          <div class="player-mini">
            <strong>${p.name}</strong><br>
            <small>${p.position}</small><br>
            ⭐ Rating: ${p.rating || p.ratings?.[p.position] || 0}
          </div>`
          )
          .join("")}
      </div>
    `;
  } catch (err) {
    console.error("Error loading squad:", err);
    Swal.fire("Failed to load squad. Check console for details.");
  }
}

//  Load Top Players (global)
async function loadTopPlayers() {
  const pos = positionFilter.value;
  const limit = limitInput.value || 10;

  try {
    const res = await fetch(`${API_BASE}/players`);
    let players = await res.json();

    // Sort descending by rating (use fallback if nested ratings)
    players = players
      .map(p => ({
        ...p,
        computedRating: p.rating || p.ratings?.[p.position] || 0,
      }))
      .sort((a, b) => b.computedRating - a.computedRating);

    if (pos) players = players.filter(p => p.position === pos);
    players = players.slice(0, limit);

    topPlayersList.innerHTML = players
      .map(
        (p, i) => `
        <div class="player-row">
          <span>${i + 1}. ${p.name} (${p.position})</span>
          <span class="ratings">⭐ ${p.computedRating}</span>
        </div>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading top players:", err);
    topPlayersList.innerHTML = `<p>Error loading top players.</p>`;
  }
}

// Event Listeners
viewSquadBtn.addEventListener("click", loadSquad);
positionFilter.addEventListener("change", loadTopPlayers);
limitInput.addEventListener("input", loadTopPlayers);

// Initialize
loadFederations();
loadTopPlayers();


