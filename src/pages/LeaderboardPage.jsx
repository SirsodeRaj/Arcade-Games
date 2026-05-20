// src/pages/LeaderboardPage.jsx
const MOCK_DATA = [
  { rank: 1, name: "PlayerOne", score: 9420, game: "Memory Match",         icon: "🥇" },
  { rank: 2, name: "NeonKnight", score: 8100, game: "Tic Tac Toe",         icon: "🥈" },
  { rank: 3, name: "PixelGod",   score: 7750, game: "Dice Roll",           icon: "🥉" },
  { rank: 4, name: "Glitch404",  score: 6300, game: "Guess Number",        icon: "🎮" },
  { rank: 5, name: "CyberFox",   score: 5980, game: "Rock Paper Scissors", icon: "🎮" },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-1">LEADERBOARD</h2>
        <p className="text-gray-500 font-mono text-sm">Top scores across all games</p>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(10,10,20,0.7)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-4 px-6 py-3 border-b text-xs font-mono text-gray-500 uppercase"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span>RANK</span>
          <span>PLAYER</span>
          <span className="hidden sm:block">GAME</span>
          <span className="text-right">SCORE</span>
        </div>

        {MOCK_DATA.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-4 px-6 py-4 items-center border-b transition-colors hover-white-3"
            style={{
              borderColor:
                i === MOCK_DATA.length - 1 ? "transparent" : "rgba(255,255,255,0.04)",
            }}
          >
            <span className="text-xl">{row.icon}</span>
            <span className={`font-bold ${i < 3 ? "text-yellow-400" : "text-white"}`}>
              {row.name}
            </span>
            <span className="hidden sm:block text-gray-500 font-mono text-sm">{row.game}</span>
            <span
              className="text-right font-black font-mono"
              style={{
                color:
                  i === 0
                    ? "#ffe66d"
                    : i === 1
                    ? "#c0c0c0"
                    : i === 2
                    ? "#cd7f32"
                    : "rgba(255,255,255,0.5)",
              }}
            >
              {row.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center text-gray-600 text-xs font-mono py-4">
        🚧 Live leaderboard coming soon — connect your scores
      </div>
    </div>
  );
}
