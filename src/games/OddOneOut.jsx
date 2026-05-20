import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function OddOneOut({ onClose }) {
  const EMOJI_SETS = [
    ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯"],
    ["🍎","🍊","🍋","🍇","🍓","🫐","🍑","🍒","🥭","🍍"],
    ["⚽","🏀","🏈","⚾","🎾","🏐","🏉","🥏","🎱","🏓"],
    ["🚗","🚕","🚙","🚌","🚎","🏎","🚓","🚑","🚒","🛻"],
    ["🌹","🌺","🌸","🌼","🌻","🌷","💐","🌱","🌿","🍀"],
    ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😊"],
  ];

  const genRound = useCallback((difficulty=1) => {
    const set = EMOJI_SETS[Math.floor(Math.random()*EMOJI_SETS.length)];
    const main = set[Math.floor(Math.random()*set.length)];
    let odd;
    do { odd = EMOJI_SETS[Math.floor(Math.random()*EMOJI_SETS.length)][Math.floor(Math.random()*10)]; } while(odd===main);
    const count = 4+difficulty*2; // 6-14 tiles
    const tiles = Array(Math.min(count,12)).fill(main);
    const oddIdx = Math.floor(Math.random()*tiles.length);
    tiles[oddIdx] = odd;
    return { tiles, oddIdx };
  },[]);

  const [round, setRound] = useState(1);
  const [current, setCurrent] = useState(()=>genRound(1));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    const r = round + 1;
    setRound(r); setCurrent(genRound(Math.min(Math.floor(r/3),4))); setSelected(null); setTimeLeft(Math.max(4,8-Math.floor(r/4)));
  }, [round, genRound]);

  useEffect(()=>{
    clearInterval(timerRef.current); if(selected!==null) return;
    timerRef.current=setInterval(()=>setTimeLeft(t=>{
      if(t<=1){clearInterval(timerRef.current);setSelected(-1);setStreak(0);setTimeout(next,900);return 0;}
      return t-1;
    }),1000);
    return ()=>clearInterval(timerRef.current);
  },[selected,next]);

  const pick = i => {
    if(selected!==null) return;
    clearInterval(timerRef.current); setSelected(i);
    if(i===current.oddIdx){const pts=15+streak*5;setScore(s=>s+pts);setStreak(s=>s+1);}else setStreak(0);
    setTimeout(next,800);
  };

  const cols = current.tiles.length <= 6 ? 3 : current.tiles.length <= 9 ? 3 : 4;

  return (
    <GameShell title="Odd One Out" icon="🔍" color="#74b9ff" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-blue-300">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className={`text-xl font-black ${timeLeft<=3?"text-red-400":"text-blue-300"}`}>{timeLeft}s</div><div className="text-xs text-gray-500 font-mono">TIME</div></div>
        <div className="text-center"><div className="text-xl font-black text-blue-300">{streak}🔥</div><div className="text-xs text-gray-500 font-mono">STREAK</div></div>
      </div>
      <div className="text-center text-xs font-mono text-gray-500 mb-3">Round {round} — Find the one that doesn't belong!</div>
      <div className="grid gap-2 mx-auto w-fit mb-4" style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>
        {current.tiles.map((em,i)=>{
          const isOdd=i===current.oddIdx, isPicked=i===selected;
          return (
            <button key={i} onClick={()=>pick(i)}
              className={`w-16 h-16 rounded-2xl text-3xl border-2 cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center
                ${selected!==null ? isOdd?"border-green-400 bg-green-400/20":isPicked?"border-red-400 bg-red-400/20":"border-white/05 opacity-40" : "border-white/10 bg-white/5 hover:border-blue-400/50 hover:bg-blue-400/10"}`}
              style={{boxShadow:selected!==null&&isOdd?"0 0 16px rgba(0,184,148,0.5)":"none"}}>
              {em}
            </button>
          );
        })}
      </div>
      {selected!==null&&<div className={`text-center text-sm font-black ${selected===current.oddIdx?"text-green-400":selected===-1?"text-gray-400":"text-red-400"}`}>
        {selected===current.oddIdx?`✅ Found it! +${15+Math.max(0,streak-1)*5}`:selected===-1?"⏰ Too slow!":"❌ Wrong one!"}
      </div>}
    </GameShell>
  );
}