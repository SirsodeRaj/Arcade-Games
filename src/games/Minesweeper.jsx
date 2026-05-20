import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function Minesweeper({ onClose }) {
  const ROWS = 9, COLS = 9, MINES = 10;

  const initBoard = () => {
    const cells = Array(ROWS * COLS).fill(null).map((_, i) => ({ id: i, mine: false, revealed: false, flagged: false, count: 0 }));
    let placed = 0;
    while (placed < MINES) {
      const idx = Math.floor(Math.random() * ROWS * COLS);
      if (!cells[idx].mine) { cells[idx].mine = true; placed++; }
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (cells[r*COLS+c].mine) continue;
      let cnt = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r+dr, nc = c+dc;
        if (nr>=0 && nr<ROWS && nc>=0 && nc<COLS && cells[nr*COLS+nc].mine) cnt++;
      }
      cells[r*COLS+c].count = cnt;
    }
    return cells;
  };

  const [board, setBoard] = useState(initBoard);
  const [status, setStatus] = useState("idle"); // idle|running|won|lost
  const [flags, setFlags] = useState(0);

  const reveal = (cells, idx) => {
    if (cells[idx].revealed || cells[idx].flagged) return cells;
    cells[idx].revealed = true;
    if (cells[idx].count === 0 && !cells[idx].mine) {
      const r = Math.floor(idx / COLS), c = idx % COLS;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r+dr, nc = c+dc;
        if (nr>=0 && nr<ROWS && nc>=0 && nc<COLS) cells = reveal(cells, nr*COLS+nc);
      }
    }
    return cells;
  };

  const click = (idx) => {
    if (status === "won" || status === "lost") return;
    if (board[idx].flagged || board[idx].revealed) return;
    setStatus("running");
    if (board[idx].mine) {
      setBoard(b => b.map(c => ({ ...c, revealed: c.mine ? true : c.revealed })));
      setStatus("lost");
      return;
    }
    const nb = reveal([...board.map(c => ({...c}))], idx);
    setBoard(nb);
    const won = nb.filter(c => !c.mine).every(c => c.revealed);
    if (won) setStatus("won");
  };

  const flag = (e, idx) => {
    e.preventDefault();
    if (board[idx].revealed) return;
    setBoard(b => b.map((c, i) => i === idx ? { ...c, flagged: !c.flagged } : c));
    setFlags(f => board[idx].flagged ? f - 1 : f + 1);
  };

  const colors = ["","#74b9ff","#00b894","#ff6b6b","#0984e3","#d63031","#4ecdc4","#2d3436","#636e72"];
  const reset = () => { setBoard(initBoard()); setStatus("idle"); setFlags(0); };

  return (
    <GameShell title="Minesweeper" icon="💣" color="#b2bec3" onClose={onClose}>
      <div className="flex justify-between mb-3 px-1">
        <div className="text-center"><div className="text-xl font-black text-gray-300">{MINES - flags}</div><div className="text-xs text-gray-500 font-mono">💣 LEFT</div></div>
        <div className={`text-center text-sm font-mono font-bold ${status === "won" ? "text-green-400" : status === "lost" ? "text-red-400" : "text-gray-400"}`}>
          {status === "won" ? "🏆 YOU WIN!" : status === "lost" ? "💥 BOOM!" : status === "running" ? "🏃 IN PROGRESS" : "🖱 RIGHT-CLICK = FLAG"}
        </div>
      </div>
      <div className="overflow-auto">
        <div className="grid gap-px mx-auto w-fit mb-4" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {board.map((cell, i) => (
            <button key={i} onClick={() => click(i)} onContextMenu={e => flag(e, i)}
              className={`w-8 h-8 text-xs font-black rounded-sm transition-all duration-100 cursor-pointer border
                ${cell.revealed ? cell.mine ? "bg-red-500/40 border-red-500/50" : "bg-white/5 border-white/5" : "bg-white/10 border-white/15 hover:bg-white/20"}`}>
              {cell.revealed ? cell.mine ? "💣" : cell.count > 0 ? <span style={{ color: colors[cell.count] }}>{cell.count}</span> : "" : cell.flagged ? "🚩" : ""}
            </button>
          ))}
        </div>
      </div>
      <button onClick={reset} className="w-full py-2 rounded-xl font-black text-xs font-mono text-gray-400 bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
        NEW GAME
      </button>
    </GameShell>
  );
}