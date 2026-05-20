import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function Breakout({ onClose }) {
  const W = 360, H = 320, BRICK_COLS = 8, BRICK_ROWS = 5;
  const BRICK_W = W / BRICK_COLS, BRICK_H = 18, PAD_W = 64, PAD_H = 8, BALL_R = 7;
  const COLORS = ["#e84393","#ff6b6b","#fd9644","#ffe66d","#a8e063","#55efc4","#74b9ff","#a29bfe"];

  const makeBricks = () =>
    Array.from({ length: BRICK_ROWS * BRICK_COLS }, (_, i) => ({
      id: i, col: i % BRICK_COLS, row: Math.floor(i / BRICK_COLS), alive: true,
    }));

  const stateRef = useRef({
    ball: { x: W / 2, y: H - 60, vx: 2.8, vy: -3 },
    pad: W / 2 - PAD_W / 2,
    bricks: makeBricks(),
    status: "idle", score: 0, lives: 3,
  });
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [display, setDisplay] = useState({ score: 0, lives: 3, status: "idle" });

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const s = stateRef.current;
    ctx.clearRect(0, 0, W, H);
    // bg
    ctx.fillStyle = "rgba(4,4,12,1)";
    ctx.fillRect(0, 0, W, H);
    // bricks
    s.bricks.forEach(b => {
      if (!b.alive) return;
      const color = COLORS[b.row % COLORS.length];
      ctx.fillStyle = color + "cc";
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fillRect(b.col * BRICK_W + 2, b.row * BRICK_H + 24 + 2, BRICK_W - 4, BRICK_H - 4);
    });
    ctx.shadowBlur = 0;
    // pad
    ctx.fillStyle = "#e84393";
    ctx.shadowColor = "#e84393";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(s.pad, H - 20, PAD_W, PAD_H, 4);
    ctx.fill();
    ctx.shadowBlur = 0;
    // ball
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    // grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.02)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "running") { draw(); return; }
    const b = s.ball;
    b.x += b.vx; b.y += b.vy;
    // walls
    if (b.x - BALL_R < 0) { b.x = BALL_R; b.vx = Math.abs(b.vx); }
    if (b.x + BALL_R > W) { b.x = W - BALL_R; b.vx = -Math.abs(b.vx); }
    if (b.y - BALL_R < 0) { b.y = BALL_R; b.vy = Math.abs(b.vy); }
    // pad
    if (b.y + BALL_R >= H - 20 && b.y + BALL_R <= H - 12 && b.x >= s.pad && b.x <= s.pad + PAD_W) {
      b.vy = -Math.abs(b.vy);
      b.vx += ((b.x - (s.pad + PAD_W / 2)) / (PAD_W / 2)) * 1.5;
      b.vx = Math.max(-5, Math.min(5, b.vx));
    }
    // lost ball
    if (b.y + BALL_R > H) {
      s.lives--;
      if (s.lives <= 0) { s.status = "lost"; setDisplay({ score: s.score, lives: 0, status: "lost" }); return; }
      b.x = W / 2; b.y = H - 60; b.vx = 2.8; b.vy = -3;
      setDisplay(d => ({ ...d, lives: s.lives }));
    }
    // bricks
    s.bricks.forEach(brk => {
      if (!brk.alive) return;
      const bx = brk.col * BRICK_W, by = brk.row * BRICK_H + 24;
      if (b.x + BALL_R > bx && b.x - BALL_R < bx + BRICK_W && b.y + BALL_R > by && b.y - BALL_R < by + BRICK_H) {
        brk.alive = false;
        s.score += 10;
        if (Math.abs(b.x - bx) < 4 || Math.abs(b.x - (bx + BRICK_W)) < 4) b.vx *= -1; else b.vy *= -1;
        setDisplay(d => ({ ...d, score: s.score }));
      }
    });
    if (s.bricks.every(b => !b.alive)) { s.status = "won"; setDisplay(d => ({ ...d, status: "won" })); return; }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    const onKey = e => {
      const s = stateRef.current;
      if (s.status !== "running") return;
      if (e.key === "ArrowLeft") s.pad = Math.max(0, s.pad - 22);
      if (e.key === "ArrowRight") s.pad = Math.min(W - PAD_W, s.pad + 22);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onMouse = e => {
    const s = stateRef.current;
    if (s.status !== "running") return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    s.pad = Math.max(0, Math.min(W - PAD_W, mx - PAD_W / 2));
  };

  const startGame = () => {
    const s = stateRef.current;
    s.ball = { x: W / 2, y: H - 60, vx: 2.8, vy: -3 };
    s.pad = W / 2 - PAD_W / 2;
    s.bricks = makeBricks();
    s.score = 0; s.lives = 3; s.status = "running";
    setDisplay({ score: 0, lives: 3, status: "running" });
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  };

  return (
    <GameShell title="Breakout" icon="🧱" color="#e84393" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-pink-400">{display.score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center text-xs font-mono" style={{ color: display.status === "won" ? "#a8e063" : display.status === "lost" ? "#ff6b6b" : "#aaa" }}>
          {display.status === "idle" ? "← → to move" : display.status === "running" ? "MOVE MOUSE / ← →" : display.status === "won" ? "🏆 YOU WIN!" : "💀 GAME OVER"}
        </div>
        <div className="text-center"><div className="text-xl font-black text-pink-400">{"❤️".repeat(display.lives)}</div><div className="text-xs text-gray-500 font-mono">LIVES</div></div>
      </div>
      <canvas ref={canvasRef} width={W} height={H} onMouseMove={onMouse}
        className="rounded-2xl border border-white/10 w-full" style={{ maxHeight: 320, cursor: "none" }} />
      {(display.status === "idle" || display.status === "won" || display.status === "lost") && (
        <button onClick={startGame} className="w-full mt-3 py-3 rounded-2xl font-black text-white cursor-pointer hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg, #e84393, #fd79a8)" }}>
          {display.status === "idle" ? "▶ START" : "PLAY AGAIN"}
        </button>
      )}
    </GameShell>
  );
}