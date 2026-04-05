export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary:
      'bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 shadow-lg shadow-brand-900/30',
    secondary:
      'border border-white/20 bg-white/5 text-slate-100 hover:bg-white/12 hover:border-white/30',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-900/30'
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
