import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function TypeRacer({ onClose }) {
  const TEXTS = [
    "the quick brown fox jumps over the lazy dog",
    "neon lights flicker in the dark arcade room",
    "speed and accuracy win the day every time",
    "pixels dance when your fingers find the rhythm",
    "hack the code before the countdown hits zero",
    "press every key with full precision and power",
  ];
  const [textIdx] = useState(()=>Math.floor(Math.random()*TEXTS.length));
  const text = TEXTS[textIdx];
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [done, setDone] = useState(false);
  const [ghost, setGhost] = useState(null); // best wpm
  const [best, setBest] = useState(null);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  const handleChange = e => {
    const v = e.target.value;
    if (!startTime && v.length === 1) setStartTime(Date.now());
    if (v.length > text.length) return;
    setInput(v);
    let correct = 0;
    for (let i=0;i<v.length;i++) if(v[i]===text[i]) correct++;
    setAccuracy(v.length>0?Math.round((correct/v.length)*100):100);
    if (v === text) {
      const mins = (Date.now()-startTime)/60000;
      const w = Math.round(text.split(" ").length/mins);
      setWpm(w); setDone(true);
      setBest(b => { const nb = b===null?w:Math.max(b,w); setGhost(nb); return nb; });
    }
  };

  const restart = () => { setInput(""); setStartTime(null); setWpm(0); setDone(false); setAccuracy(100); setTimeout(()=>inputRef.current?.focus(),50); };

  const curWpm = startTime && !done ? Math.round(((input.length/5)/((Date.now()-startTime)/60000))) : wpm;

  return (
    <GameShell title="Type Racer" icon="🏎️" color="#55efc4" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-emerald-300">{curWpm||"—"}</div><div className="text-xs text-gray-500 font-mono">WPM</div></div>
        <div className="text-center"><div className="text-xl font-black text-emerald-300">{accuracy}%</div><div className="text-xs text-gray-500 font-mono">ACC</div></div>
        <div className="text-center"><div className="text-xl font-black text-emerald-300">{ghost||"—"}</div><div className="text-xs text-gray-500 font-mono">BEST</div></div>
      </div>
      {/* race track */}
      <div className="relative h-8 rounded-full bg-black/40 border border-emerald-400/20 mb-3 overflow-hidden">
        <div className="absolute inset-y-0 left-0 transition-all duration-200 rounded-full" style={{width:`${Math.min(100,(input.length/text.length)*100)}%`,background:"linear-gradient(90deg,#55efc4,#00b894)"}} />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white/50">{Math.round((input.length/text.length)*100)}%</div>
      </div>
      <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/15 mb-3 font-mono text-base leading-relaxed min-h-[60px]">
        {text.split("").map((ch,i)=>{
          const typed=input[i];
          const color=typed===undefined?"rgba(255,255,255,0.28)":typed===ch?"#55efc4":"#ff6b6b";
          const bg=typed!==undefined&&typed!==ch?"rgba(255,107,107,0.15)":"transparent";
          const isCursor=i===input.length&&!done;
          return <span key={i} style={{color,background:bg,borderBottom:isCursor?"2px solid #55efc4":"none"}}>{ch}</span>;
        })}
      </div>
      {!done ? (
        <textarea ref={inputRef} value={input} onChange={handleChange} placeholder="Start typing..." rows={2} autoFocus
          className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-3 text-white font-mono resize-none outline-none focus:border-emerald-400 transition-all" />
      ) : (
        <div className="text-center py-3">
          <div className="text-2xl font-black text-emerald-300 mb-1">🏁 {wpm} WPM</div>
          <div className="text-gray-500 font-mono text-xs mb-3">{wpm>=(best??0)?"🏆 New best!":""} {accuracy}% accuracy</div>
          <button onClick={restart} className="px-8 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{background:"#55efc4"}}>RACE AGAIN</button>
        </div>
      )}
    </GameShell>
  );
}