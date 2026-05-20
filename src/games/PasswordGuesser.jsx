import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function PasswordGuesser({ onClose }) {
  const DIGITS = 4;
  const makeCode = () => Array.from({ length: DIGITS }, () => Math.floor(Math.random() * 10));
  const [code] = useState(makeCode);
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [won, setWon] = useState(false);
  const maxGuesses = 8;

  const check = (g) => {
    const ga = g.split("").map(Number);
    let bulls = 0, cows = 0;
    const codeLeft = [], guessLeft = [];
    for (let i = 0; i < DIGITS; i++) {
      if (ga[i] === code[i]) bulls++;
      else { codeLeft.push(code[i]); guessLeft.push(ga[i]); }
    }
    guessLeft.forEach(d => { const idx = codeLeft.indexOf(d); if (idx !== -1) { cows++; codeLeft.splice(idx, 1); } });
    return { bulls, cows };
  };

  const submit = () => {
    if (current.length !== DIGITS) return;
    const fb = check(current);
    const newGuesses = [...guesses, { g: current, ...fb }];
    setGuesses(newGuesses);
    if (fb.bulls === DIGITS) setWon(true);
    setCurrent("");
  };

  const reset = () => { window.location.reload(); };
  const remaining = maxGuesses - guesses.length;

  return (
    <GameShell title="Password Guesser" icon="🔐" color="#00cec9" onClose={onClose}>
      <div className="flex justify-between mb-4 px-1">
        <div className="text-center"><div className="text-xl font-black text-teal-300">{remaining}</div><div className="text-xs text-gray-500 font-mono">GUESSES LEFT</div></div>
        <div className="text-center text-xs font-mono text-gray-400 self-center">🟢 = right spot · 🟡 = wrong spot</div>
      </div>
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
        {guesses.map((g, i) => (
          <div key={i} className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-2">
            <span className="font-black font-mono text-xl tracking-widest text-white">{g.g}</span>
            <div className="flex gap-1">
              {Array(g.bulls).fill("🟢").concat(Array(g.cows).fill("🟡")).concat(Array(DIGITS - g.bulls - g.cows).fill("⬜")).map((e, j) => <span key={j}>{e}</span>)}
            </div>
          </div>
        ))}
        {!won && remaining > 0 && (
          <div className="flex items-center gap-2 bg-teal-400/10 border border-teal-400/20 rounded-xl px-4 py-2">
            <span className="font-black font-mono text-xl tracking-widest text-teal-300">{current.padEnd(DIGITS, "_")}</span>
          </div>
        )}
      </div>
      {!won && remaining > 0 ? (
        <>
          <div className="grid grid-cols-5 gap-1 mb-2">
            {"0123456789".split("").map(d => (
              <button key={d} onClick={() => current.length < DIGITS && setCurrent(c => c + d)}
                className="py-2 rounded-lg font-black text-white bg-white/10 hover:bg-teal-400/20 border border-white/10 hover:border-teal-400/40 transition-all cursor-pointer">{d}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrent(c => c.slice(0, -1))} className="flex-1 py-2 rounded-xl font-black text-gray-400 bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/10">⌫</button>
            <button onClick={submit} disabled={current.length !== DIGITS} className="flex-1 py-2 rounded-xl font-black text-black cursor-pointer hover:scale-105 disabled:opacity-30 transition-all" style={{ background: "#00cec9" }}>GUESS</button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className={`text-xl font-black mb-2 ${won ? "text-green-400" : "text-red-400"}`}>
            {won ? "🏆 CRACKED IT!" : `💀 Code was ${code.join("")}`}
          </div>
          <button onClick={reset} className="px-6 py-2 rounded-xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#00cec9" }}>NEW CODE</button>
        </div>
      )}
    </GameShell>
  );
}