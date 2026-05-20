import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function WordJumble({ onClose }) {
  const words = ["ARCADE","PIXEL","NEON","GHOST","LASER","BOOST","ORBIT","TURBO","CYBER","BLAZE","STORM","VAULT","SWIFT","GLITCH","HYPER"];
  const [wordIdx, setWordIdx] = useState(() => Math.floor(Math.random() * words.length));
  const [jumbled, setJumbled] = useState("");
  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false);
  const [streak, setStreak] = useState(0);

  const jumble = (w) => {
    let arr = w.split("");
    do { arr.sort(() => Math.random() - 0.5); } while (arr.join("") === w);
    return arr.join("");
  };

  useEffect(() => { setJumbled(jumble(words[wordIdx])); setHint(false); }, [wordIdx]);

  const submit = () => {
    if (input.toUpperCase() === words[wordIdx]) {
      setSolved(true);
      const pts = hint ? 5 : 10;
      setScore(s => s + pts);
      setStreak(s => s + 1);
    } else {
      setWrong(true);
      setStreak(0);
      setTimeout(() => setWrong(false), 600);
    }
    setInput("");
  };

  const next = () => {
    setSolved(false);
    setWordIdx(Math.floor(Math.random() * words.length));
  };

  return (
    <GameShell title="Word Jumble" icon="🔤" color="#74b9ff" onClose={onClose}>
      <div className="flex justify-between mb-6 px-1">
        <div className="text-center"><div className="text-xl font-black text-blue-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className="text-xl font-black text-blue-300">{streak}🔥</div><div className="text-xs text-gray-500 font-mono">STREAK</div></div>
      </div>
      <div className="text-center mb-6 p-6 rounded-2xl bg-black/40 border border-blue-400/20">
        <div className="text-xs text-gray-500 font-mono mb-2">UNSCRAMBLE THIS WORD</div>
        <div className="text-4xl font-black tracking-[0.3em] mb-2" style={{ color: "#74b9ff", textShadow: "0 0 20px rgba(116,185,255,0.5)" }}>{jumbled}</div>
        <div className="text-xs text-gray-600 font-mono">{words[wordIdx].length} letters</div>
      </div>
      {hint && <div className="text-center text-xs text-gray-400 font-mono mb-3">Hint: Starts with <span className="text-blue-300 font-bold">{words[wordIdx][0]}</span></div>}
      {!solved ? (
        <div className="space-y-3">
          <div className={`flex gap-2 transition-all ${wrong ? "animate-bounce" : ""}`}>
            <input value={input} onChange={e => setInput(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="Your answer..." maxLength={words[wordIdx].length}
              className={`flex-1 bg-black/40 border rounded-xl px-4 py-3 text-white font-mono font-bold tracking-widest text-lg outline-none transition-all uppercase
                ${wrong ? "border-red-400 shadow-[0_0_12px_rgba(255,107,107,0.4)]" : "border-blue-400/30 focus:border-blue-400 focus:shadow-[0_0_12px_rgba(116,185,255,0.3)]"}`} />
            <button onClick={submit} className="px-5 py-3 rounded-xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#74b9ff" }}>GO</button>
          </div>
          <button onClick={() => setHint(true)} disabled={hint} className="w-full py-2 rounded-xl text-xs font-mono text-gray-500 bg-white/5 hover:bg-white/10 transition-all cursor-pointer disabled:opacity-30">
            💡 Show hint (-5 pts)
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-xl font-black text-green-400 mb-1">✅ CORRECT!</div>
          <div className="text-gray-400 font-mono text-sm mb-3">+{hint ? 5 : 10} points{streak > 1 ? ` · ${streak} streak 🔥` : ""}</div>
          <button onClick={next} className="px-8 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#74b9ff" }}>NEXT WORD →</button>
        </div>
      )}
    </GameShell>
  );
}