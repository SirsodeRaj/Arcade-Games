import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function TypingSpeed({ onClose }) {
  const sentences = [
    "The neon lights flickered across the dark arcade floor.",
    "Press every key with precision and speed to survive.",
    "Pixels dance when your fingers find their rhythm.",
    "Hack the system before the timer hits zero.",
    "Speed and accuracy are the keys to victory.",
  ];
  const [sIdx] = useState(() => Math.floor(Math.random() * sentences.length));
  const text = sentences[sIdx];
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!started) { setStarted(true); setStartTime(Date.now()); }
    setInput(val);
    let correct = 0;
    for (let i = 0; i < val.length; i++) if (val[i] === text[i]) correct++;
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);
    if (val === text) {
      const mins = (Date.now() - startTime) / 60000;
      const words = text.split(" ").length;
      setWpm(Math.round(words / mins));
      setFinished(true);
    }
  };

  const reset = () => { setInput(""); setStarted(false); setStartTime(null); setFinished(false); setWpm(0); setAccuracy(100); };

  return (
    <GameShell title="Typing Speed" icon="⌨️" color="#55efc4" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-emerald-300">{wpm || "—"}</div><div className="text-xs text-gray-500 font-mono">WPM</div></div>
        <div className="text-center"><div className="text-xl font-black text-emerald-300">{accuracy}%</div><div className="text-xs text-gray-500 font-mono">ACCURACY</div></div>
      </div>
      <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 mb-4 font-mono text-lg leading-relaxed">
        {text.split("").map((ch, i) => {
          const typed = input[i];
          const color = typed === undefined ? "rgba(255,255,255,0.3)" : typed === ch ? "#55efc4" : "#ff6b6b";
          const bg = typed !== undefined && typed !== ch ? "rgba(255,107,107,0.15)" : "transparent";
          return <span key={i} style={{ color, background: bg }}>{ch}</span>;
        })}
      </div>
      {!finished ? (
        <textarea value={input} onChange={handleChange} ref={inputRef}
          placeholder="Start typing here..." rows={3} autoFocus
          className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-3 text-white font-mono resize-none outline-none focus:border-emerald-400 focus:shadow-[0_0_12px_rgba(85,239,196,0.2)] transition-all" />
      ) : (
        <div className="text-center py-4">
          <div className="text-2xl font-black text-emerald-300 mb-1">🏁 COMPLETE!</div>
          <div className="text-gray-400 font-mono text-sm mb-1"><span className="text-white font-bold">{wpm} WPM</span> · <span className="text-white font-bold">{accuracy}%</span> accuracy</div>
          <div className="text-xs text-gray-600 font-mono mb-3">{wpm < 40 ? "Keep practicing!" : wpm < 70 ? "Good pace!" : "Blazing fast! 🔥"}</div>
          <button onClick={reset} className="px-8 py-2 rounded-xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#55efc4" }}>TRY AGAIN</button>
        </div>
      )}
    </GameShell>
  );
}