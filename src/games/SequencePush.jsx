import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function SequencePush({ onClose }) {
  const LEN = 5;
  const [sequence, setSequence] = useState(() => Array.from({ length: LEN }, () => Math.floor(Math.random() * 9) + 1));
  const [phase, setPhase] = useState("study"); // study|recall|result
  const [input, setInput] = useState([]);
  const [timeLeft, setTimeLeft] = useState(4);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [best, setBest] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase !== "study") return;
    setTimeLeft(4);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase("recall"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, sequence]);

  const push = (n) => {
    if (phase !== "recall") return;
    const newInput = [...input, n];
    setInput(newInput);
    if (newInput.length === sequence.length) {
      const correct = newInput.every((v, i) => v === sequence[i]);
      const pts = correct ? round * 15 : 0;
      setScore(s => s + pts);
      setBest(b => Math.max(b, round - (correct ? 0 : 1)));
      setPhase("result");
      setTimeout(() => {
        if (correct) {
          const newLen = LEN + round;
          setSequence(Array.from({ length: newLen }, () => Math.floor(Math.random() * 9) + 1));
          setRound(r => r + 1);
        } else {
          setSequence(Array.from({ length: LEN }, () => Math.floor(Math.random() * 9) + 1));
          setRound(1);
        }
        setInput([]);
        setPhase("study");
      }, 1200);
    }
  };

  const correct = phase === "result" && input.every((v, i) => v === sequence[i]);

  return (
    <GameShell title="Sequence Push" icon="🔢" color="#ffeaa7" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-yellow-200">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className="text-xl font-black text-yellow-200">Lvl {round}</div><div className="text-xs text-gray-500 font-mono">ROUND</div></div>
        <div className="text-center"><div className="text-xl font-black text-yellow-200">{best}</div><div className="text-xs text-gray-500 font-mono">BEST</div></div>
      </div>
      <div className="bg-black/40 rounded-2xl p-4 border border-yellow-400/15 mb-4 text-center min-h-[4.5rem] flex items-center justify-center">
        {phase === "study" ? (
          <div>
            <div className="text-xs text-gray-500 font-mono mb-2">Memorize! ({timeLeft}s left)</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {sequence.map((n, i) => (
                <span key={i} className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg border"
                  style={{ background: "rgba(255,234,167,0.2)", borderColor: "rgba(255,234,167,0.4)", color: "#ffeaa7" }}>{n}</span>
              ))}
            </div>
          </div>
        ) : phase === "recall" ? (
          <div>
            <div className="text-xs text-gray-500 font-mono mb-2">Enter the sequence ({input.length}/{sequence.length})</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: sequence.length }, (_, i) => (
                <span key={i} className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg border"
                  style={{ background: input[i] !== undefined ? "rgba(255,234,167,0.2)" : "rgba(255,255,255,0.04)", borderColor: input[i] !== undefined ? "rgba(255,234,167,0.5)" : "rgba(255,255,255,0.08)", color: "#ffeaa7" }}>
                  {input[i] ?? ""}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className={`font-black text-xl ${correct ? "text-green-400" : "text-red-400"}`}>
            {correct ? `✅ Correct! +${round * 15} pts` : `❌ Got ${input.join(" ")} — was ${sequence.join(" ")}`}
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => push(n)} disabled={phase !== "recall"}
            className="py-3 rounded-xl font-black text-xl text-white border bg-white/5 border-white/10 hover:bg-yellow-400/15 hover:border-yellow-400/40 disabled:opacity-30 transition-all cursor-pointer">
            {n}
          </button>
        ))}
      </div>
    </GameShell>
  );
}