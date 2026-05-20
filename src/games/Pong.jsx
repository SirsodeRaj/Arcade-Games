import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function Pong({ onClose }) {
  const W = 360, H = 280, PAD_W = 10, PAD_H = 56, BALL_R = 7, CPU_SPEED = 2.8;
  const stateRef = useRef({
    ball: { x: W/2, y: H/2, vx: 3.2, vy: 2.2 },
    player: H/2 - PAD_H/2, cpu: H/2 - PAD_H/2,
    score: { p: 0, c: 0 }, status: "idle",
  });
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseY = useRef(H/2);
  const [display, setDisplay] = useState({ p: 0, c: 0, status: "idle" });

  const draw = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); const s = stateRef.current;
    ctx.fillStyle = "#04040c"; ctx.fillRect(0, 0, W, H);
    // centre line
    ctx.setLineDash([6, 8]); ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke(); ctx.setLineDash([]);
    // player pad
    ctx.fillStyle = "#00cec9"; ctx.shadowColor = "#00cec9"; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.roundRect(8, s.player, PAD_W, PAD_H, 5); ctx.fill();
    // cpu pad
    ctx.fillStyle = "#ff6b6b"; ctx.shadowColor = "#ff6b6b";
    ctx.beginPath(); ctx.roundRect(W - 18, s.cpu, PAD_W, PAD_H, 5); ctx.fill();
    ctx.shadowBlur = 0;
    // ball
    ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI*2);
    ctx.fillStyle = "#fff"; ctx.shadowColor = "#fff"; ctx.shadowBlur = 16; ctx.fill(); ctx.shadowBlur = 0;
    // scores
    ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.font = "bold 48px monospace";
    ctx.textAlign = "center"; ctx.fillText(s.score.p, W/4, 56); ctx.fillText(s.score.c, 3*W/4, 56);
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current; if (s.status !== "running") { draw(); return; }
    const b = s.ball;
    // move player pad toward mouse
    const targetP = mouseY.current - PAD_H/2;
    s.player += (targetP - s.player) * 0.18;
    s.player = Math.max(0, Math.min(H - PAD_H, s.player));
    // cpu AI
    const cpuCenter = s.cpu + PAD_H/2;
    if (cpuCenter < b.y - 4) s.cpu = Math.min(H - PAD_H, s.cpu + CPU_SPEED);
    else if (cpuCenter > b.y + 4) s.cpu = Math.max(0, s.cpu - CPU_SPEED);
    b.x += b.vx; b.y += b.vy;
    if (b.y - BALL_R < 0) { b.y = BALL_R; b.vy = Math.abs(b.vy); }
    if (b.y + BALL_R > H) { b.y = H - BALL_R; b.vy = -Math.abs(b.vy); }
    // player paddle
    if (b.x - BALL_R < 18 && b.y > s.player && b.y < s.player + PAD_H) {
      b.x = 18 + BALL_R; b.vx = Math.abs(b.vx) * 1.04;
      b.vy += ((b.y - (s.player + PAD_H/2)) / (PAD_H/2)) * 1.5;
      b.vx = Math.min(b.vx, 7);
    }
    // cpu paddle
    if (b.x + BALL_R > W - 18 && b.y > s.cpu && b.y < s.cpu + PAD_H) {
      b.x = W - 18 - BALL_R; b.vx = -Math.abs(b.vx) * 1.02;
      b.vy += ((b.y - (s.cpu + PAD_H/2)) / (PAD_H/2)) * 1.2;
    }
    // score
    if (b.x < 0) { s.score.c++; setDisplay(d => ({ ...d, c: s.score.c })); resetBall(s, 1); }
    if (b.x > W) { s.score.p++; setDisplay(d => ({ ...d, p: s.score.p })); resetBall(s, -1); }
    if (s.score.p >= 7 || s.score.c >= 7) { s.status = "done"; setDisplay(d => ({ ...d, status: "done" })); return; }
    draw(); rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  const resetBall = (s, dir) => {
    s.ball = { x: W/2, y: H/2, vx: 3.2 * dir, vy: (Math.random() - 0.5) * 4 };
  };

  useEffect(() => { draw(); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  const onMouseMove = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseY.current = (e.clientY - rect.top) * (H / rect.height);
  };
  const onTouchMove = e => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    mouseY.current = (e.touches[0].clientY - rect.top) * (H / rect.height);
  };

  const startGame = () => {
    const s = stateRef.current;
    s.score = { p: 0, c: 0 }; s.player = H/2 - PAD_H/2; s.cpu = H/2 - PAD_H/2;
    s.ball = { x: W/2, y: H/2, vx: 3.2, vy: 2.2 }; s.status = "running";
    setDisplay({ p: 0, c: 0, status: "running" });
    cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(loop);
  };

  const winner = display.status === "done" ? (stateRef.current.score.p >= 7 ? "YOU WIN 🏆" : "CPU WINS 💀") : "";

  return (
    <GameShell title="Pong" icon="🏓" color="#00cec9" onClose={onClose}>
      <div className="flex justify-between mb-3 px-2">
        <div className="text-center"><div className="text-xl font-black text-teal-300">{display.p}</div><div className="text-xs text-gray-500 font-mono">YOU</div></div>
        <div className="text-xs font-mono text-gray-500 self-center">{display.status === "running" ? "Move mouse / drag to play" : display.status === "done" ? winner : "First to 7 wins!"}</div>
        <div className="text-center"><div className="text-xl font-black text-red-300">{display.c}</div><div className="text-xs text-gray-500 font-mono">CPU</div></div>
      </div>
      <canvas ref={canvasRef} width={W} height={H} onMouseMove={onMouseMove} onTouchMove={onTouchMove}
        className="rounded-2xl border border-teal-500/20 w-full" style={{ maxHeight: 260, touchAction: "none" }} />
      {(display.status === "idle" || display.status === "done") && (
        <button onClick={startGame} className="w-full mt-3 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg,#00cec9,#00b894)" }}>
          {display.status === "idle" ? "▶ START MATCH" : "REMATCH"}
        </button>
      )}
    </GameShell>
  );
}