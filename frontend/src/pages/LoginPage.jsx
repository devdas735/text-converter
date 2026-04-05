import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AlertBox from '../components/common/AlertBox.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import InputField from '../components/common/InputField.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlert(null);

    if (!validate()) {
      setAlert({ tone: 'error', title: 'Validation failed', message: 'Please fix the form errors below.' });
      return;
    }

    try {
      await login({ email: form.email, password: form.password });
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setAlert({ tone: 'error', title: 'Login failed', message: error.message || 'Please try again.' });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card title="Welcome back" subtitle="Log in to manage conversions, history, and voice settings.">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {alert ? <AlertBox tone={alert.tone} title={alert.title} message={alert.message} /> : null}

          <InputField
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            error={errors.email}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            error={errors.password}
          />

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </Button>

          <p className="text-center text-sm text-slate-400">
            No account yet?{' '}
            <Link className="font-medium text-brand-200 hover:text-brand-100" to="/signup">
              Create one
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
