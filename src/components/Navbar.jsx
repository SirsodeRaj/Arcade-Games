// src/components/Navbar.jsx
import { useState } from "react";

const NAV_ITEMS = [
  { id: "home",        label: "HOME",       icon: "⚡" },
  { id: "games",       label: "GAMES",      icon: "🎮" },
  { id: "categories",  label: "CATEGORIES", icon: "📂" },
  { id: "leaderboard", label: "SCORES",     icon: "🏆" },
];

export default function Navbar({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 border-b"
      style={{
        background: "rgba(4,4,12,0.9)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Exo 2', monospace" }}>
            <span style={{ color: "#ffe66d", textShadow: "0 0 20px rgba(255,230,109,0.6)" }}>PIXEL</span>
            <span className="text-white">VAULT</span>
          </div>
          <div
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono"
            style={{
              background: "rgba(255,107,107,0.15)",
              color: "#ff6b6b",
              border: "1px solid rgba(255,107,107,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            LIVE
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className="px-4 py-2 rounded-xl text-sm font-mono font-bold transition-all duration-200 cursor-pointer"
              style={{
                color: page === item.id ? "#ffe66d" : "rgba(255,255,255,0.5)",
                background: page === item.id ? "rgba(255,230,109,0.1)" : "transparent",
                textShadow: page === item.id ? "0 0 12px rgba(255,230,109,0.5)" : "none",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 cursor-pointer"
          onClick={() => setMenuOpen((o) => !o)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "rgba(4,4,12,0.98)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setMenuOpen(false); }}
              className="w-full text-left px-6 py-3 font-mono text-sm border-b cursor-pointer transition-colors"
              style={{
                color: page === item.id ? "#ffe66d" : "rgba(255,255,255,0.6)",
                borderColor: "rgba(255,255,255,0.04)",
                background: page === item.id ? "rgba(255,230,109,0.05)" : "transparent",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
