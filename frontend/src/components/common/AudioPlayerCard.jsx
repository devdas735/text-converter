import Card from './Card.jsx';

export default function AudioPlayerCard({ title = 'Generated Audio', src }) {
  return (
    <Card title={title} subtitle="Preview and download your generated speech.">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        {src ? (
          <audio className="w-full" controls src={src}>
            Your browser does not support audio playback.
          </audio>
        ) : (
          <p className="text-sm text-slate-400">No audio available yet.</p>
        )}
      </div>
    </Card>
  );
}
