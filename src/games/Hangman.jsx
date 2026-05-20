import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function Hangman({ onClose }) {
  const wordList = ["ARCADE","NEON","TURBO","HYPER","PIXEL","LASER","CYBER","GHOST","BOOST","ORBIT","STORM","GLITCH","ULTRA","BLAZE","STEALTH"];
  const [word, setWord] = useState(() => wordList[Math.floor(Math.random() * wordList.length)]);
  const [guessed, setGuessed] = useState(new Set());
  const [score, setScore] = useState(0);
  const maxWrong = 6;

  const wrong = [...guessed].filter(l => !word.includes(l)).length;
  const won = word.split("").every(l => guessed.has(l));
  const lost = wrong >= maxWrong;

  const guess = (l) => {
    if (guessed.has(l) || won || lost) return;
    setGuessed(g => new Set([...g, l]));
    if (word.includes(l)) {
      const newLetters = word.split("").filter(c => c === l && !guessed.has(c)).length;
      setScore(s => s + newLetters * 10);
    }
  };

  const reset = () => {
    setWord(wordList[Math.floor(Math.random() * wordList.length)]);
    setGuessed(new Set());
  };

  const hangParts = [
    // rope
    <line key="r" x1="100" y1="20" x2="100" y2="40" stroke="#ff6b6b" strokeWidth="3"/>,
    // head
    <circle key="h" cx="100" cy="52" r="12" fill="none" stroke="#ff6b6b" strokeWidth="3"/>,
    // body
    <line key="b" x1="100" y1="64" x2="100" y2="100" stroke="#ff6b6b" strokeWidth="3"/>,
    // left arm
    <line key="la" x1="100" y1="75" x2="78" y2="90" stroke="#ff6b6b" strokeWidth="3"/>,
    // right arm
    <line key="ra" x1="100" y1="75" x2="122" y2="90" stroke="#ff6b6b" strokeWidth="3"/>,
    // left leg
    <line key="ll" x1="100" y1="100" x2="80" y2="120" stroke="#ff6b6b" strokeWidth="3"/>,
    // right leg
    <line key="rl" x1="100" y1="100" x2="120" y2="120" stroke="#ff6b6b" strokeWidth="3"/>,
  ];

  return (
    <GameShell title="Hangman" icon="🪢" color="#d63031" onClose={onClose}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg width="160" height="140" className="block">
            {/* Gallows */}
            <line x1="20" y1="130" x2="140" y2="130" stroke="#555" strokeWidth="3"/>
            <line x1="60" y1="130" x2="60" y2="10" stroke="#555" strokeWidth="3"/>
            <line x1="60" y1="10" x2="100" y2="10" stroke="#555" strokeWidth="3"/>
            <line x1="100" y1="10" x2="100" y2="20" stroke="#555" strokeWidth="3"/>
            {hangParts.slice(0, wrong)}
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 font-mono mb-2">{maxWrong - wrong} lives left</div>
          <div className="flex gap-1 flex-wrap mb-3">
            {word.split("").map((l, i) => (
              <div key={i} className="w-7 h-8 border-b-2 flex items-end justify-center pb-0.5 font-black text-lg"
                style={{ borderColor: "#d63031", color: guessed.has(l) ? "#d63031" : "transparent" }}>
                {guessed.has(l) ? l : "_"}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-600 font-mono">Wrong: {[...guessed].filter(l => !word.includes(l)).join(" ") || "—"}</div>
          {(won || lost) && (
            <div className="mt-3">
              <div className={`font-black text-sm ${won ? "text-green-400" : "text-red-400"}`}>
                {won ? "🏆 YOU WIN!" : `💀 It was ${word}`}
              </div>
              <button onClick={reset} className="mt-2 px-4 py-1.5 rounded-lg font-black text-xs text-black cursor-pointer" style={{ background: "#d63031" }}>NEW WORD</button>
            </div>
          )}
        </div>
      </div>
      {!won && !lost && (
        <div className="mt-4 flex flex-wrap gap-1">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
            <button key={l} onClick={() => guess(l)} disabled={guessed.has(l)}
              className={`w-8 h-8 rounded-lg text-xs font-black transition-all cursor-pointer border
                ${guessed.has(l) ? word.includes(l) ? "bg-green-400/20 border-green-400/30 text-green-400" : "bg-red-400/10 border-red-400/20 text-red-400/40" : "bg-white/10 border-white/15 text-white hover:bg-red-400/20 hover:border-red-400/40"}`}>
              {l}
            </button>
          ))}
        </div>
      )}
    </GameShell>
  );
}