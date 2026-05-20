// src/games/RockPaperScissors.jsx
// ─────────────────────────────────────────────────────────────────
// TEMPLATE — every game file follows this exact pattern:
//   1. Import { useState, useEffect, useRef, useCallback } as needed
//   2. Import GameShell from "../components/GameShell.jsx"
//   3. Export a default function({ onClose })
//   4. Render <GameShell title="..." icon="..." color="#..." onClose={onClose}>
//        ... game UI ...
//      </GameShell>
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function RockPaperScissors({ onClose }) {
  const choices = ["✊", "✋", "✌️"];
  const labels  = ["Rock", "Paper", "Scissors"];

  const [playerChoice, setPlayerChoice] = useState(null);
  const [cpuChoice,    setCpuChoice]    = useState(null);
  const [result,       setResult]       = useState(null);
  const [score,        setScore]        = useState({ w: 0, l: 0, d: 0 });
  const [animating,    setAnimating]    = useState(false);

  const play = (idx) => {
    if (animating) return;
    setAnimating(true);
    setPlayerChoice(idx);
    setCpuChoice(null);
    setResult(null);

    setTimeout(() => {
      const cpu  = Math.floor(Math.random() * 3);
      setCpuChoice(cpu);
      const diff = (idx - cpu + 3) % 3;
      const r    = diff === 0 ? "draw" : diff === 1 ? "win" : "lose";
      setResult(r);
      setScore((s) => ({
        ...s,
        [r === "win" ? "w" : r === "lose" ? "l" : "d"]:
          s[r === "win" ? "w" : r === "lose" ? "l" : "d"] + 1,
      }));
      setAnimating(false);
    }, 600);
  };

  return (
    <GameShell title="Rock Paper Scissors" icon="✊" color="#ff6b6b" onClose={onClose}>
      {/* Score bar */}
      <div className="flex justify-center gap-6 mb-6">
        {[["W", score.w, "#4ecdc4"], ["D", score.d, "#ffe66d"], ["L", score.l, "#ff6b6b"]].map(
          ([l, v, c]) => (
            <div key={l} className="text-center">
              <div style={{ color: c }} className="text-2xl font-black">{v}</div>
              <div className="text-xs text-gray-400 font-mono">{l}</div>
            </div>
          )
        )}
      </div>

      {/* Battle display */}
      <div className="flex justify-around items-center mb-8 bg-black/30 rounded-2xl p-6">
        <div className="text-center">
          <div
            className="text-5xl mb-2 transition-all duration-300"
            style={{ filter: playerChoice !== null ? "drop-shadow(0 0 12px #ff6b6b)" : "none" }}
          >
            {playerChoice !== null ? choices[playerChoice] : "❓"}
          </div>
          <div className="text-xs text-gray-400 font-mono">YOU</div>
        </div>
        <div className="text-2xl font-black text-gray-600">VS</div>
        <div className="text-center">
          <div
            className={`text-5xl mb-2 transition-all duration-300 ${animating ? "animate-spin" : ""}`}
            style={{ filter: cpuChoice !== null ? "drop-shadow(0 0 12px #4ecdc4)" : "none" }}
          >
            {cpuChoice !== null ? choices[cpuChoice] : "🤖"}
          </div>
          <div className="text-xs text-gray-400 font-mono">CPU</div>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div
          className={`text-center text-xl font-black mb-6 py-2 rounded-xl ${
            result === "win"
              ? "text-green-400 bg-green-400/10"
              : result === "lose"
              ? "text-red-400 bg-red-400/10"
              : "text-yellow-400 bg-yellow-400/10"
          }`}
        >
          {result === "win" ? "🏆 YOU WIN!" : result === "lose" ? "💀 YOU LOSE!" : "🤝 DRAW!"}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        {choices.map((c, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            disabled={animating}
            className="text-4xl p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/15 hover:scale-110 transition-all duration-200 disabled:opacity-40 cursor-pointer"
          >
            {c}
            <div className="text-xs text-center text-gray-400 mt-1 font-mono">{labels[i]}</div>
          </button>
        ))}
      </div>
    </GameShell>
  );
}