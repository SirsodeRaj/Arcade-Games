import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function CountMaster({ onClose }) {
  const [dots, setDots] = useState([]);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef(null);

  const genRound = useCallback(() => {
    const count = Math.floor(Math.random() * 18) + 5;
    const arr = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 6 + Math.random() * 6,
      color: ["#ff6b6b","#74b9ff","#a29bfe","#55efc4","#ffe66d","#fd79a8"][Math.floor(Math.random()*6)],
    }));
    setDots(arr);
    const opts = new Set([count]);
    while (opts.size < 4) opts.add(Math.max(1, count + Math.floor(Math.random() * 8) - 4));
    setOptions([...opts].sort(() => Math.random() - 0.5));
    setAnswer(null);
    setTimeLeft(5);
  }, []);

  useEffect(() => { genRound(); }, [genRound]);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (answer !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setAnswer(-1); setStreak(0); setTimeout(() => { setRound(r => r + 1); genRound(); }, 1000); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [answer, genRound]);

  const pick = (o) => {
    if (answer !== null) return;
    clearInterval(timerRef.current);
    setAnswer(o);
    const correct = o === dots.length;
    if (correct) { setScore(s => s + 10 + streak * 3); setStreak(s => s + 1); }
    else setStreak(0);
    setTimeout(() => { setRound(r => r + 1); genRound(); }, 900);
  };

  return (
    <GameShell title="Count Master" icon="🔵" color="#6c5ce7" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-purple-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className={`text-xl font-black ${timeLeft <= 2 ? "text-red-400" : "text-purple-300"}`}>{timeLeft}s</div><div className="text-xs text-gray-500 font-mono">TIME</div></div>
        <div className="text-center"><div className="text-xl font-black text-purple-300">{streak}🔥</div><div className="text-xs text-gray-500 font-mono">STREAK</div></div>
      </div>
      <div className="relative w-full h-44 rounded-2xl border border-purple-400/20 bg-black/40 mb-4 overflow-hidden">
        {dots.map(d => (
          <div key={d.id} className="absolute rounded-full" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, background: d.color, boxShadow: `0 0 4px ${d.color}` }} />
        ))}
        <div className="absolute top-2 right-2 text-xs font-mono text-gray-600">Round {round}</div>
      </div>
      <div className="text-center text-xs text-gray-500 font-mono mb-3">How many dots?</div>
      <div className="grid grid-cols-4 gap-2">
        {options.map((o, i) => (
          <button key={i} onClick={() => pick(o)} disabled={answer !== null}
            className={`py-3 rounded-xl font-black text-lg cursor-pointer transition-all border
              ${answer === o ? o === dots.length ? "bg-green-400/20 border-green-400 text-green-400 scale-105" : "bg-red-400/15 border-red-400/40 text-red-400"
              : answer !== null && o === dots.length ? "bg-green-400/20 border-green-400 text-green-400"
              : "bg-white/5 border-white/10 text-white hover:bg-purple-400/15 hover:border-purple-400/40"}`}>
            {o}
          </button>
        ))}
      </div>
    </GameShell>
  );
}