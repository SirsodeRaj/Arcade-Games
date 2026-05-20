import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function MathBlitz({ onClose }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [status, setStatus] = useState("idle");
  const [question, setQuestion] = useState(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const genQ = () => {
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;
    if (op === "+") { a = Math.floor(Math.random()*50)+1; b = Math.floor(Math.random()*50)+1; ans = a+b; }
    else if (op === "-") { a = Math.floor(Math.random()*50)+20; b = Math.floor(Math.random()*(a-1))+1; ans = a-b; }
    else { a = Math.floor(Math.random()*12)+1; b = Math.floor(Math.random()*12)+1; ans = a*b; }
    return { q: `${a} ${op} ${b}`, ans };
  };

  const start = () => {
    setScore(0); setTimeLeft(30); setStatus("running"); setStreak(0);
    setQuestion(genQ()); setInput(""); setFeedback(null);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setStatus("done"); return 0; }
        return t - 1;
      });
    }, 1000);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const submit = () => {
    const ans = parseInt(input);
    if (isNaN(ans)) return;
    if (ans === question.ans) {
      const pts = 10 + streak * 2;
      setScore(s => s + pts);
      setStreak(s => s + 1);
      setFeedback({ ok: true, msg: `+${pts}` });
    } else {
      setStreak(0);
      setFeedback({ ok: false, msg: `✗ ${question.ans}` });
    }
    setTimeout(() => { setQuestion(genQ()); setInput(""); setFeedback(null); inputRef.current?.focus(); }, 400);
  };

  useEffect(() => { if (status === "done") setBest(b => Math.max(b, score)); }, [status]);

  return (
    <GameShell title="Math Blitz" icon="➗" color="#ffeaa7" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-yellow-200">{score}</div><div className="text-xs text-gray-500 font-mono">SCORE</div></div>
        <div className="text-center"><div className="text-xl font-black" style={{ color: timeLeft <= 10 ? "#ff6b6b" : "#ffeaa7" }}>{timeLeft}s</div><div className="text-xs text-gray-500 font-mono">TIME</div></div>
        <div className="text-center"><div className="text-xl font-black text-yellow-200">{streak}🔥</div><div className="text-xs text-gray-500 font-mono">STREAK</div></div>
      </div>
      {status === "running" && question && (
        <>
          <div className="text-center p-6 rounded-2xl bg-black/40 border border-yellow-400/20 mb-4">
            <div className="text-4xl font-black" style={{ color: "#ffeaa7", textShadow: "0 0 20px rgba(255,234,167,0.4)" }}>{question.q} = ?</div>
            {feedback && <div className={`mt-2 text-lg font-black ${feedback.ok ? "text-green-400" : "text-red-400"}`}>{feedback.msg}</div>}
          </div>
          <div className="flex gap-3">
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              type="number" placeholder="Answer..."
              className="flex-1 bg-black/40 border border-yellow-400/30 rounded-xl px-4 py-3 text-white font-mono text-xl outline-none focus:border-yellow-400 focus:shadow-[0_0_12px_rgba(255,234,167,0.3)] transition-all" />
            <button onClick={submit} className="px-6 py-3 rounded-xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#ffeaa7" }}>✓</button>
          </div>
        </>
      )}
      {status === "idle" && (
        <div className="text-center py-4">
          <div className="text-gray-400 font-mono text-sm mb-4">Solve as many equations as possible in 30 seconds!</div>
          <button onClick={start} className="px-8 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg, #ffeaa7, #fdcb6e)" }}>START BLITZ</button>
        </div>
      )}
      {status === "done" && (
        <div className="text-center py-4">
          <div className="text-2xl font-black text-yellow-200 mb-1">⏱ TIME'S UP!</div>
          <div className="font-mono text-sm text-gray-400 mb-1">Score: <span className="text-white font-bold">{score}</span> · Best: <span className="text-yellow-300 font-bold">{best}</span></div>
          <button onClick={start} className="mt-3 px-8 py-3 rounded-2xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg, #ffeaa7, #fdcb6e)" }}>RETRY</button>
        </div>
      )}
    </GameShell>
  );
}