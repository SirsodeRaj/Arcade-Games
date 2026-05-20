import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function SlidePuzzle({ onClose }) {
  const SIZE = 3, TOTAL = SIZE * SIZE;
  const solved = Array.from({length:TOTAL},(_,i)=>i);
  const isSolvable = tiles => { let inv=0; const arr=tiles.filter(x=>x!==TOTAL-1); for(let i=0;i<arr.length;i++) for(let j=i+1;j<arr.length;j++) if(arr[i]>arr[j]) inv++; return inv%2===0; };
  const genBoard = () => { let t; do { t=[...solved].sort(()=>Math.random()-0.5); } while(!isSolvable(t)); return t; };
  const [tiles, setTiles] = useState(genBoard);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(null);
  const won = tiles.every((t,i)=>t===i);

  const click = idx => {
    const blank = tiles.indexOf(TOTAL-1);
    const r=Math.floor(idx/SIZE), c=idx%SIZE, br=Math.floor(blank/SIZE), bc=blank%SIZE;
    if(Math.abs(r-br)+Math.abs(c-bc)!==1) return;
    const nt=[...tiles]; [nt[idx],nt[blank]]=[nt[blank],nt[idx]];
    setTiles(nt); setMoves(m=>m+1);
    if(nt.every((t,i)=>t===i)) setBest(b=>b===null?moves+1:Math.min(b,moves+1));
  };

  const reset = () => { setTiles(genBoard()); setMoves(0); };

  const emoji = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","　"];

  return (
    <GameShell title="Slide Puzzle" icon="🧩" color="#a29bfe" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-purple-300">{moves}</div><div className="text-xs text-gray-500 font-mono">MOVES</div></div>
        <div className="text-center"><div className="text-xl font-black text-purple-300">{best ?? "—"}</div><div className="text-xs text-gray-500 font-mono">BEST</div></div>
      </div>
      {won && <div className="text-center text-xl font-black text-green-400 mb-4">🏆 Solved in {moves} moves!</div>}
      <div className="grid gap-2 mx-auto w-fit mb-4" style={{gridTemplateColumns:`repeat(${SIZE},1fr)`}}>
        {tiles.map((t,i)=>(
          <button key={i} onClick={()=>click(i)} disabled={won}
            className={`w-20 h-20 rounded-2xl font-black text-2xl border transition-all duration-150 cursor-pointer
              ${t===TOTAL-1?"opacity-0 pointer-events-none":won?"border-purple-400 bg-purple-400/20":"border-white/10 bg-white/5 hover:bg-purple-400/20 hover:border-purple-400/40 hover:scale-105 active:scale-95"}`}
            style={{textShadow:t!==TOTAL-1?"0 0 10px #a29bfe":"none",color:"#a29bfe"}}>
            {t!==TOTAL-1?t+1:""}
          </button>
        ))}
      </div>
      <button onClick={reset} className="w-full py-2 rounded-xl text-xs font-mono text-gray-400 bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/10">SHUFFLE NEW</button>
    </GameShell>
  );
}