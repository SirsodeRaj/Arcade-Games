import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function WordChain({ onClose }) {
  const STARTERS = ["APPLE","ECHO","ORBIT","TURBO","ULTRA","NEON","LASER","GHOST","BOOST","AMBER"];
  const [chain, setChain] = useState([STARTERS[Math.floor(Math.random() * STARTERS.length)]]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);
  const usedRef = useRef(new Set([chain[0]]));

  const lastWord = chain[chain.length - 1];
  const neededLetter = lastWord[lastWord.length - 1];

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setGameOver(true); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

  const submit = () => {
    const word = input.toUpperCase().trim();
    if (word.length < 2) { setError("Word too short!"); return; }
    if (word[0] !== neededLetter) { setError(`Must start with ${neededLetter}`); return; }
    if (usedRef.current.has(word)) { setError("Already used!"); return; }
    if (!/^[A-Z]+$/.test(word)) { setError("Letters only!"); return; }
    usedRef.current.add(word);
    setChain(c => [...c, word]);
    setScore(s => s + word.length * 5);
    setInput(""); setError("");
    resetTimer();
  };

  const restart = () => {
    const starter = STARTERS[Math.floor(Math.random() * STARTERS.length)];
    setChain([starter]); setInput(""); setError(""); setScore(0); setGameOver(false);
    usedRef.current = new Set([starter]);
    resetTimer();
  };

  return (
    <GameShell title="Word Chain" icon="🔗" color="#fd79a8" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-pink-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className={`text-xl font-black ${timeLeft <= 5 ? "text-red-400" : "text-pink-300"}`}>{timeLeft}s</div><div className="text-xs text-gray-500 font-mono">TIME</div></div>
        <div className="text-center"><div className="text-xl font-black text-pink-300">{chain.length}</div><div className="text-xs text-gray-500 font-mono">CHAIN</div></div>
      </div>
      <div className="bg-black/40 rounded-2xl p-3 mb-4 max-h-32 overflow-y-auto border border-pink-400/10">
        <div className="flex flex-wrap gap-2">
          {chain.map((w, i) => (
            <span key={i} className="text-xs font-mono px-2 py-1 rounded-lg" style={{ background: i === chain.length - 1 ? "rgba(253,121,168,0.25)" : "rgba(255,255,255,0.06)", color: i === chain.length - 1 ? "#fd79a8" : "#aaa" }}>{w}</span>
          ))}
        </div>
      </div>
      <div className="text-center text-sm font-mono mb-3">
        Next word must start with: <span className="text-2xl font-black" style={{ color: "#fd79a8" }}>{neededLetter}</span>
      </div>
      {!gameOver ? (
        <>
          {error && <div className="text-red-400 text-xs font-mono text-center mb-2">{error}</div>}
          <div className="flex gap-2">
            <input value={input} onChange={e => { setInput(e.target.value.toUpperCase()); setError(""); }} onKeyDown={e => e.key === "Enter" && submit()}
              placeholder={`Start with ${neededLetter}...`} maxLength={20} autoFocus
              className="flex-1 bg-black/40 border border-pink-400/30 rounded-xl px-4 py-3 text-white font-mono font-bold tracking-wider uppercase outline-none focus:border-pink-400 transition-all" />
            <button onClick={submit} className="px-5 py-3 rounded-xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#fd79a8" }}>GO</button>
          </div>
        </>
      ) : (
        <div className="text-center py-3">
          <div className="text-xl font-black text-red-400 mb-1">⏰ TIME'S UP!</div>
          <div className="text-gray-400 font-mono text-sm mb-3">Chain of <span className="text-white font-bold">{chain.length}</span> words · Score: <span className="text-pink-300 font-bold">{score}</span></div>
          <button onClick={restart} className="px-6 py-2 rounded-xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#fd79a8" }}>PLAY AGAIN</button>
        </div>
      )}
    </GameShell>
  );
}