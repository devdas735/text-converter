import { useState } from 'react';
import AlertBox from '../components/common/AlertBox.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import InputField from '../components/common/InputField.jsx';
import { useAuth } from '../hooks/useAuth.js';

const mockProfile = {
  name: 'Alex Carter',
  email: 'alex@textconverterpro.ai',
  joinedDate: 'January 12, 2026',
  totalConversions: 148,
  defaultVoice: 'en-US-JennyNeural',
  defaultLanguage: 'en-US',
  defaultSpeed: '1.05'
};

const voices = ['en-US-JennyNeural', 'en-US-GuyNeural', 'en-GB-SoniaNeural'];
const languages = ['en-US', 'en-GB', 'es-ES'];

export default function ProfilePage() {
  const { user } = useAuth();
  const liveProfile = {
    ...mockProfile,
    name: user?.name || mockProfile.name,
    email: user?.email || mockProfile.email
  };

  const [form, setForm] = useState({
    name: liveProfile.name,
    email: liveProfile.email,
    voice: mockProfile.defaultVoice,
    language: mockProfile.defaultLanguage,
    speed: mockProfile.defaultSpeed
  });
  const [alert, setAlert] = useState(null);

  const handleSave = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setAlert({ tone: 'error', title: 'Missing fields', message: 'Name and email are required.' });
      return;
    }

    setAlert({ tone: 'success', title: 'Saved (Mock)', message: 'Profile and default voice settings updated.' });
  };

  return (
    <div className="space-y-6">
      <Card title="Profile" subtitle="Manage account details and default conversion preferences.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">Name</p>
            <p className="mt-2 text-sm font-medium text-white">{liveProfile.name}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 lg:col-span-2">
            <p className="text-xs uppercase tracking-wider text-slate-400">Email</p>
            <p className="mt-2 text-sm font-medium text-white">{liveProfile.email}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">Joined</p>
            <p className="mt-2 text-sm font-medium text-white">{mockProfile.joinedDate}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">Conversions</p>
            <p className="mt-2 text-sm font-medium text-white">{mockProfile.totalConversions}</p>
          </div>
        </div>
      </Card>

      <Card title="Edit Profile & Voice Defaults" subtitle="Set your default profile and conversion behavior.">
        <form className="space-y-4" onSubmit={handleSave} noValidate>
          {alert ? <AlertBox tone={alert.tone} title={alert.title} message={alert.message} /> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Default Voice</span>
              <select
                className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2.5 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={form.voice}
                onChange={(e) => setForm((prev) => ({ ...prev, voice: e.target.value }))}
              >
                {voices.map((voice) => (
                  <option key={voice} value={voice}>{voice}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Default Language</span>
              <select
                className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2.5 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={form.language}
                onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))}
              >
                {languages.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </label>

            <InputField
              label="Default Speed"
              type="number"
              min="0.5"
              max="2.0"
              step="0.05"
              value={form.speed}
              onChange={(e) => setForm((prev) => ({ ...prev, speed: e.target.value }))}
            />
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
