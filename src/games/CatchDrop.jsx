import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function CatchDrop({ onClose }) {
  const W=340, H=280, BASKET_W=60, BASKET_H=16;
  const stateRef = useRef({basket:W/2,items:[],score:0,lives:3,status:"idle",tick:0,idCounter:0});
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseX = useRef(W/2);
  const [display, setDisplay] = useState({score:0,lives:3,status:"idle"});

  const ITEMS=[
    {emoji:"🍎",good:true,color:"#ff6b6b"},{emoji:"🍊",good:true,color:"#fd9644"},
    {emoji:"🍋",good:true,color:"#ffe66d"},{emoji:"🍇",good:true,color:"#a29bfe"},
    {emoji:"💣",good:false,color:"#2d3436"},{emoji:"☠️",good:false,color:"#636e72"},
  ];

  const draw = useCallback(()=>{
    const cv=canvasRef.current; if(!cv) return;
    const ctx=cv.getContext("2d"); const s=stateRef.current;
    ctx.fillStyle="#04040c"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(255,255,255,0.02)"; ctx.lineWidth=1;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    s.items.forEach(it=>{
      ctx.font="24px serif"; ctx.textAlign="center";
      ctx.shadowColor=it.color; ctx.shadowBlur=10;
      ctx.fillText(it.emoji,it.x,it.y); ctx.shadowBlur=0;
    });
    // basket
    const bx=s.basket-BASKET_W/2;
    const grad=ctx.createLinearGradient(bx,H-BASKET_H,bx+BASKET_W,H);
    grad.addColorStop(0,"#f9ca24"); grad.addColorStop(1,"#e17055");
    ctx.fillStyle=grad; ctx.shadowColor="#f9ca24"; ctx.shadowBlur=12;
    ctx.beginPath(); ctx.roundRect(bx,H-BASKET_H,BASKET_W,BASKET_H,6); ctx.fill(); ctx.shadowBlur=0;
  },[]);

  const loop=useCallback(()=>{
    const s=stateRef.current; if(s.status!=="running"){draw();return;}
    s.tick++;
    s.basket+=(mouseX.current-s.basket)*0.2; s.basket=Math.max(BASKET_W/2,Math.min(W-BASKET_W/2,s.basket));
    if(s.tick%55===0){
      const t=ITEMS[Math.floor(Math.random()*ITEMS.length)];
      s.items.push({...t,x:20+Math.random()*(W-40),y:-10,vy:2+Math.random()*1.5,id:s.idCounter++});
    }
    s.items=s.items.map(it=>({...it,y:it.y+it.vy}));
    s.items.forEach(it=>{
      if(it.y>H-BASKET_H-12&&it.y<H&&Math.abs(it.x-s.basket)<BASKET_W/2+8){
        it.caught=true;
        if(it.good){s.score+=10;setDisplay(d=>({...d,score:s.score}));}
        else{s.lives--;setDisplay(d=>({...d,lives:s.lives}));if(s.lives<=0){s.status="lost";setDisplay(d=>({...d,status:"lost"}));return;}}
      }
      if(it.y>H+10&&!it.caught&&it.good){s.lives--;setDisplay(d=>({...d,lives:s.lives}));if(s.lives<=0){s.status="lost";setDisplay(d=>({...d,status:"lost"}));}}
    });
    s.items=s.items.filter(it=>it.y<=H+20&&!it.caught);
    draw(); rafRef.current=requestAnimationFrame(loop);
  },[draw]);

  useEffect(()=>{draw();return()=>cancelAnimationFrame(rafRef.current);},[draw]);

  const onMouse=e=>{const rect=canvasRef.current.getBoundingClientRect();mouseX.current=(e.clientX-rect.left)*(W/rect.width);};
  const onTouch=e=>{e.preventDefault();const rect=canvasRef.current.getBoundingClientRect();mouseX.current=(e.touches[0].clientX-rect.left)*(W/rect.width);};

  const startGame=()=>{
    const s=stateRef.current; s.basket=W/2;s.items=[];s.score=0;s.lives=3;s.status="running";s.tick=0;s.idCounter=0;
    setDisplay({score:0,lives:3,status:"running"});
    cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop);
  };

  return (
    <GameShell title="Catch & Drop" icon="🧺" color="#f9ca24" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-yellow-300">{display.score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-xs font-mono text-gray-500 self-center">{display.status==="running"?"Move mouse/touch":"Catch 🍎 dodge 💣"}</div>
        <div className="text-center"><div className="text-xl font-black text-yellow-300">{"❤️".repeat(Math.max(0,display.lives))}</div><div className="text-xs text-gray-500 font-mono">LIVES</div></div>
      </div>
      <canvas ref={canvasRef} width={W} height={H} onMouseMove={onMouse} onTouchMove={onTouch}
        className="rounded-2xl border border-yellow-400/20 w-full" style={{maxHeight:260,touchAction:"none"}} />
      {(display.status==="idle"||display.status==="lost")&&(
        <button onClick={startGame} className="w-full mt-3 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{background:"linear-gradient(135deg,#f9ca24,#e17055)"}}>
          {display.status==="idle"?"▶ START":"PLAY AGAIN"}
        </button>
      )}
    </GameShell>
  );
}