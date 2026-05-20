// src/App.jsx
import { useState, useCallback } from "react";

import Navbar          from "./components/Navbar.jsx";
import BgFx            from "./components/BgFx.jsx";
import HomePage        from "./pages/HomePage.jsx";
import GamesPage       from "./pages/GamesPage.jsx";
import CategoriesPage  from "./pages/CategoriesPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import GAME_COMPONENTS from "./games/index.js";

export default function App() {
  const [page, setPage]           = useState("home");
  const [activeGame, setActiveGame] = useState(null);

  const onPlay  = useCallback((id) => setActiveGame(id), []);
  const onClose = useCallback(() => setActiveGame(null), []);

  const ActiveGame = activeGame ? GAME_COMPONENTS[activeGame] : null;

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "#04040c", fontFamily: "'Exo 2', 'Share Tech Mono', monospace" }}
    >
      {/* Ambient background */}
      <BgFx />

      {/* Top navigation */}
      <Navbar page={page} setPage={setPage} />

      {/* Page content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {page === "home"        && <HomePage        setPage={setPage} onPlay={onPlay} />}
        {page === "games"       && <GamesPage       onPlay={onPlay} />}
        {page === "categories"  && <CategoriesPage  onPlay={onPlay} />}
        {page === "leaderboard" && <LeaderboardPage />}
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t mt-8 py-8 text-center"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="text-gray-600 font-mono text-xs">
          <span style={{ color: "#ffe66d" }}>PIXELVAULT</span>
          {" · "}35 Games{" · "}Built with React + Tailwind CSS
        </div>
      </footer>

      {/* Game modal overlay */}
      {ActiveGame && <ActiveGame onClose={onClose} />}
    </div>
  );
}
