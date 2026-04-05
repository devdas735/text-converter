import { useMemo, useState } from 'react';
import AlertBox from '../components/common/AlertBox.jsx';
import AudioPlayerCard from '../components/common/AudioPlayerCard.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { convertFileRequest, resolveAudioUrl } from '../services/conversionService.js';

const ALLOWED_EXTENSIONS = ['.txt', '.docx', '.pdf'];
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

function getExtension(filename = '') {
  const index = filename.lastIndexOf('.');
  return index > -1 ? filename.slice(index).toLowerCase() : '';
}

export default function UploadFilePage() {
  const { token } = useAuth();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [voiceName, setVoiceName] = useState(mockVoices[0].value);
  const [languageCode, setLanguageCode] = useState(mockLanguages[0].value);
  const [speed, setSpeed] = useState('1.0');
  const [extractedText, setExtractedText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fileMeta = useMemo(() => {
    if (!selectedFile) return null;
    return `${selectedFile.name} • ${(selectedFile.size / 1024).toFixed(1)} KB`;
  }, [selectedFile]);

  const validateFile = (file) => {
    if (!file) {
      setError('Choose a file to continue.');
      return false;
    }

    const extension = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError('Unsupported file type. Please upload one of: .txt, .docx, .pdf');
      return false;
    }

    setError('');
    return true;
  };

  const handleSelectedFile = (file) => {
    if (!validateFile(file)) return;
    setSelectedFile(file);
    setExtractedText('');
    setAudioUrl('');
    setSummary(null);
  };

  const handleInputChange = (event) => {
    handleSelectedFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleSelectedFile(event.dataTransfer.files?.[0]);
  };

  const handleGenerate = async () => {
    if (!token) {
      setError('You must be logged in to upload and generate audio.');
      return;
    }

    if (!validateFile(selectedFile)) return;

    setError('');
    setLoading(true);

    try {
      const response = await convertFileRequest(token, {
        file: selectedFile,
        voice_name: voiceName,
        language_code: languageCode,
        speed: Number(speed)
      });

      const resolvedAudioUrl = resolveAudioUrl(response.output_audio_url);
      setAudioUrl(resolvedAudioUrl);
      setExtractedText(response.extracted_text || '');
      setSummary({
        conversionId: response.conversion_id,
        outputAudioFilename: response.output_audio_filename,
        voiceName: response.voice_name,
        languageCode: response.language_code,
        speed: response.speed,
        outputAudioUrl: resolvedAudioUrl,
        status: response.status
      });
    } catch (err) {
      setError(err.message || 'Failed to process uploaded file.');
      setAudioUrl('');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Upload File to Audio" subtitle="Drop a document, preview extracted text, and generate speech.">
        <div className="space-y-4">
          {error ? <AlertBox tone="error" title="Upload failed" message={error} /> : null}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
              dragActive ? 'border-brand-500 bg-brand-500/10' : 'border-white/20 bg-white/5'
            }`}
          >
            <p className="text-sm font-medium text-slate-100">Drag & drop your file here</p>
            <p className="mt-1 text-xs text-slate-400">Supported: .txt, .docx, .pdf</p>
            <label className="mt-4 inline-block cursor-pointer rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white">
              Choose File
              <input
                className="hidden"
                type="file"
                accept=".txt,.docx,.pdf"
                onChange={handleInputChange}
              />
            </label>
            {fileMeta ? <p className="mt-3 text-xs text-slate-300">{fileMeta}</p> : null}
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Extracted Text Preview</span>
            <textarea
              className="min-h-40 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Extracted text will appear here after backend processing..."
              readOnly
            />
          </label>

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
                {mockLanguages.map((language) => (
                  <option key={language.value} value={language.value}>{language.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Speed</span>
              <input
                className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2.5 text-slate-100 focus:border-brand-500 focus:outline-none"
                type="number"
                min="0.5"
                max="2.0"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Audio'}
            </Button>
            {loading ? <Loader label="Uploading and processing..." /> : null}
          </div>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <AudioPlayerCard title="Generated Audio" src={audioUrl} />

        <Card title="Conversion Summary" subtitle="Latest upload conversion parameters.">
          <ul className="space-y-2 text-sm text-slate-300">
            <li><span className="text-slate-400">Conversion ID:</span> {summary?.conversionId ?? '—'}</li>
            <li><span className="text-slate-400">File:</span> {selectedFile?.name || '—'}</li>
            <li><span className="text-slate-400">Voice:</span> {summary?.voiceName ?? voiceName}</li>
            <li><span className="text-slate-400">Language:</span> {summary?.languageCode ?? languageCode}</li>
            <li><span className="text-slate-400">Speed:</span> {summary?.speed ?? speed}x</li>
            <li><span className="text-slate-400">Status:</span> {summary?.status ?? '—'}</li>
            <li><span className="text-slate-400">Output:</span> {summary?.outputAudioFilename ?? '—'}</li>
          </ul>

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
