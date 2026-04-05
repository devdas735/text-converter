import { NavLink } from 'react-router-dom';

const sidebarLinks = [
  ['/dashboard', 'Overview'],
  ['/text-to-audio', 'Text to Audio'],
  ['/upload-file', 'Upload File'],
  ['/history', 'History'],
  ['/profile', 'Profile'],
  ['/contact', 'Support']
];

export default function Sidebar() {
  return (
    <aside className="surface-card hidden w-64 shrink-0 p-4 lg:block">
      <h2 className="mb-4 px-2 text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</h2>
      <nav className="space-y-1.5">
        {sidebarLinks.map(([path, label]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-brand-500 text-white shadow-premium' : 'text-slate-300 hover:bg-white/10'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
