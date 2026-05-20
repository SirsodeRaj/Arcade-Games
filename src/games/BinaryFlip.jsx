import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function BinaryFlip({ onClose }) {
  const genQ = () => {
    const dec = Math.floor(Math.random() * 63) + 1;
    const bin = dec.toString(2).padStart(6, "0");
    const wrong = new Set([dec]);
    while (wrong.size < 4) { const w = Math.max(1, dec + Math.floor(Math.random()*20) - 10); wrong.add(w); }
    return { bin, dec, opts: [...wrong].sort(() => Math.random() - 0.5) };
  };
  const [q, setQ] = useState(genQ);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(12);
  const timerRef = useRef(null);

  const next = useCallback(() => { setQ(genQ()); setSelected(null); setTimeLeft(12); }, []);

  useEffect(() => {
    clearInterval(timerRef.current); if (selected !== null) return;
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); setSelected(-1); setStreak(0); setTimeout(next, 1000); return 0; } return t - 1; }), 1000);
    return () => clearInterval(timerRef.current);
  }, [selected, next]);

  const pick = (v) => {
    if (selected !== null) return;
    clearInterval(timerRef.current); setSelected(v); setRound(r => r + 1);
    if (v === q.dec) { const pts = 15 + streak * 5; setScore(s => s + pts); setStreak(s => s + 1); }
    else setStreak(0);
    setTimeout(next, 1000);
  };

  return (
    <GameShell title="Binary Flip" icon="💻" color="#00b894" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-emerald-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className={`text-xl font-black ${timeLeft <= 4 ? "text-red-400" : "text-emerald-300"}`}>{timeLeft}s</div><div className="text-xs text-gray-500 font-mono">TIME</div></div>
        <div className="text-center"><div className="text-xl font-black text-emerald-300">{streak}🔥</div><div className="text-xs text-gray-500 font-mono">STREAK</div></div>
      </div>
      <div className="text-center p-5 rounded-2xl bg-black/40 border border-emerald-400/20 mb-5">
        <div className="text-xs text-gray-500 font-mono mb-2">BINARY → DECIMAL</div>
        <div className="flex gap-1.5 justify-center">
          {q.bin.split("").map((b, i) => (
            <span key={i} className="w-10 h-12 rounded-xl flex items-center justify-center font-black text-2xl border"
              style={{ background: b === "1" ? "rgba(0,184,148,0.25)" : "rgba(255,255,255,0.04)", borderColor: b === "1" ? "rgba(0,184,148,0.6)" : "rgba(255,255,255,0.1)", color: b === "1" ? "#00b894" : "rgba(255,255,255,0.2)" }}>{b}</span>
          ))}
        </div>
        <div className="text-xs text-gray-600 font-mono mt-2">= ? (decimal)</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.opts.map((o, i) => {
          const isCorrect = o === q.dec, isPicked = o === selected;
          return (
            <button key={i} onClick={() => pick(o)} disabled={selected !== null}
              className="py-4 rounded-2xl font-black text-2xl cursor-pointer border transition-all hover:scale-105 disabled:cursor-not-allowed"
              style={{
                background: selected !== null ? isCorrect ? "rgba(0,184,148,0.3)" : isPicked ? "rgba(255,107,107,0.2)" : "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
                borderColor: selected !== null ? isCorrect ? "#00b894" : isPicked ? "#ff6b6b" : "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)",
                color: selected !== null ? isCorrect ? "#00b894" : isPicked ? "#ff6b6b" : "rgba(255,255,255,0.3)" : "white",
              }}>{o}</button>
          );
        })}
      </div>
      {selected !== null && (
        <div className={`text-center mt-3 text-sm font-black ${selected === q.dec ? "text-green-400" : "text-red-400"}`}>
          {selected === -1 ? `⏰ Time's up! It was ${q.dec}` : selected === q.dec ? `✅ Correct! +${15 + Math.max(0,streak-1)*5}` : `❌ It was ${q.dec}`}
        </div>
      )}
    </GameShell>
  );
}