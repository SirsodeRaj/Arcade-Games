import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function GuessNumber({ onClose }) {
  const [secret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState([]);
  const [won, setWon] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 7;

  const submit = () => {
    const g = parseInt(guess);
    if (isNaN(g) || g < 1 || g > 100) return;
    const diff = Math.abs(g - secret);
    const hint = g === secret ? "🎯 EXACT!" : g < secret ? diff < 10 ? "🔥 Warmer! Go higher" : "❄️ Too low!" : diff < 10 ? "🔥 Warmer! Go lower" : "❄️ Too high!";
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setHistory((h) => [{ g, hint, a: newAttempts }, ...h]);
    if (g === secret) setWon(true);
    setGuess("");
  };

  const reset = () => { window.location.reload(); };

  return (
    <GameShell title="Guess the Number" icon="🔢" color="#4ecdc4" onClose={onClose}>
      <div className="text-center mb-6">
        <div className="text-gray-400 text-sm font-mono">Guess a number between <span className="text-teal-400 font-bold">1–100</span></div>
        <div className="mt-2">
          <span className="text-lg font-black" style={{ color: attempts >= maxAttempts - 2 ? "#ff6b6b" : "#4ecdc4" }}>{maxAttempts - attempts}</span>
          <span className="text-gray-500 text-sm font-mono"> attempts left</span>
        </div>
      </div>
      {!won && attempts < maxAttempts ? (
        <div className="flex gap-3 mb-6">
          <input value={guess} onChange={(e) => setGuess(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
            type="number" min="1" max="100" placeholder="Enter guess..."
            className="flex-1 bg-black/40 border border-teal-500/30 rounded-xl px-4 py-3 text-white font-mono text-lg outline-none focus:border-teal-400 focus:shadow-[0_0_12px_rgba(78,205,196,0.3)] transition-all" />
          <button onClick={submit} className="px-6 py-3 rounded-xl font-black text-black transition-all hover:scale-105 cursor-pointer" style={{ background: "#4ecdc4" }}>GO</button>
        </div>
      ) : (
        <div className={`text-center py-4 mb-6 rounded-2xl font-black text-xl ${won ? "text-teal-400 bg-teal-400/10" : "text-red-400 bg-red-400/10"}`}>
          {won ? `🏆 Cracked it in ${attempts} tries!` : `💀 It was ${secret}!`}
          <button onClick={reset} className="block mx-auto mt-3 px-4 py-1 rounded-lg bg-white/10 text-sm hover:bg-white/20 transition-all cursor-pointer">Play Again</button>
        </div>
      )}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {history.map((h, i) => (
          <div key={i} className="flex justify-between items-center bg-black/30 rounded-lg px-4 py-2">
            <span className="font-mono font-bold text-white">#{h.a} → {h.g}</span>
            <span className="text-sm">{h.hint}</span>
          </div>
        ))}
      </div>
    </GameShell>
  );
}