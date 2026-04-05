import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
      <p className="text-xs uppercase tracking-widest text-brand-200">Error 404</p>
      <h1 className="text-4xl font-semibold text-white">Page Not Found</h1>
      <p className="max-w-xl text-slate-300">
        The page you are looking for may have moved, been removed, or never existed.
      </p>
      <Link to="/">
        <Button>Return to Home</Button>
      </Link>
    </section>
  );
}
