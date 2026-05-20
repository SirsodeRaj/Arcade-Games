// src/pages/GamesPage.jsx
import { useState } from "react";
import GameCard from "../components/GameCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { GAME_REGISTRY, CATEGORIES } from "../gameRegistry.js";

export default function GamesPage({ onPlay }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const filtered = GAME_REGISTRY.filter(
    (g) =>
      (activeCategory === "All" || g.category === activeCategory) &&
      (!search ||
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.tags.some((t) => t.includes(search.toLowerCase())))
  ).sort((a, b) => {
    if (sort === "name") return a.title.localeCompare(b.title);
    if (sort === "difficulty")
      return (
        ["Easy", "Medium", "Hard"].indexOf(a.difficulty) -
        ["Easy", "Medium", "Hard"].indexOf(b.difficulty)
      );
    return 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-1">ALL GAMES</h2>
        <p className="text-gray-500 font-mono text-sm">
          {filtered.length} game{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-yellow-400/40 cursor-pointer"
        >
          <option value="default">Sort: Default</option>
          <option value="name">Sort: Name</option>
          <option value="difficulty">Sort: Difficulty</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-xl text-sm font-mono font-bold transition-all cursor-pointer"
            style={{
              background:
                activeCategory === cat ? "rgba(255,230,109,0.15)" : "rgba(255,255,255,0.04)",
              color: activeCategory === cat ? "#ffe66d" : "rgba(255,255,255,0.4)",
              border: `1px solid ${
                activeCategory === cat ? "rgba(255,230,109,0.4)" : "rgba(255,255,255,0.06)"
              }`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-mono">No games found for "{search}"</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} onPlay={onPlay} />
          ))}
        </div>
      )}
    </div>
  );
}
