export function generatePlayerRatings(position) {
  const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const positions = ["GK", "DF", "MD", "AT"];
  const ratings = {};

  positions.forEach((p) => {
    if (p === position) {
      // Natural position → 50–100 inclusive
      ratings[p] = randomBetween(50, 100);
    } else {
      // Non-natural positions → 0–50 inclusive
      ratings[p] = randomBetween(0, 50);
    }
  });

  return ratings;
}



