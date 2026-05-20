// src/components/StatCard.jsx
export default function StatCard({ label, value, icon, color }) {
  return (
    <div
      className="rounded-2xl border p-5 flex items-center gap-4"
      style={{ background: "rgba(10,10,20,0.7)", borderColor: `${color}20` }}
    >
      <div className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black" style={{ color }}>
          {value}
        </div>
        <div className="text-xs text-gray-500 font-mono">{label}</div>
      </div>
    </div>
  );
}
