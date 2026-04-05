import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const navItems = [
  ['/', 'Home'],
  ['/dashboard', 'Dashboard'],
  ['/text-to-audio', 'Text to Audio'],
  ['/upload-file', 'Upload File'],
  ['/history', 'History'],
  ['/pricing', 'Pricing']
];

export default function HeaderNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link className="text-lg font-semibold tracking-tight text-white" to="/">
          Text Converter Pro
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-500 text-white shadow-premium' : 'text-slate-300 hover:bg-white/10'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link className="rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-200" to="/profile">
              {user?.name || 'Profile'}
            </Link>
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link className="rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-200" to="/login">
              Login
            </Link>
            <Link className="rounded-xl bg-brand-500 px-3 py-2 text-sm font-semibold text-white" to="/signup">
              Start Free
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
