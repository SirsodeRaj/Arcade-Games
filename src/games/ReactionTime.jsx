import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function ReactionTime({ onClose }) {
  const [phase, setPhase] = useState("idle"); // idle|waiting|ready|done
  const [reactionMs, setReactionMs] = useState(null);
  const [startTs, setStartTs] = useState(null);
  const [best, setBest] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const timerRef = useRef(null);

  const start = () => {
    setPhase("waiting");
    setReactionMs(null);
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = setTimeout(() => { setPhase("ready"); setStartTs(Date.now()); }, delay);
  };

  const tap = () => {
    if (phase === "waiting") { clearTimeout(timerRef.current); setPhase("idle"); return; }
    if (phase === "ready") {
      const ms = Date.now() - startTs;
      setReactionMs(ms);
      setBest(b => b === null ? ms : Math.min(b, ms));
      setAttempts(a => [ms, ...a].slice(0, 5));
      setPhase("done");
    }
  };

  const rating = (ms) => ms < 200 ? ["⚡ LIGHTNING", "#f9ca24"] : ms < 300 ? ["🔥 FAST", "#a8e063"] : ms < 450 ? ["👍 GOOD", "#74b9ff"] : ["🐌 SLOW", "#ff6b6b"];

  return (
    <GameShell title="Reaction Time" icon="⚡" color="#f9ca24" onClose={onClose}>
      <div className="flex justify-center gap-8 mb-4">
        <div className="text-center"><div className="text-xl font-black text-yellow-300">{best ? `${best}ms` : "—"}</div><div className="text-xs text-gray-500 font-mono">BEST</div></div>
        <div className="text-center"><div className="text-xl font-black text-yellow-300">{attempts.length ? `${Math.round(attempts.reduce((a,b)=>a+b,0)/attempts.length)}ms` : "—"}</div><div className="text-xs text-gray-500 font-mono">AVG</div></div>
      </div>
      <button onClick={phase === "idle" || phase === "done" ? start : tap}
        className="w-full h-40 rounded-3xl font-black text-2xl cursor-pointer transition-all duration-150 border-2 select-none"
        style={{
          background: phase === "waiting" ? "rgba(255,107,107,0.15)" : phase === "ready" ? "#f9ca24" : "rgba(249,202,36,0.1)",
          borderColor: phase === "ready" ? "#f9ca24" : phase === "waiting" ? "rgba(255,107,107,0.3)" : "rgba(249,202,36,0.3)",
          color: phase === "ready" ? "#000" : "#f9ca24",
          boxShadow: phase === "ready" ? "0 0 40px rgba(249,202,36,0.6)" : "none",
          transform: phase === "ready" ? "scale(1.02)" : "scale(1)",
        }}>
        {phase === "idle" ? "TAP TO START" : phase === "waiting" ? "⏳ WAIT..." : phase === "ready" ? "⚡ TAP NOW!" : reactionMs ? `${reactionMs}ms` : ""}
      </button>
      {phase === "done" && reactionMs && (
        <div className="text-center mt-3">
          <div className="text-lg font-black" style={{ color: rating(reactionMs)[1] }}>{rating(reactionMs)[0]}</div>
          <button onClick={start} className="mt-2 px-6 py-2 rounded-xl font-black text-black text-sm cursor-pointer hover:scale-105 transition-all" style={{ background: "#f9ca24" }}>TRY AGAIN</button>
        </div>
      )}
      {phase === "waiting" && <div className="text-center mt-3 text-xs text-gray-600 font-mono">Tap early = false start!</div>}
      {attempts.length > 0 && (
        <div className="mt-4 space-y-1">
          {attempts.map((ms, i) => (
            <div key={i} className="flex justify-between items-center bg-black/30 rounded-lg px-3 py-1.5">
              <span className="text-xs text-gray-500 font-mono">#{attempts.length - i}</span>
              <span className="font-black font-mono text-sm" style={{ color: rating(ms)[1] }}>{ms}ms</span>
              <span className="text-xs" style={{ color: rating(ms)[1] }}>{rating(ms)[0]}</span>
            </div>
          ))}
        </div>
      )}
    </GameShell>
  );
}