import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function TicTacToe({ onClose }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, D: 0 });

  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const winner = lines.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  const isDraw = !winner && board.every(Boolean);

  const click = (i) => {
    if (board[i] || winner || isDraw) return;
    const nb = [...board];
    nb[i] = isX ? "X" : "O";
    setBoard(nb);
    const w = lines.find(([a,b,c]) => nb[a] && nb[a] === nb[b] && nb[a] === nb[c]);
    const d = !w && nb.every(Boolean);
    if (w) setScore(s => ({ ...s, [nb[w[0]]]: s[nb[w[0]]] + 1 }));
    if (d) setScore(s => ({ ...s, D: s.D + 1 }));
    setIsX(!isX);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setIsX(true); };
  const winLine = winner ? winner : [];

  return (
    <GameShell title="Tic Tac Toe" icon="⬜" color="#a29bfe" onClose={onClose}>
      <div className="flex justify-center gap-8 mb-6">
        {[["X", score.X, "#a29bfe"], ["D", score.D, "#ffffff"], ["O", score.O, "#fd79a8"]].map(([l, v, c]) => (
          <div key={l} className="text-center">
            <div style={{ color: c }} className="text-2xl font-black">{v}</div>
            <div className="text-xs text-gray-400 font-mono">{l}</div>
          </div>
        ))}
      </div>
      <div className={`text-center mb-4 text-sm font-mono ${winner ? "text-purple-300" : isDraw ? "text-gray-400" : isX ? "text-purple-400" : "text-pink-400"}`}>
        {winner ? `🏆 Player ${board[winner[0]]} wins!` : isDraw ? "🤝 Draw!" : `Player ${isX ? "X" : "O"}'s turn`}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-6 mx-auto w-fit">
        {board.map((cell, i) => (
          <button key={i} onClick={() => click(i)}
            className={`w-20 h-20 rounded-xl border text-3xl font-black transition-all duration-200 cursor-pointer
              ${winLine.includes(i) ? "border-purple-400 bg-purple-400/20 scale-105" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-400/50"}
              ${cell === "X" ? "text-purple-400" : "text-pink-400"}`}
            style={{ textShadow: cell ? `0 0 12px ${cell === "X" ? "#a29bfe" : "#fd79a8"}` : "none" }}>
            {cell}
          </button>
        ))}
      </div>
      {(winner || isDraw) && (
        <button onClick={reset} className="w-full py-3 rounded-xl font-black text-black transition-all hover:scale-105 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #a29bfe, #6c5ce7)" }}>
          PLAY AGAIN
        </button>
      )}
    </GameShell>
  );
}