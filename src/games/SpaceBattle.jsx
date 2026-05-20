import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function SpaceBattle({ onClose }) {
  const W = 360, H = 340;
  const stateRef = useRef({ ship: W / 2, bullets: [], asteroids: [], score: 0, lives: 3, status: "idle", tick: 0 });
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const keysRef = useRef({});
  const [display, setDisplay] = useState({ score: 0, lives: 3, status: "idle" });

  const draw = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    const s = stateRef.current;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#04040c"; ctx.fillRect(0, 0, W, H);
    // stars
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137.5 + s.tick * 0.3) % W;
      const sy = (i * 97.3 + s.tick * 0.15) % H;
      ctx.fillRect(sx, sy, 1, 1);
    }
    // bullets
    s.bullets.forEach(b => {
      ctx.fillStyle = "#74b9ff";
      ctx.shadowColor = "#74b9ff"; ctx.shadowBlur = 8;
      ctx.fillRect(b.x - 2, b.y - 8, 4, 8);
      ctx.shadowBlur = 0;
    });
    // asteroids
    s.asteroids.forEach(a => {
      ctx.fillStyle = "#b2bec3";
      ctx.shadowColor = "#636e72"; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    });
    // ship
    ctx.fillStyle = "#74b9ff";
    ctx.shadowColor = "#74b9ff"; ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(s.ship, H - 30);
    ctx.lineTo(s.ship - 14, H - 10);
    ctx.lineTo(s.ship + 14, H - 10);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "running") { draw(); return; }
    s.tick++;
    // move ship
    if (keysRef.current["ArrowLeft"]) s.ship = Math.max(14, s.ship - 4);
    if (keysRef.current["ArrowRight"]) s.ship = Math.min(W - 14, s.ship + 4);
    // bullets
    s.bullets = s.bullets.map(b => ({ ...b, y: b.y - 7 })).filter(b => b.y > 0);
    // spawn asteroids
    if (s.tick % Math.max(25, 60 - Math.floor(s.score / 50)) === 0) {
      s.asteroids.push({ x: 10 + Math.random() * (W - 20), y: -20, r: 8 + Math.random() * 16, vy: 1.5 + Math.random() * 2 });
    }
    s.asteroids = s.asteroids.map(a => ({ ...a, y: a.y + a.vy }));
    // collision: bullet-asteroid
    s.bullets = s.bullets.filter(b => {
      const hit = s.asteroids.findIndex(a => Math.hypot(b.x - a.x, b.y - a.y) < a.r + 4);
      if (hit !== -1) { s.asteroids.splice(hit, 1); s.score += 10; setDisplay(d => ({ ...d, score: s.score })); return false; }
      return true;
    });
    // collision: asteroid-ship
    s.asteroids = s.asteroids.filter(a => {
      if (a.y + a.r > H) return false;
      if (Math.hypot(a.x - s.ship, a.y - (H - 20)) < a.r + 12) {
        s.lives--;
        setDisplay(d => ({ ...d, lives: s.lives }));
        if (s.lives <= 0) { s.status = "lost"; setDisplay(d => ({ ...d, status: "lost" })); }
        return false;
      }
      return true;
    });
    draw();
    if (s.status === "running") rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  useEffect(() => {
    const onKey = e => {
      keysRef.current[e.key] = e.type === "keydown";
      if (e.type === "keydown" && e.key === " " && stateRef.current.status === "running") {
        e.preventDefault();
        stateRef.current.bullets.push({ x: stateRef.current.ship, y: H - 30 });
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    draw();
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  const onTouch = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const tx = (e.touches[0].clientX - rect.left) * (W / rect.width);
    stateRef.current.ship = Math.max(14, Math.min(W - 14, tx));
    if (stateRef.current.status === "running") stateRef.current.bullets.push({ x: stateRef.current.ship, y: H - 30 });
  };

  const startGame = () => {
    const s = stateRef.current;
    s.ship = W / 2; s.bullets = []; s.asteroids = []; s.score = 0; s.lives = 3; s.status = "running"; s.tick = 0;
    setDisplay({ score: 0, lives: 3, status: "running" });
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  };

  return (
    <GameShell title="Space Battle" icon="🚀" color="#74b9ff" onClose={onClose}>
      <div className="flex justify-between mb-2 px-1">
        <div className="text-center"><div className="text-xl font-black text-blue-300">{display.score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-xs font-mono text-gray-500 self-center">{display.status === "running" ? "← → MOVE · SPACE SHOOT" : ""}</div>
        <div className="text-center"><div className="text-xl font-black text-blue-300">{"🚀".repeat(display.lives)}</div><div className="text-xs text-gray-500 font-mono">LIVES</div></div>
      </div>
      <canvas ref={canvasRef} width={W} height={H} onTouchStart={onTouch}
        className="rounded-2xl border border-white/10 w-full" style={{ maxHeight: 340 }} />
      {(display.status === "idle" || display.status === "lost") && (
        <button onClick={startGame} className="w-full mt-3 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg, #74b9ff, #0984e3)" }}>
          {display.status === "idle" ? "▶ LAUNCH" : `RETRY — Score: ${display.score}`}
        </button>
      )}
    </GameShell>
  );
}