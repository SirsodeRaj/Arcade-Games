// src/pages/CategoriesPage.jsx
import GameCard from "../components/GameCard.jsx";
import { GAME_REGISTRY, CATEGORIES } from "../gameRegistry.js";

export default function CategoriesPage({ onPlay }) {
  const cats = CATEGORIES.filter((c) => c !== "All");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white mb-1">CATEGORIES</h2>
        <p className="text-gray-500 font-mono text-sm">Browse by game type</p>
      </div>

      {cats.map((cat) => {
        const games = GAME_REGISTRY.filter((g) => g.category === cat);
        const accent = games[0]?.color || "#ffe66d";
        return (
          <div key={cat}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ background: accent }} />
              <h3 className="text-xl font-black text-white">{cat}</h3>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: `${accent}20`, color: accent }}
              >
                {games.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game} onPlay={onPlay} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
