import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function CoinFlip({ onClose }) {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [choice, setChoice] = useState(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [total, setTotal] = useState({ w: 0, l: 0 });
  const [spin, setSpin] = useState(false);

  const flip = (c) => {
    if (flipping) return;
    setChoice(c);
    setFlipping(true);
    setSpin(true);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? "heads" : "tails";
      setResult(r);
      setSpin(false);
      const won = r === c;
      setTotal(t => ({ w: t.w + (won ? 1 : 0), l: t.l + (won ? 0 : 1) }));
      if (won) {
        setStreak(s => { const ns = s + 1; setBest(b => Math.max(b, ns)); return ns; });
      } else {
        setStreak(0);
      }
      setFlipping(false);
    }, 800);
  };

  return (
    <GameShell title="Coin Flip Streak" icon="🪙" color="#fdcb6e" onClose={onClose}>
      <div className="flex justify-center gap-8 mb-6">
        {[["STREAK", streak, "#fdcb6e"], ["BEST", best, "#ffe66d"], ["W/L", `${total.w}/${total.l}`, "#b2bec3"]].map(([l, v, c]) => (
          <div key={l} className="text-center">
            <div style={{ color: c }} className="text-2xl font-black">{v}</div>
            <div className="text-xs text-gray-400 font-mono">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl border-4 transition-all duration-300
          ${spin ? "animate-spin" : ""}
          ${result === "heads" ? "border-yellow-400 bg-yellow-400/20" : result === "tails" ? "border-gray-400 bg-gray-400/20" : "border-white/20 bg-white/5"}`}
          style={{ boxShadow: result ? `0 0 30px ${result === "heads" ? "rgba(253,203,110,0.5)" : "rgba(178,190,195,0.4)"}` : "none" }}>
          {result ? (result === "heads" ? "👑" : "🔵") : "🪙"}
        </div>
      </div>
      {result && !flipping && (
        <div className={`text-center text-sm font-black mb-4 ${result === choice ? "text-green-400" : "text-red-400"}`}>
          {result.toUpperCase()} — {result === choice ? `✅ +1 STREAK (${streak})` : "❌ STREAK RESET"}
        </div>
      )}
      <div className="flex gap-4">
        {["heads", "tails"].map(side => (
          <button key={side} onClick={() => flip(side)} disabled={flipping}
            className="flex-1 py-4 rounded-2xl font-black text-lg border transition-all hover:scale-105 disabled:opacity-40 cursor-pointer"
            style={{
              background: choice === side && result ? result === side ? "rgba(0,184,148,0.2)" : "rgba(255,107,107,0.15)" : "rgba(253,203,110,0.1)",
              borderColor: "#fdcb6e40",
              color: "#fdcb6e",
            }}>
            {side === "heads" ? "👑 HEADS" : "🔵 TAILS"}
          </button>
        ))}
      </div>
      {streak >= 3 && <div className="text-center mt-3 text-xs font-mono text-yellow-400">🔥 {streak} in a row!</div>}
    </GameShell>
  );
}