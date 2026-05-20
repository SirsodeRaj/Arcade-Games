import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function Snake({ onClose }) {
  const COLS = 20, ROWS = 16, CELL = 18;
  const [snake, setSnake] = useState([[10, 8], [9, 8], [8, 8]]);
  const [food, setFood] = useState([15, 8]);
  const [dir, setDir] = useState([1, 0]);
  const [nextDir, setNextDir] = useState([1, 0]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | running | dead
  const intervalRef = useRef(null);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const dirRef = useRef(dir);
  const nextDirRef = useRef(nextDir);
  const scoreRef = useRef(score);

  const randFood = (s) => {
    let f;
    do { f = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)]; }
    while (s.some(([x, y]) => x === f[0] && y === f[1]));
    return f;
  };

  useEffect(() => {
    snakeRef.current = snake;
    foodRef.current = food;
    dirRef.current = dir;
    nextDirRef.current = nextDir;
    scoreRef.current = score;
  });

  useEffect(() => {
    const handleKey = (e) => {
      const map = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      const cur = dirRef.current;
      if (d[0] === -cur[0] && d[1] === -cur[1]) return;
      nextDirRef.current = d;
      setNextDir(d);
      if (status === "idle") startGame();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status]);

  const startGame = () => {
    const initSnake = [[10, 8], [9, 8], [8, 8]];
    const initFood = randFood(initSnake);
    setSnake(initSnake); setFood(initFood);
    setDir([1,0]); setNextDir([1,0]);
    setScore(0); setStatus("running");
    snakeRef.current = initSnake; foodRef.current = initFood;
    dirRef.current = [1,0]; nextDirRef.current = [1,0]; scoreRef.current = 0;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const s = snakeRef.current;
      const nd = nextDirRef.current;
      dirRef.current = nd;
      const head = [s[0][0] + nd[0], s[0][1] + nd[1]];
      if (head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS || s.some(([x,y]) => x === head[0] && y === head[1])) {
        clearInterval(intervalRef.current);
        setBest(b => Math.max(b, scoreRef.current));
        setStatus("dead");
        return;
      }
      const ate = head[0] === foodRef.current[0] && head[1] === foodRef.current[1];
      const newSnake = [head, ...s.slice(0, ate ? s.length : s.length - 1)];
      const newFood = ate ? randFood(newSnake) : foodRef.current;
      if (ate) { scoreRef.current += 10; setScore(sc => sc + 10); }
      snakeRef.current = newSnake; foodRef.current = newFood;
      setSnake([...newSnake]); setFood([...newFood]);
      setDir([...nd]);
    }, 130);
    return () => clearInterval(intervalRef.current);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const tapDir = (d) => {
    const cur = dirRef.current;
    if (d[0] === -cur[0] && d[1] === -cur[1]) return;
    nextDirRef.current = d; setNextDir(d);
    if (status === "idle" || status === "dead") startGame();
  };

  return (
    <GameShell title="Snake" icon="🐍" color="#00b894" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-green-400">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className="text-xl font-black text-green-400">{best}</div><div className="text-xs text-gray-500 font-mono">BEST</div></div>
      </div>
      <div className="relative mx-auto rounded-xl overflow-hidden border border-green-500/20" style={{ width: COLS * CELL, height: ROWS * CELL, background: "rgba(0,0,0,0.6)" }}>
        {snake.map(([x,y], i) => (
          <div key={i} className="absolute rounded-sm transition-none" style={{
            left: x * CELL, top: y * CELL, width: CELL - 1, height: CELL - 1,
            background: i === 0 ? "#00b894" : `rgba(0,184,148,${1 - i * 0.04})`,
            boxShadow: i === 0 ? "0 0 8px #00b894" : "none",
          }} />
        ))}
        <div className="absolute rounded-full" style={{
          left: food[0] * CELL + 2, top: food[1] * CELL + 2, width: CELL - 5, height: CELL - 5,
          background: "#ff6b6b", boxShadow: "0 0 8px #ff6b6b",
        }} />
        {(status === "idle" || status === "dead") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <div className="text-3xl mb-2">{status === "dead" ? "💀" : "🐍"}</div>
            <div className="text-white font-black mb-1">{status === "dead" ? "GAME OVER" : "SNAKE"}</div>
            <div className="text-gray-400 text-xs font-mono mb-3">{status === "dead" ? `Score: ${score}` : "Arrow keys or buttons below"}</div>
            <button onClick={startGame} className="px-5 py-2 rounded-xl font-black text-black text-sm cursor-pointer hover:scale-105 transition-all" style={{ background: "#00b894" }}>
              {status === "dead" ? "RETRY" : "START"}
            </button>
          </div>
        )}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1 w-28 mx-auto">
        {[["", [0,-1], "▲"], ["", [-1,0], "◄"], ["", [0,1], "▼"], ["", [1,0], "►"]].map(([,d,label], i) => (
          <button key={i} onClick={() => tapDir(d)}
            className={`h-8 rounded-lg bg-white/10 hover:bg-green-400/20 text-white font-bold text-sm cursor-pointer transition-all ${i === 0 ? "col-start-2" : i === 1 ? "col-start-1" : i === 2 ? "col-start-2" : "col-start-3 row-start-2"}`}>
            {label}
          </button>
        ))}
      </div>
    </GameShell>
  );
}