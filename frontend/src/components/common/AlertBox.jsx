export default function AlertBox({ title, message, tone = 'info' }) {
  const tones = {
    info: 'border-sky-500/40 bg-sky-500/10 text-sky-200',
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
    error: 'border-rose-500/40 bg-rose-500/10 text-rose-200'
  };

  return (
    <div className={`rounded-lg border px-4 py-3 ${tones[tone]}`}>
      {title ? <h4 className="text-sm font-semibold">{title}</h4> : null}
      {message ? <p className="mt-1 text-sm">{message}</p> : null}
    </div>
  );
}
