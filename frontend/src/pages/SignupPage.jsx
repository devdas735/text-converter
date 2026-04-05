import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AlertBox from '../components/common/AlertBox.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import InputField from '../components/common/InputField.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlert(null);

    if (!validate()) {
      setAlert({ tone: 'error', title: 'Validation failed', message: 'Please review the highlighted fields.' });
      return;
    }

    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setAlert({ tone: 'error', title: 'Signup failed', message: error.message || 'Please try again.' });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card title="Create your account" subtitle="Start converting text and files into premium audio.">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {alert ? <AlertBox tone={alert.tone} title={alert.title} message={alert.message} /> : null}

          <InputField
            label="Full name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            error={errors.name}
          />

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
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            error={errors.password}
          />

          <InputField
            label="Confirm password"
            type="password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            error={errors.confirmPassword}
          />

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link className="font-medium text-brand-200 hover:text-brand-100" to="/login">
              Log in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
