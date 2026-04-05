export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300" role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
