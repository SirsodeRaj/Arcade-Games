// src/components/GameShell.jsx
// ─────────────────────────────────────────────────────────────────
// Every game renders inside this modal overlay.
// Props:
//   title  — display name shown in the header
//   icon   — emoji icon
//   color  — hex accent color (drives glow + gradient)
//   onClose — called when the × button is clicked
// ─────────────────────────────────────────────────────────────────

export default function GameShell({ title, icon, color, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl border overflow-hidden"
        style={{
          background: "rgba(10,10,20,0.95)",
          borderColor: `${color}40`,
          boxShadow: `0 0 60px ${color}30, 0 0 120px ${color}15`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: `${color}20`,
            background: `linear-gradient(135deg, ${color}15, transparent)`,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <span className="font-black text-lg text-white">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Game content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
