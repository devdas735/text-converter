import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AudioPlayerCard from '../components/common/AudioPlayerCard.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { fetchConversionDetailRequest, resolveAudioUrl } from '../services/conversionService.js';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function ConversionDetailPage() {
  const { conversionId } = useParams();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversion, setConversion] = useState(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setError('You must be logged in to view conversion details.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetchConversionDetailRequest(token, conversionId);
        setConversion(response);
      } catch (err) {
        setError(err.message || 'Failed to fetch conversion detail.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token, conversionId]);

  if (loading) {
    return <Loader label="Loading conversion detail..." />;
  }

  if (error) {
    return <p className="text-sm text-rose-300">{error}</p>;
  }

  if (!conversion) {
    return <p className="text-sm text-slate-400">No conversion data found.</p>;
  }

  const audioUrl = resolveAudioUrl(conversion.output_audio_url);

  return (
    <div className="space-y-6">
      <Card
        title={`Conversion #${conversion.id}`}
        subtitle="Detailed view of conversion content, voice settings, and generated output."
      >
        <div className="space-y-4 text-sm text-slate-300">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-xs uppercase tracking-widest text-slate-400">Original / Extracted Text Preview</p>
            <p className="leading-relaxed">{conversion.extracted_text || '—'}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <p><span className="text-slate-400">Voice:</span> {conversion.voice_name}</p>
            <p><span className="text-slate-400">Speed:</span> {conversion.speed}x</p>
            <p><span className="text-slate-400">Language:</span> {conversion.language_code}</p>
            <p><span className="text-slate-400">Created:</span> {formatDate(conversion.created_at)}</p>
            <p><span className="text-slate-400">Filename:</span> {conversion.output_audio_filename || '—'}</p>
            <p><span className="text-slate-400">Status:</span> {conversion.status}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <a href={audioUrl || '#'} download={conversion.output_audio_filename || undefined}>
              <Button variant="secondary" disabled={!audioUrl}>Download Audio</Button>
            </a>
            <Link to="/history">
              <Button variant="secondary">Back to History</Button>
            </Link>
          </div>
        </div>
      </Card>

      <AudioPlayerCard title="Audio Preview" src={audioUrl} />
    </div>
  );
}
