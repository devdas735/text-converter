import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';

const highlights = [
  {
    title: 'Studio-Quality Voices',
    description: 'Generate natural, expressive speech with configurable tone, speed, and language.'
  },
  {
    title: 'Smart File Ingestion',
    description: 'Upload TXT, DOCX, and PDF files to extract text and convert in one streamlined flow.'
  },
  {
    title: 'Secure Conversion History',
    description: 'Access, re-generate, and download all conversion outputs from your private dashboard.'
  }
];

const fileTypes = ['.txt', '.docx', '.pdf'];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-900/40 via-slate-900 to-slate-950 p-8 md:p-12">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative max-w-3xl space-y-5">
          <span className="inline-block rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-100">
            Premium AI Audio Platform
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            Convert text and documents into polished, production-ready audio.
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            Text Converter Pro helps creators and teams transform content into human-like speech with advanced voice
            customization, fast conversion, and enterprise-ready workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/signup"><Button>Get Started Free</Button></Link>
            <Link to="/login"><Button variant="secondary">Log In</Button></Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} title={item.title} subtitle={item.description} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="App Overview" subtitle="Built for speed, quality, and control.">
          <ul className="space-y-3 text-sm text-slate-300">
            <li>• Convert pasted text directly into downloadable speech output.</li>
            <li>• Upload files and automatically extract + process content.</li>
            <li>• Manage conversion history with metadata and quick replay.</li>
            <li>• Designed with queue-friendly architecture for long jobs.</li>
          </ul>
        </Card>

        <Card title="Voice Customization" subtitle="Tune every conversion to your audience.">
          <ul className="space-y-3 text-sm text-slate-300">
            <li>• Select from multiple voices by locale and speaking style.</li>
            <li>• Adjust speaking speed from slow narration to rapid playback.</li>
            <li>• Switch language and voice combinations per project.</li>
            <li>• Save preferred voice presets in your profile (coming soon).</li>
          </ul>
        </Card>
      </section>

      <section className="rounded-xl border border-white/10 bg-slate-900/75 p-6">
        <h2 className="text-xl font-semibold text-white">Supported File Types</h2>
        <p className="mt-2 text-sm text-slate-400">Upload your source documents and convert them seamlessly.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {fileTypes.map((type) => (
            <span key={type} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-slate-200">
              {type}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
