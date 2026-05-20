import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function ColorMatch({ onClose }) {
  const randHex = () => "#" + Array.from({length:6}, () => "0123456789ABCDEF"[Math.floor(Math.random()*16)]).join("");
  const [target, setTarget] = useState(randHex);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [streak, setStreak] = useState(0);

  const genOptions = (t) => {
    const opts = [t];
    while (opts.length < 6) {
      const c = randHex();
      if (!opts.includes(c)) opts.push(c);
    }
    return opts.sort(() => Math.random() - 0.5);
  };

  useEffect(() => { setOptions(genOptions(target)); setSelected(null); }, [target]);

  const pick = (c) => {
    if (selected) return;
    setSelected(c);
    const correct = c === target;
    if (correct) { setScore(s => s + 10 + streak * 2); setStreak(s => s + 1); }
    else setStreak(0);
    setTimeout(() => {
      const t = randHex();
      setTarget(t);
      setRound(r => r + 1);
    }, 1000);
  };

  return (
    <GameShell title="Color Match" icon="🎨" color="#fd9644" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-orange-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className="text-xl font-black text-orange-300">#{round}</div><div className="text-xs text-gray-500 font-mono">ROUND</div></div>
        <div className="text-center"><div className="text-xl font-black text-orange-300">{streak}🔥</div><div className="text-xs text-gray-500 font-mono">STREAK</div></div>
      </div>
      <div className="text-center mb-6">
        <div className="text-xs text-gray-500 font-mono mb-2">MATCH THIS COLOR</div>
        <div className="w-24 h-24 rounded-2xl mx-auto border-2 border-white/20 shadow-lg" style={{ background: target, boxShadow: `0 0 30px ${target}80` }} />
        <div className="mt-2 font-mono text-gray-400 text-sm tracking-widest">{target}</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((c, i) => (
          <button key={i} onClick={() => pick(c)} disabled={!!selected}
            className={`h-12 rounded-xl border-2 transition-all duration-200 cursor-pointer
              ${selected === c ? c === target ? "border-green-400 scale-110 shadow-[0_0_20px_rgba(0,255,100,0.4)]" : "border-red-400 opacity-60" :
                selected && c === target ? "border-green-400 scale-110" : "border-white/10 hover:scale-105 hover:border-white/30"}`}
            style={{ background: c }} />
        ))}
      </div>
      {selected && (
        <div className={`text-center mt-3 text-sm font-black ${selected === target ? "text-green-400" : "text-red-400"}`}>
          {selected === target ? `✅ Correct! +${10 + Math.max(0, streak-1) * 2} pts` : `❌ Wrong! That was ${target}`}
        </div>
      )}
    </GameShell>
  );
}