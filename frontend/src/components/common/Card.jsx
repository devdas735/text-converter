export default function Card({ title, subtitle, children, className = '' }) {
  return (
    <article className={`surface-card p-5 md:p-6 ${className}`}>
      {(title || subtitle) && (
        <header className="mb-5">
          {title ? <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">{title}</h3> : null}
          {subtitle ? <p className="mt-2 text-sm leading-relaxed text-slate-300">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </article>
  );
}
