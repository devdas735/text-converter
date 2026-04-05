import Button from './Button.jsx';

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl border border-white/15 bg-slate-900 p-5 shadow-premium">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div className="text-sm text-slate-300">{children}</div>
      </div>
    </div>
  );
}
