import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function TriviaBlitz({ onClose }) {
  const QS = [
    { q: "What planet is closest to the Sun?", a: "Mercury", opts: ["Venus", "Mercury", "Mars", "Earth"] },
    { q: "How many sides does a hexagon have?", a: "6", opts: ["5", "6", "7", "8"] },
    { q: "What is the chemical symbol for gold?", a: "Au", opts: ["Ag", "Au", "Fe", "Cu"] },
    { q: "Which ocean is the largest?", a: "Pacific", opts: ["Atlantic", "Indian", "Pacific", "Arctic"] },
    { q: "How many bits in a byte?", a: "8", opts: ["4", "8", "16", "32"] },
    { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", opts: ["Picasso", "Monet", "Leonardo da Vinci", "Rembrandt"] },
    { q: "What is the square root of 144?", a: "12", opts: ["11", "12", "13", "14"] },
    { q: "What gas do plants absorb from the air?", a: "CO₂", opts: ["O₂", "N₂", "CO₂", "H₂"] },
    { q: "Which country invented the Internet?", a: "USA", opts: ["UK", "Germany", "Japan", "USA"] },
    { q: "How many bones in the adult human body?", a: "206", opts: ["198", "206", "212", "220"] },
    { q: "What is the fastest land animal?", a: "Cheetah", opts: ["Lion", "Horse", "Cheetah", "Falcon"] },
    { q: "In what year did WW2 end?", a: "1945", opts: ["1943", "1944", "1945", "1946"] },
  ];

  const [qIdx, setQIdx] = useState(() => Math.floor(Math.random() * QS.length));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);
  const usedRef = useRef(new Set([qIdx]));

  const nextQ = useCallback(() => {
    let next;
    do { next = Math.floor(Math.random() * QS.length); } while (usedRef.current.has(next) && usedRef.current.size < QS.length);
    if (usedRef.current.size >= QS.length) usedRef.current.clear();
    usedRef.current.add(next);
    setQIdx(next); setSelected(null); setTimeLeft(10);
  }, []);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (selected !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setSelected("TIMEOUT"); setStreak(0); setTotal(n => n + 1); setTimeout(nextQ, 1000); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [selected, nextQ]);

  const pick = (opt) => {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(opt);
    setTotal(n => n + 1);
    const correct = opt === QS[qIdx].a;
    if (correct) { setScore(s => s + 10 + streak * 5); setStreak(s => s + 1); }
    else setStreak(0);
    setTimeout(nextQ, 900);
  };

  const q = QS[qIdx];
  return (
    <GameShell title="Trivia Blitz" icon="🧠" color="#00b894" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-green-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className={`text-xl font-black ${timeLeft <= 3 ? "text-red-400" : "text-green-300"}`}>{timeLeft}s</div><div className="text-xs text-gray-500 font-mono">TIME</div></div>
        <div className="text-center"><div className="text-xl font-black text-green-300">{total > 0 ? `${Math.round((score/10)/total*100)}%` : "—"}</div><div className="text-xs text-gray-500 font-mono">ACC</div></div>
      </div>
      <div className="p-5 rounded-2xl bg-black/40 border border-green-400/15 mb-4 min-h-[4rem] flex items-center justify-center">
        <p className="text-white font-bold text-center text-base leading-snug">{q.q}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => pick(opt)} disabled={selected !== null}
            className={`py-3 px-3 rounded-xl font-bold text-sm cursor-pointer transition-all border text-left
              ${selected === opt ? opt === q.a ? "bg-green-400/20 border-green-400 text-green-300 scale-102" : "bg-red-400/15 border-red-400/50 text-red-400"
              : selected !== null && opt === q.a ? "bg-green-400/20 border-green-400 text-green-300"
              : "bg-white/5 border-white/10 text-white hover:bg-green-400/10 hover:border-green-400/30"}`}>
            {opt}
          </button>
        ))}
      </div>
      {streak >= 3 && <div className="text-center mt-3 text-xs font-mono text-green-400">🔥 {streak} in a row!</div>}
    </GameShell>
  );
}