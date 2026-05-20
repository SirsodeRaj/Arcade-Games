import { useState } from "react";
import GameShell from "../components/GameShell.jsx";

export default function MemoryMatch({ onClose }) {
  const emojis = ["🔥","⚡","💎","🌙","🎯","🚀","👾","🎮"];
  const [cards, setCards] = useState(() => {
    const deck = [...emojis, ...emojis].map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
    return deck.sort(() => Math.random() - 0.5);
  });
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  const flip = (id) => {
    if (locked || selected.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newSelected = [...selected, id];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newSelected.map(sid => newCards.find(c => c.id === sid));
      setTimeout(() => {
        if (a.emoji === b.emoji) {
          const matched = newCards.map(c => newSelected.includes(c.id) ? { ...c, matched: true } : c);
          setCards(matched);
          if (matched.every(c => c.matched)) setWon(true);
        } else {
          setCards(newCards.map(c => newSelected.includes(c.id) ? { ...c, flipped: false } : c));
        }
        setSelected([]);
        setLocked(false);
      }, 700);
    }
  };

  const reset = () => {
    const deck = [...emojis, ...emojis].map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
    setCards(deck.sort(() => Math.random() - 0.5));
    setSelected([]); setMoves(0); setWon(false); setLocked(false);
  };

  const matched = cards.filter(c => c.matched).length / 2;

  return (
    <GameShell title="Memory Match" icon="🃏" color="#fd79a8" onClose={onClose}>
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="text-center"><div className="text-2xl font-black text-pink-400">{moves}</div><div className="text-xs text-gray-400 font-mono">MOVES</div></div>
        <div className="text-center"><div className="text-2xl font-black text-pink-400">{matched}/{emojis.length}</div><div className="text-xs text-gray-400 font-mono">PAIRS</div></div>
      </div>
      {won ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-xl font-black text-pink-400">Completed in {moves} moves!</div>
          <button onClick={reset} className="mt-4 px-6 py-2 rounded-xl font-black text-black cursor-pointer hover:scale-105 transition-all" style={{ background: "#fd79a8" }}>PLAY AGAIN</button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 mx-auto w-fit">
          {cards.map(card => (
            <button key={card.id} onClick={() => flip(card.id)}
              className={`w-16 h-16 rounded-xl text-2xl transition-all duration-300 border cursor-pointer
                ${card.matched ? "border-pink-400/50 bg-pink-400/10 scale-95" : card.flipped ? "border-pink-400 bg-pink-400/20" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-pink-400/40 hover:scale-105"}`}
              style={{ filter: card.matched ? "drop-shadow(0 0 6px #fd79a8)" : "none" }}>
              {card.flipped || card.matched ? card.emoji : "❓"}
            </button>
          ))}
        </div>
      )}
    </GameShell>
  );
}