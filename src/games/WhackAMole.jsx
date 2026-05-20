import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function WhackAMole({ onClose }) {
  const TOTAL = 9;
  const [moles, setMoles] = useState(Array(TOTAL).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [status, setStatus] = useState("idle");
  const [miss, setMiss] = useState(false);
  const timersRef = useRef([]);
  const gameTimerRef = useRef(null);

  const popMole = useCallback(() => {
    const idx = Math.floor(Math.random() * TOTAL);
    setMoles(m => { const n = [...m]; n[idx] = true; return n; });
    const t = setTimeout(() => {
      setMoles(m => { const n = [...m]; n[idx] = false; return n; });
    }, 900 + Math.random() * 400);
    timersRef.current.push(t);
  }, []);

  const start = () => {
    setScore(0); setTimeLeft(30); setStatus("running");
    setMoles(Array(TOTAL).fill(false));
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    clearInterval(gameTimerRef.current);
    let elapsed = 0;
    const moleInterval = setInterval(() => { popMole(); }, 700);
    timersRef.current.push(moleInterval);
    gameTimerRef.current = setInterval(() => {
      elapsed++;
      setTimeLeft(30 - elapsed);
      if (elapsed >= 30) {
        clearInterval(gameTimerRef.current);
        clearInterval(moleInterval);
        timersRef.current.forEach(clearTimeout);
        setMoles(Array(TOTAL).fill(false));
        setStatus("done");
      }
    }, 1000);
  };

  useEffect(() => () => { timersRef.current.forEach(clearTimeout); clearInterval(gameTimerRef.current); }, []);

  const whack = (i) => {
    if (!moles[i] || status !== "running") return;
    setMoles(m => { const n = [...m]; n[i] = false; return n; });
    setScore(s => s + 10);
  };

  const moleEmojis = ["🐹","🦔","🐭","🐿️","🐰","🦫","🦎","🐢","🦝"];

  return (
    <GameShell title="Whack-a-Mole" icon="🔨" color="#e17055" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-orange-400">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center">
          <div className="text-xl font-black" style={{ color: timeLeft <= 10 ? "#ff6b6b" : "#e17055" }}>{timeLeft}s</div>
          <div className="text-xs text-gray-500 font-mono">TIME</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {moles.map((active, i) => (
          <button key={i} onClick={() => whack(i)}
            className={`h-16 rounded-2xl border text-3xl transition-all duration-150 cursor-pointer relative overflow-hidden
              ${active ? "border-orange-400 bg-orange-400/20 scale-110 shadow-[0_0_20px_rgba(225,112,85,0.5)]" : "border-white/10 bg-black/40 hover:bg-white/5"}`}>
            <span className={`transition-all duration-150 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>{moleEmojis[i]}</span>
            {!active && <span className="absolute inset-0 flex items-end justify-center pb-1 text-gray-700 text-xs font-mono">〇</span>}
          </button>
        ))}
      </div>
      {status === "idle" && (
        <button onClick={start} className="w-full py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg, #e17055, #d63031)" }}>
          START GAME
        </button>
      )}
      {status === "done" && (
        <div className="text-center">
          <div className="text-2xl font-black text-orange-400 mb-1">⏱ TIME'S UP!</div>
          <div className="text-gray-400 font-mono text-sm mb-3">Final score: <span className="text-white font-bold">{score}</span></div>
          <button onClick={start} className="px-8 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg, #e17055, #d63031)" }}>
            PLAY AGAIN
          </button>
        </div>
      )}
    </GameShell>
  );
}