// src/components/GameCard.jsx
import { useState } from "react";

export default function GameCard({ game, onPlay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${game.color}18, rgba(10,10,20,0.95))`
          : "rgba(10,10,20,0.7)",
        borderColor: hovered ? `${game.color}60` : "rgba(255,255,255,0.06)",
        boxShadow: hovered ? `0 0 30px ${game.glow}, 0 0 60px ${game.glow}` : "none",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      <div className="p-6">
        {/* Icon + badges */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="text-4xl"
            style={{
              filter: hovered ? `drop-shadow(0 0 10px ${game.color})` : "none",
              transition: "filter 0.3s",
            }}
          >
            {game.icon}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{
                background: `${game.color}20`,
                color: game.color,
                border: `1px solid ${game.color}40`,
              }}
            >
              {game.category}
            </span>
            <span className="text-xs text-gray-500 font-mono">{game.players}</span>
          </div>
        </div>

        {/* Title + description */}
        <h3 className="font-black text-white text-lg mb-1 leading-tight">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{game.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded-full ${
              game.difficulty === "Easy"
                ? "text-green-400 bg-green-400/10"
                : game.difficulty === "Medium"
                ? "text-yellow-400 bg-yellow-400/10"
                : "text-red-400 bg-red-400/10"
            }`}
          >
            {game.difficulty}
          </span>
          <button
            onClick={() => onPlay(game.id)}
            className="px-4 py-1.5 rounded-xl text-xs font-black text-black transition-all duration-200 hover:scale-110 cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)` }}
          >
            PLAY →
          </button>
        </div>
      </div>

      {/* Bottom glow bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
        style={{
          background: hovered
            ? `linear-gradient(90deg, transparent, ${game.color}, transparent)`
            : "transparent",
        }}
      />
    </div>
  );
}
