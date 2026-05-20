// src/components/SearchBar.jsx
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search games..."
        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-gray-600 font-mono text-sm outline-none transition-all focus:border-yellow-400/40 focus:shadow-[0_0_20px_rgba(255,230,109,0.1)]"
      />
    </div>
  );
}
