import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function AnagramHunt({ onClose }) {
  const words = ["PLANET","ARCADE","BRIDGE","CHROME","FILTER","GOBLIN","HUNTER","INSECT","JUNGLE","LOCKET","MARVEL","NOODLE","OYSTER","PIRATE","QUARTZ","ROCKET","SILVER","THRONE","UNFOLD","VELVET","WALRUS","XYSTER","YELLOW","ZIPPER","CACTUS","DRAGON","FLUTE","GHOST","HYENA","IVORY"];
  const shuffle = w => w.split("").sort(() => Math.random() - 0.5).join("");
  const pick = () => { const w = words[Math.floor(Math.random()*words.length)]; let s = shuffle(w); while (s === w) s = shuffle(w); return { word: w, scrambled: s }; };
  const [current, setCurrent] = useState(pick);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [skips, setSkips] = useState(3);
  const [round, setRound] = useState(1);
  const inputRef = useRef(null);

  const submit = () => {
    const ans = input.toUpperCase().trim();
    if (!ans) return;
    if (ans === current.word) {
      const pts = 20 + streak * 5;
      setScore(s => s + pts); setStreak(s => s + 1);
      setFeedback({ ok: true, msg: `+${pts} pts` });
      setTimeout(() => { setCurrent(pick()); setInput(""); setFeedback(null); setRound(r => r + 1); inputRef.current?.focus(); }, 800);
    } else {
      setStreak(0); setFeedback({ ok: false, msg: "❌ Try again!" });
      setTimeout(() => setFeedback(null), 700);
      setInput("");
    }
  };

  const doSkip = () => {
    if (skips <= 0) return;
    setSkips(s => s - 1); setStreak(0);
    setCurrent(pick()); setInput(""); setFeedback(null); setRound(r => r + 1);
  };

  return (
    <GameShell title="Anagram Hunt" icon="🔡" color="#e17055" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-orange-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className="text-xl font-black text-orange-300">{streak}🔥</div><div className="text-xs text-gray-500 font-mono">STREAK</div></div>
        <div className="text-center"><div className="text-xl font-black text-orange-300">#{round}</div><div className="text-xs text-gray-500 font-mono">ROUND</div></div>
      </div>
      <div className="text-center p-5 rounded-2xl bg-black/40 border border-orange-400/20 mb-4">
        <div className="text-xs text-gray-500 font-mono mb-2">UNSCRAMBLE THIS WORD</div>
        <div className="flex gap-2 justify-center flex-wrap">
          {current.scrambled.split("").map((ch, i) => (
            <span key={i} className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl border"
              style={{ background: "rgba(225,112,85,0.2)", borderColor: "rgba(225,112,85,0.5)", color: "#e17055" }}>{ch}</span>
          ))}
        </div>
        <div className="text-xs text-gray-600 font-mono mt-2">{current.word.length} letters</div>
      </div>
      {feedback && <div className={`text-center text-sm font-black mb-2 ${feedback.ok ? "text-green-400" : "text-red-400"}`}>{feedback.msg}</div>}
      <div className="flex gap-2">
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Your answer..." maxLength={12} autoFocus
          className="flex-1 bg-black/40 border border-orange-400/30 rounded-xl px-4 py-3 text-white font-mono font-bold uppercase tracking-widest outline-none focus:border-orange-400 transition-all" />
        <button onClick={submit} className="px-5 py-3 rounded-xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#e17055" }}>GO</button>
      </div>
      <button onClick={doSkip} disabled={skips <= 0}
        className="w-full mt-2 py-2 rounded-xl text-xs font-mono text-gray-500 bg-white/5 hover:bg-white/10 cursor-pointer disabled:opacity-30 transition-all border border-white/10">
        Skip ({skips} left)
      </button>
    </GameShell>
  );
}