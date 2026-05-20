import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function GridPaint({ onClose }) {
  const SIZE = 5;
  const genTarget = () => Array.from({ length: SIZE*SIZE }, () => Math.random() > 0.45);
  const [target, setTarget] = useState(genTarget);
  const [grid, setGrid] = useState(() => Array(SIZE*SIZE).fill(false));
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState(null);

  const toggle = i => { if (checked) return; setGrid(g => g.map((v, j) => j === i ? !v : v)); };

  const check = () => {
    const correct = grid.filter((v, i) => v === target[i]).length;
    const total = SIZE * SIZE;
    const pct = Math.round((correct / total) * 100);
    const pts = pct === 100 ? 30 : pct >= 80 ? 20 : pct >= 60 ? 10 : 0;
    setScore(s => s + pts); setChecked(true); setResult({ pct, pts });
  };

  const next = () => { setTarget(genTarget()); setGrid(Array(SIZE*SIZE).fill(false)); setChecked(false); setResult(null); setRound(r => r + 1); };

  return (
    <GameShell title="Grid Paint" icon="🖼️" color="#fd79a8" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-pink-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className="text-xl font-black text-pink-300">#{round}</div><div className="text-xs text-gray-500 font-mono">ROUND</div></div>
      </div>
      <div className="flex gap-4 justify-center mb-4">
        {["TARGET", "YOUR GRID"].map((label, side) => (
          <div key={label} className="text-center">
            <div className="text-xs text-gray-500 font-mono mb-2">{label}</div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${SIZE},1fr)` }}>
              {(side === 0 ? target : grid).map((on, i) => (
                <div key={i} onClick={() => side === 1 && toggle(i)}
                  className={`w-9 h-9 rounded-md border transition-all duration-150 ${side === 1 ? "cursor-pointer hover:scale-110" : ""}`}
                  style={{
                    background: checked && side === 1
                      ? on === target[i] ? on ? "rgba(0,184,148,0.7)" : "rgba(255,255,255,0.05)" : on ? "rgba(255,107,107,0.7)" : "rgba(255,107,107,0.3)"
                      : on ? (side === 0 ? "#fd79a8" : "#fd79a8") : "rgba(255,255,255,0.05)",
                    borderColor: on ? (side === 0 ? "rgba(253,121,168,0.7)" : "rgba(253,121,168,0.5)") : "rgba(255,255,255,0.08)",
                    boxShadow: on ? `0 0 6px rgba(253,121,168,0.4)` : "none",
                  }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {result && (
        <div className={`text-center text-sm font-black mb-3 ${result.pct === 100 ? "text-green-400" : result.pct >= 60 ? "text-yellow-400" : "text-red-400"}`}>
          {result.pct}% match · {result.pts > 0 ? `+${result.pts} pts` : "No points"}
        </div>
      )}
      {!checked ? (
        <button onClick={check} className="w-full py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#fd79a8" }}>CHECK</button>
      ) : (
        <button onClick={next} className="w-full py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#fd79a8" }}>NEXT ROUND →</button>
      )}
    </GameShell>
  );
}