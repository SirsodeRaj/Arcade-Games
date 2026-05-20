import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function HigherLower({ onClose }) {
  const suits = ["♠","♥","♦","♣"];
  const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const makeCard = () => ({ rank: Math.floor(Math.random()*13), suit: suits[Math.floor(Math.random()*4)] });
  const val = (r) => r + 1;
  const [current, setCurrent] = useState(makeCard);
  const [next, setNext] = useState(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);

  const guess = (dir) => {
    const n = makeCard();
    setNext(n);
    const correct = dir === "higher" ? val(n.rank) >= val(current.rank) : val(n.rank) <= val(current.rank);
    const newStreak = correct ? streak + 1 : 0;
    setResult(correct ? "win" : "lose");
    setStreak(newStreak);
    setBest(b => Math.max(b, newStreak));
    if (correct) setScore(s => s + 10 + streak * 5);
    setTimeout(() => { setCurrent(n); setNext(null); setResult(null); }, 900);
  };

  const isRed = (s) => s === "♥" || s === "♦";
  const CardFace = ({ card, dim }) => (
    <div className={`w-20 h-28 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${dim ? "opacity-40" : ""}`}
      style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}>
      <div className="text-2xl font-black" style={{ color: isRed(card.suit) ? "#ff6b6b" : "#fff" }}>{ranks[card.rank]}</div>
      <div className="text-2xl" style={{ color: isRed(card.suit) ? "#ff6b6b" : "#fff" }}>{card.suit}</div>
    </div>
  );

  return (
    <GameShell title="Higher or Lower" icon="🃏" color="#a8e063" onClose={onClose}>
      <div className="flex justify-center gap-8 mb-6">
        {[["STREAK", streak, "#a8e063"], ["BEST", best, "#ffe66d"], ["SCORE", score, "#55efc4"]].map(([l, v, c]) => (
          <div key={l} className="text-center">
            <div style={{ color: c }} className="text-2xl font-black">{v}</div>
            <div className="text-xs text-gray-400 font-mono">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 mb-6">
        <CardFace card={current} dim={false} />
        <div className="text-3xl font-black text-gray-600">→</div>
        {next ? <CardFace card={next} dim={false} /> : <div className="w-20 h-28 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-3xl">?</div>}
      </div>
      {result && (
        <div className={`text-center font-black mb-3 text-lg ${result === "win" ? "text-green-400" : "text-red-400"}`}>
          {result === "win" ? "✅ Correct!" : "❌ Wrong!"}
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={() => guess("higher")} disabled={!!next} className="flex-1 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 disabled:opacity-40 transition-all" style={{ background: "#a8e063" }}>⬆ HIGHER</button>
        <button onClick={() => guess("lower")} disabled={!!next} className="flex-1 py-3 rounded-2xl font-black text-white cursor-pointer hover:scale-105 disabled:opacity-40 transition-all border border-green-400/40 bg-green-400/10">⬇ LOWER</button>
      </div>
    </GameShell>
  );
}