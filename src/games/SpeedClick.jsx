import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function SpeedClick({ onClose }) {
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [status, setStatus] = useState("idle");
  const [missed, setMissed] = useState(0);
  const timerRef = useRef(null);
  const spawnRef = useRef(null);
  const idRef = useRef(0);

  const spawnTarget = useCallback(() => {
    const id = idRef.current++;
    setTargets(t => [...t, { id, x: 5 + Math.random() * 82, y: 5 + Math.random() * 82, size: 28 + Math.random() * 22 }]);
    setTimeout(() => {
      setTargets(t => { const had = t.find(x => x.id === id); if (had) setMissed(m => m + 1); return t.filter(x => x.id !== id); });
    }, 1200);
  }, []);

  const start = () => {
    setScore(0); setMissed(0); setTargets([]); setStatus("running"); setTimeLeft(10);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); clearInterval(spawnRef.current); setStatus("done"); return 0; } return t - 1; });
    }, 1000);
    spawnRef.current = setInterval(spawnTarget, 600);
    spawnTarget();
  };

  const hit = (id, e) => {
    e.stopPropagation();
    setTargets(t => t.filter(x => x.id !== id));
    setScore(s => s + 10);
  };

  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(spawnRef.current); }, []);

  return (
    <GameShell title="Speed Click" icon="🎯" color="#ff7675" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-red-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className={`text-xl font-black ${timeLeft <= 3 ? "text-red-400" : "text-red-300"}`}>{timeLeft}s</div><div className="text-xs text-gray-500 font-mono">TIME</div></div>
        <div className="text-center"><div className="text-xl font-black text-red-300">{missed}</div><div className="text-xs text-gray-500 font-mono">MISSED</div></div>
      </div>
      <div className="relative w-full h-52 rounded-2xl bg-black/40 border border-red-400/15 overflow-hidden mb-4 cursor-crosshair" style={{ userSelect: "none" }}>
        {status === "idle" && <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-sm">Targets will appear here</div>}
        {targets.map(t => (
          <button key={t.id} onClick={(e) => hit(t.id, e)}
            className="absolute rounded-full cursor-pointer transition-all hover:scale-90 flex items-center justify-center font-black text-sm border-2"
            style={{
              left: `${t.x}%`, top: `${t.y}%`, width: t.size, height: t.size,
              transform: "translate(-50%, -50%)",
              background: "rgba(255,118,117,0.3)", borderColor: "#ff7675",
              boxShadow: "0 0 12px rgba(255,118,117,0.5)",
              color: "#ff7675",
            }}>✕</button>
        ))}
      </div>
      {status !== "running" ? (
        <div className="text-center">
          {status === "done" && <div className="mb-2"><span className="text-xl font-black text-red-300">{score} pts</span><span className="text-gray-500 font-mono text-sm ml-2">· {missed} missed</span></div>}
          <button onClick={start} className="px-8 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg, #ff7675, #e84393)" }}>
            {status === "idle" ? "▶ START" : "PLAY AGAIN"}
          </button>
        </div>
      ) : null}
    </GameShell>
  );
}