// src/pages/HomePage.jsx
import GameCard from "../components/GameCard.jsx";
import StatCard from "../components/StatCard.jsx";
import { GAME_REGISTRY } from "../gameRegistry.js";

export default function HomePage({ setPage, onPlay }) {
  const featured = GAME_REGISTRY.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <div className="text-center pt-8 pb-4">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-6"
          style={{
            background: "rgba(255,230,109,0.1)",
            color: "#ffe66d",
            border: "1px solid rgba(255,230,109,0.2)",
          }}
        >
          ✦ {GAME_REGISTRY.length} GAMES AVAILABLE ✦
        </div>

        <h1
          className="text-5xl sm:text-7xl font-black mb-4 leading-none tracking-tight"
          style={{ fontFamily: "'Exo 2', monospace" }}
        >
          <span className="block text-white">PLAY.</span>
          <span
            className="block"
            style={{ color: "#ffe66d", textShadow: "0 0 40px rgba(255,230,109,0.5)" }}
          >
            WIN.
          </span>
          <span className="block text-white">REPEAT.</span>
        </h1>

        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Handcrafted browser games. No downloads, no installs — just pure play.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setPage("games")}
            className="px-8 py-3 rounded-2xl font-black text-black text-lg hover:scale-105 transition-all cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #ffe66d, #f9ca24)",
              boxShadow: "0 0 30px rgba(255,230,109,0.3)",
            }}
          >
            BROWSE ALL GAMES
          </button>
          <button
            onClick={() =>
              onPlay(GAME_REGISTRY[Math.floor(Math.random() * GAME_REGISTRY.length)].id)
            }
            className="px-8 py-3 rounded-2xl font-black text-white text-lg border hover:bg-white/10 transition-all cursor-pointer"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            🎲 RANDOM GAME
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="TOTAL GAMES" value={GAME_REGISTRY.length} icon="🎮" color="#ffe66d" />
        <StatCard label="CATEGORIES" value={6} icon="📂" color="#4ecdc4" />
        <StatCard label="FREE TO PLAY" value="100%" icon="✅" color="#a29bfe" />
        <StatCard label="PLAYERS" value="1-2" icon="👾" color="#fd79a8" />
      </div>

      {/* ── Featured games ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-white">⭐ FEATURED GAMES</h2>
          <button
            onClick={() => setPage("games")}
            className="text-xs font-mono text-yellow-400/70 hover:text-yellow-400 transition-colors cursor-pointer"
          >
            VIEW ALL →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((game) => (
            <GameCard key={game.id} game={game} onPlay={onPlay} />
          ))}
        </div>
      </div>
    </div>
  );
}
