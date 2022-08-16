const generateString = () =>
  Buffer.from(Math.floor(Math.random() * 1000000).toString(), 'ascii').toString(
    'base64'
  );

const generatePlayers = () => {
  const players = [];

  for (let i = 2; i < 6; i++) {
    players.push(generateString());
  }

  return players;
};

const someoneHasWon = (players, history) => {
  const sorted = players
    .map((name, id) => ({
      name,
      ...history.reduce(
        (acc, entry) => ({
          points: acc.points + entry[id].points,
          phase: acc.phase + entry[id].phase * 1,
          wins: acc.wins + (entry[id].points === 0) * 1,
        }),
        {
          points: 0,
          phase: 0,
          wins: 0,
        }
      ),
    }))
    .sort((p1, p2) => {
      const diff = p2.phase - p1.phase;
      if (diff !== 0) {
        return diff;
      }
      return p1.points - p2.points;
    });

  return sorted[0].phase >= 10;
};

const generateHistory = players => {
  const history = [];

  do {
    const entry = [];
    
    players.forEach(() =>
      entry.push({
        points: 5 * Math.ceil(Math.random() * 25),
        phase: Math.random() > 0.5,
      })
    );

    history.push(entry);
  } while (!someoneHasWon(players, history));

  return history;
};

const generateGame = () => {
  const players = generatePlayers();

  const history = generateHistory(players);

  return {
    time: new Date().toISOString(),
    players,
    history,
  };
};

const gameCount = 8;
const games = [];

for (let i = 0; i < gameCount; i++) {
  games.push(generateGame());
}

const fs = require('fs');
fs.writeFileSync('games.json', JSON.stringify(games));
