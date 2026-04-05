export default function StatCard({ label, value, delta }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {delta ? <p className="mt-1 text-xs text-emerald-300">{delta}</p> : null}
    </div>
  );
}
