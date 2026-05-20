import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function Blackjack({ onClose }) {
  const deck = () => { const s=["♠","♥","♦","♣"], r=["A","2","3","4","5","6","7","8","9","10","J","Q","K"]; return s.flatMap(suit=>r.map(rank=>({rank,suit}))); };
  const val = card => { if(["J","Q","K"].includes(card.rank)) return 10; if(card.rank==="A") return 11; return parseInt(card.rank); };
  const score = hand => { let s=hand.reduce((a,c)=>a+val(c),0), aces=hand.filter(c=>c.rank==="A").length; while(s>21&&aces-->0) s-=10; return s; };
  const isRed = s => s==="♥"||s==="♦";
  const [drawPile, setDrawPile] = useState(() => deck().sort(()=>Math.random()-0.5));
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle|playing|done
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(10);

  const deal = () => {
    const pile = deck().sort(()=>Math.random()-0.5);
    const p=[pile[0],pile[2]], d=[pile[1],pile[3]];
    setDrawPile(pile.slice(4)); setPlayer(p); setDealer(d);
    setPhase(score(p)===21?"done":"playing");
    if(score(p)===21) { setResult("blackjack"); setBalance(b=>b+Math.floor(bet*1.5)); }
    setBalance(b=>b-bet);
  };

  const hit = () => {
    const newCard = drawPile[0]; const newPlayer = [...player, newCard];
    setDrawPile(d=>d.slice(1)); setPlayer(newPlayer);
    if(score(newPlayer)>21) { setPhase("done"); setResult("bust"); }
    else if(score(newPlayer)===21) stand(newPlayer);
  };

  const stand = (finalHand) => {
    const ph = finalHand || player;
    let d = [...dealer], pile = [...drawPile];
    while(score(d)<17) { d=[...d,pile[0]]; pile=pile.slice(1); }
    setDealer(d); setDrawPile(pile); setPhase("done");
    const ps=score(ph), ds=score(d);
    if(ds>21||ps>ds) { setResult("win"); setBalance(b=>b+bet*2); }
    else if(ps===ds) { setResult("push"); setBalance(b=>b+bet); }
    else setResult("lose");
  };

  const CardUI = ({card,hidden}) => (
    <div className="w-12 h-17 rounded-lg border flex flex-col items-center justify-center text-center"
      style={{background:hidden?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.06)",borderColor:"rgba(255,255,255,0.18)",minHeight:68}}>
      {hidden ? <span className="text-gray-600 text-xl">🂠</span> : <>
        <div className="text-base font-black leading-none" style={{color:isRed(card.suit)?"#ff6b6b":"#fff"}}>{card.rank}</div>
        <div className="text-lg leading-none" style={{color:isRed(card.suit)?"#ff6b6b":"#fff"}}>{card.suit}</div>
      </>}
    </div>
  );

  const colorRes = r => r==="win"||r==="blackjack" ? "text-green-400" : r==="push" ? "text-yellow-400" : "text-red-400";
  const msgRes = r => ({win:"🏆 You win!",blackjack:"🎉 Blackjack!",push:"🤝 Push!",bust:"💥 Bust!",lose:"💀 Dealer wins"})[r];

  return (
    <GameShell title="Blackjack" icon="🂡" color="#fdcb6e" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-yellow-300">${balance}</div><div className="text-xs text-gray-500 font-mono">BALANCE</div></div>
        <div className="text-center"><div className="text-xl font-black text-yellow-300">${bet}</div><div className="text-xs text-gray-500 font-mono">BET</div></div>
      </div>
      {phase !== "idle" && (
        <>
          <div className="mb-3">
            <div className="text-xs text-gray-500 font-mono mb-2">DEALER {phase==="done"?`— ${score(dealer)}`:"— ?"}</div>
            <div className="flex gap-2 flex-wrap">
              {dealer.map((c,i)=><CardUI key={i} card={c} hidden={phase==="playing"&&i===1}/>)}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-gray-500 font-mono mb-2">YOU — {score(player)}</div>
            <div className="flex gap-2 flex-wrap">
              {player.map((c,i)=><CardUI key={i} card={c} hidden={false}/>)}
            </div>
          </div>
        </>
      )}
      {result && <div className={`text-center text-xl font-black mb-4 ${colorRes(result)}`}>{msgRes(result)}</div>}
      {phase==="idle" && <div className="text-center text-gray-500 font-mono text-sm mb-4 py-6">Place your bet and deal!</div>}
      {phase==="playing" ? (
        <div className="flex gap-3">
          <button onClick={hit} className="flex-1 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{background:"#fdcb6e"}}>HIT</button>
          <button onClick={()=>stand()} className="flex-1 py-3 rounded-2xl font-black text-white border border-yellow-400/40 bg-yellow-400/10 cursor-pointer hover:scale-105 transition-all">STAND</button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2 justify-center">
            {[5,10,25,50].map(b=>(
              <button key={b} onClick={()=>setBet(b)} disabled={b>balance}
                className="px-4 py-2 rounded-xl font-black text-sm border cursor-pointer transition-all hover:scale-105 disabled:opacity-30"
                style={{background:bet===b?"rgba(253,203,110,0.3)":"rgba(255,255,255,0.05)",borderColor:bet===b?"#fdcb6e":"rgba(255,255,255,0.1)",color:bet===b?"#fdcb6e":"white"}}>${b}</button>
            ))}
          </div>
          <button onClick={deal} disabled={bet>balance} className="w-full py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all disabled:opacity-30" style={{background:"linear-gradient(135deg,#fdcb6e,#f9ca24)"}}>
            {phase==="idle"?"DEAL":"DEAL AGAIN"}
          </button>
        </div>
      )}
    </GameShell>
  );
}