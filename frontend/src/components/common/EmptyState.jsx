export default function EmptyState({ title = 'Nothing here yet', message = 'Content will appear once data is available.' }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-10 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
}
