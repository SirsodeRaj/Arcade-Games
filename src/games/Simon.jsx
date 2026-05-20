import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function Simon({ onClose }) {
  const PADS = [
    { color: "#0984e3", glow: "#0984e3", label: "1" },
    { color: "#00b894", glow: "#00b894", label: "2" },
    { color: "#d63031", glow: "#d63031", label: "3" },
    { color: "#fdcb6e", glow: "#fdcb6e", label: "4" },
  ];
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [active, setActive] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle|showing|input|lost|won
  const [round, setRound] = useState(0);
  const [best, setBest] = useState(0);

  const flash = (idx, duration = 500) => new Promise(res => {
    setActive(idx);
    setTimeout(() => { setActive(null); setTimeout(res, 150); }, duration);
  });

  const showSequence = async (seq) => {
    setPhase("showing");
    await new Promise(r => setTimeout(r, 400));
    for (const idx of seq) await flash(idx, 500);
    setPhase("input");
    setPlayerSeq([]);
  };

  const startGame = async () => {
    setRound(0); setSequence([]); setPlayerSeq([]);
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first); setRound(1);
    await showSequence(first);
  };

  const pressedPad = async (idx) => {
    if (phase !== "input") return;
    await flash(idx, 200);
    const newSeq = [...playerSeq, idx];
    setPlayerSeq(newSeq);
    if (newSeq[newSeq.length - 1] !== sequence[newSeq.length - 1]) {
      setBest(b => Math.max(b, round - 1));
      setPhase("lost");
      return;
    }
    if (newSeq.length === sequence.length) {
      setPhase("showing");
      await new Promise(r => setTimeout(r, 600));
      const next = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(next); setRound(next.length);
      await showSequence(next);
    }
  };

  return (
    <GameShell title="Simon Says" icon="🔵" color="#0984e3" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-blue-300">{round}</div><div className="text-xs text-gray-500 font-mono">ROUND</div></div>
        <div className="text-center text-sm font-mono font-bold" style={{ color: phase === "input" ? "#55efc4" : phase === "lost" ? "#ff6b6b" : "#aaa" }}>
          {phase === "idle" ? "READY?" : phase === "showing" ? "WATCH..." : phase === "input" ? "YOUR TURN" : "WRONG!"}
        </div>
        <div className="text-center"><div className="text-xl font-black text-blue-300">{best}</div><div className="text-xs text-gray-500 font-mono">BEST</div></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {PADS.map((pad, i) => (
          <button key={i} onClick={() => pressedPad(i)} disabled={phase !== "input"}
            className="h-24 rounded-2xl border-2 transition-all duration-100 cursor-pointer"
            style={{
              background: active === i ? pad.color : `${pad.color}22`,
              borderColor: active === i ? pad.color : `${pad.color}44`,
              boxShadow: active === i ? `0 0 30px ${pad.glow}80, inset 0 0 20px ${pad.glow}40` : "none",
              transform: active === i ? "scale(0.95)" : "scale(1)",
            }} />
        ))}
      </div>
      {(phase === "idle" || phase === "lost") && (
        <div className="text-center">
          {phase === "lost" && <div className="text-red-400 font-black mb-2">💀 Wrong! Round {round}</div>}
          <button onClick={startGame} className="px-8 py-3 rounded-2xl font-black text-white cursor-pointer hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg, #0984e3, #74b9ff)" }}>
            {phase === "lost" ? "TRY AGAIN" : "START GAME"}
          </button>
        </div>
      )}
    </GameShell>
  );
}