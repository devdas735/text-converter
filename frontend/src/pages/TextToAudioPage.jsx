import { useMemo, useState } from 'react';
import AlertBox from '../components/common/AlertBox.jsx';
import AudioPlayerCard from '../components/common/AudioPlayerCard.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import InputField from '../components/common/InputField.jsx';
import Loader from '../components/common/Loader.jsx';
import Textarea from '../components/common/Textarea.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { convertTextRequest, resolveAudioUrl } from '../services/conversionService.js';

const mockVoices = [
  { value: 'en-US-JennyNeural', label: 'Jenny (US)' },
  { value: 'en-US-GuyNeural', label: 'Guy (US)' },
  { value: 'en-GB-SoniaNeural', label: 'Sonia (UK)' }
];

const mockLanguages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish (Spain)' }
];

export default function TextToAudioPage() {
  const { token } = useAuth();

  const [text, setText] = useState('');
  const [voiceName, setVoiceName] = useState(mockVoices[0].value);
  const [languageCode, setLanguageCode] = useState(mockLanguages[0].value);
  const [speed, setSpeed] = useState('1.0');
  const [audioUrl, setAudioUrl] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const characterCount = text.length;
  const words = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter text before generating audio.');
      return;
    }

    if (!token) {
      setError('You must be logged in to generate audio.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        text,
        voice_name: voiceName,
        language_code: languageCode,
        speed: Number(speed)
      };

      const response = await convertTextRequest(token, payload);
      const resolvedAudioUrl = resolveAudioUrl(response.output_audio_url);

      setAudioUrl(resolvedAudioUrl);
      setSummary({
        conversionId: response.conversion_id,
        extractedText: response.extracted_text,
        outputAudioFilename: response.output_audio_filename,
        voiceName: response.voice_name,
        languageCode: response.language_code,
        speed: response.speed,
        outputAudioUrl: resolvedAudioUrl,
        status: response.status
      });
    } catch (err) {
      setError(err.message || 'Failed to generate audio.');
      setAudioUrl('');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setVoiceName(mockVoices[0].value);
    setLanguageCode(mockLanguages[0].value);
    setSpeed('1.0');
    setAudioUrl('');
    setSummary(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card title="Text to Audio" subtitle="Turn your script into lifelike speech with voice and playback controls.">
        <div className="space-y-4">
          {error ? <AlertBox tone="error" title="Request failed" message={error} /> : null}

          <Textarea
            label="Script"
            placeholder="Paste or write the text you want to convert..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-72"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-400">
            <span>Characters: {characterCount.toLocaleString()}</span>
            <span>Words: {words.toLocaleString()}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Voice</span>
              <select
                className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2.5 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
              >
                {mockVoices.map((voice) => (
                  <option key={voice.value} value={voice.value}>{voice.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Language</span>
              <select
                className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2.5 text-slate-100 focus:border-brand-500 focus:outline-none"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
              >
                {mockLanguages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </label>

            <InputField
              label="Speed"
              type="number"
              min="0.5"
              max="2.0"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Audio'}
            </Button>
            <Button variant="secondary" onClick={handleReset} disabled={loading}>Reset / Clear</Button>
            {loading ? <Loader label="Converting text..." /> : null}
          </div>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <AudioPlayerCard title="Generated Audio" src={audioUrl} />

        <Card title="Conversion Summary" subtitle="Latest generated output details.">
          <ul className="space-y-2 text-sm text-slate-300">
            <li><span className="text-slate-400">Conversion ID:</span> {summary?.conversionId ?? '—'}</li>
            <li><span className="text-slate-400">Filename:</span> {summary?.outputAudioFilename ?? '—'}</li>
            <li><span className="text-slate-400">Voice:</span> {summary?.voiceName ?? voiceName}</li>
            <li><span className="text-slate-400">Language:</span> {summary?.languageCode ?? languageCode}</li>
            <li><span className="text-slate-400">Speed:</span> {summary?.speed ?? speed}x</li>
            <li><span className="text-slate-400">Status:</span> {summary?.status ?? '—'}</li>
          </ul>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">Extracted / Generated Text</p>
            <p className="line-clamp-5 text-sm text-slate-300">{summary?.extractedText || '—'}</p>
          </div>

          <a href={summary?.outputAudioUrl || '#'} download={summary?.outputAudioFilename || undefined}>
            <Button className="mt-4 w-full" variant="secondary" disabled={!summary?.outputAudioUrl}>
              Download Audio
            </Button>
          </a>
        </Card>
      </section>
    </div>
  );
}
