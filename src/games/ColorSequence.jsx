import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function ColorSequence({ onClose }) {
  const COLORS = [
    {id:"r",bg:"#ff6b6b",label:"RED"},
    {id:"g",bg:"#00b894",label:"GRN"},
    {id:"b",bg:"#74b9ff",label:"BLU"},
    {id:"y",bg:"#ffe66d",label:"YLW"},
  ];
  const [seq, setSeq] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle|showing|recall|win|lose
  const [lit, setLit] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const show = useCallback((sequence) => {
    setPhase("showing"); setPlayerSeq([]);
    let i = 0;
    const next = () => {
      if (i >= sequence.length) { setTimeout(() => setPhase("recall"), 400); return; }
      setLit(sequence[i]); i++;
      setTimeout(() => { setLit(null); setTimeout(next, 300); }, 550);
    };
    setTimeout(next, 400);
  }, []);

  const startRound = useCallback((prevSeq) => {
    const newSeq = [...prevSeq, Math.floor(Math.random() * 4)];
    setSeq(newSeq); setRound(newSeq.length); show(newSeq);
  }, [show]);

  const start = () => { setScore(0); startRound([]); };

  const press = (idx) => {
    if (phase !== "recall") return;
    const newP = [...playerSeq, idx];
    setPlayerSeq(newP);
    if (newP[newP.length-1] !== seq[newP.length-1]) {
      setBest(b => Math.max(b, round-1)); setPhase("lose"); return;
    }
    if (newP.length === seq.length) {
      const pts = round * 10; setScore(s => s + pts); setPhase("win");
      setTimeout(() => startRound(seq), 700);
    }
  };

  return (
    <GameShell title="Color Sequence" icon="🌈" color="#ff7675" onClose={onClose}>
      <div className="flex justify-center gap-8 mb-4">
        {[["ROUND",round,"#ff7675"],["SCORE",score,"#ffe66d"],["BEST",best,"#55efc4"]].map(([l,v,c])=>(
          <div key={l} className="text-center"><div className="text-xl font-black" style={{color:c}}>{v}</div><div className="text-xs text-gray-500 font-mono">{l}</div></div>
        ))}
      </div>
      <div className="text-center text-xs font-mono mb-4" style={{color: phase==="showing"?"#ffe66d":phase==="recall"?"#55efc4":phase==="win"?"#00b894":phase==="lose"?"#ff6b6b":"#555"}}>
        {phase==="idle"?"Press START":phase==="showing"?"Watch carefully...":phase==="recall"?"Repeat the sequence!":phase==="win"?"✅ Correct!":"❌ Wrong!"}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {COLORS.map((c,i)=>(
          <button key={c.id} onClick={()=>press(i)} disabled={phase!=="recall"}
            className="h-20 rounded-2xl border-2 font-black text-sm tracking-widest cursor-pointer transition-all duration-150 disabled:cursor-not-allowed"
            style={{
              background: lit===i ? c.bg : `${c.bg}22`,
              borderColor: lit===i ? c.bg : `${c.bg}55`,
              color: lit===i ? "#000" : c.bg,
              boxShadow: lit===i ? `0 0 30px ${c.bg}` : "none",
              transform: lit===i ? "scale(1.06)" : "scale(1)",
            }}>{c.label}</button>
        ))}
      </div>
      {(phase==="idle"||phase==="lose") && (
        <button onClick={start} className="w-full py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{background:"linear-gradient(135deg,#ff7675,#d63031)"}}>
          {phase==="idle"?"▶ START":"TRY AGAIN"}
        </button>
      )}
    </GameShell>
  );
}