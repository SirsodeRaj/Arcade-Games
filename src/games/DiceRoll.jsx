import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function DiceRoll({ onClose }) {
  const [playerDice, setPlayerDice] = useState([1, 1]);
  const [cpuDice, setCpuDice] = useState([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ w: 0, l: 0, d: 0 });
  const [rolled, setRolled] = useState(false);
  const faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);
    const interval = setInterval(() => {
      setPlayerDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
      setCpuDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
    }, 80);
    setTimeout(() => {
      clearInterval(interval);
      const p = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
      const c = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
      setPlayerDice(p);
      setCpuDice(c);
      const ps = p[0] + p[1], cs = c[0] + c[1];
      const r = ps > cs ? "win" : ps < cs ? "lose" : "draw";
      setResult(r);
      setScore((s) => ({ ...s, [r === "win" ? "w" : r === "lose" ? "l" : "d"]: s[r === "win" ? "w" : r === "lose" ? "l" : "d"] + 1 }));
      setRolling(false);
      setRolled(true);
    }, 1000);
  };

  return (
    <GameShell title="Dice Roll" icon="🎲" color="#ffe66d" onClose={onClose}>
      <div className="flex justify-center gap-6 mb-6">
        {[["W", score.w, "#4ecdc4"], ["D", score.d, "#ffe66d"], ["L", score.l, "#ff6b6b"]].map(([l, v, c]) => (
          <div key={l} className="text-center">
            <div style={{ color: c }} className="text-2xl font-black">{v}</div>
            <div className="text-xs text-gray-400 font-mono">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-around mb-8">
        {[["YOU", playerDice, "#ffe66d"], ["CPU", cpuDice, "#4ecdc4"]].map(([label, dice, color]) => (
          <div key={label} className="text-center">
            <div className="text-xs text-gray-400 font-mono mb-3">{label}</div>
            <div className="flex gap-3">
              {dice.map((d, i) => (
                <div key={i} className={`text-5xl transition-all duration-100 ${rolling ? "animate-bounce" : ""}`}
                  style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
                  {faces[d - 1]}
                </div>
              ))}
            </div>
            <div className="mt-2 text-lg font-black" style={{ color }}>{dice[0] + dice[1]}</div>
          </div>
        ))}
      </div>
      {result && (
        <div className={`text-center text-xl font-black mb-6 py-2 rounded-xl ${result === "win" ? "text-green-400 bg-green-400/10" : result === "lose" ? "text-red-400 bg-red-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
          {result === "win" ? "🏆 YOU WIN!" : result === "lose" ? "💀 YOU LOSE!" : "🤝 DRAW!"}
        </div>
      )}
      <button onClick={roll} disabled={rolling}
        className="w-full py-4 rounded-2xl font-black text-lg text-black transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
        style={{ background: "linear-gradient(135deg, #ffe66d, #f9ca24)" }}>
        {rolling ? "ROLLING..." : rolled ? "ROLL AGAIN" : "🎲 ROLL DICE"}
      </button>
    </GameShell>
  );
}