document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("federationForm");
  const countrySelect = document.getElementById("country");

  // List of all African countries
  const africanCountries = [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros",
    "Congo (Brazzaville)", "Congo (Kinshasa)", "Djibouti", "Egypt",
    "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia",
    "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho",
    "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania",
    "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria",
    "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone",
    "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo",
    "Tunisia", "Uganda", "Zambia", "Zimbabwe"
  ];

  // Populate country dropdown
  africanCountries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  // Helper function to randomly generate players
  function generatePlayers() {
    const positions = ["GK", "DF", "MD", "AT"];
    const players = [];

    for (let i = 0; i < 23; i++) {
      const pos = positions[Math.floor(Math.random() * positions.length)];
      players.push({
        name: `Player ${i + 1}`,
        position: pos,
        isCaptain: false
      });
    }

    // Randomly assign 1 captain
    const captainIndex = Math.floor(Math.random() * players.length);
    players[captainIndex].isCaptain = true;

    return players;
  }

  // Handle registration form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      country: countrySelect.value,
      representativeName: document.getElementById("repName").value,
      email: document.getElementById("email").value,
      managerName: document.getElementById("managerName").value,
      players: generatePlayers() // Attach generated players here
    };

    try {
      const res = await fetch("https://african-nation-league-simulation-web.onrender.com/api/federations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        showPopup(`Federation registered successfully! Welcome, ${data.federation.country}.`);
        form.reset();
      } else {
        showPopup(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showPopup(" Could not connect to the server.");
    }
  });

  // Helper popup
  function showPopup(message) {
    const popup = document.createElement("div");
    popup.textContent = message;
    popup.className = "popup-message";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 4000);
  }
});


