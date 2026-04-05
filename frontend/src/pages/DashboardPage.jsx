import { Link } from 'react-router-dom';
import AudioPlayerCard from '../components/common/AudioPlayerCard.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';

const mockStats = [
  { label: 'Total Conversions', value: '148', delta: '+12% this month' },
  { label: 'Audio Minutes', value: '1,932', delta: '+8% this week' },
  { label: 'Saved Voices', value: '4', delta: '1 default active' }
];

const mockRecentConversions = [
  { id: 312, title: 'Product Overview Narration', type: 'Text', createdAt: '2 hours ago', voice: 'en-US-JennyNeural' },
  { id: 311, title: 'Quarterly Report PDF', type: 'File', createdAt: 'Yesterday', voice: 'en-GB-SoniaNeural' },
  { id: 309, title: 'Support FAQ Script', type: 'Text', createdAt: '2 days ago', voice: 'en-US-GuyNeural' }
];

const mockRecentAudio = [
  { id: 1, name: 'Landing page narration', duration: '01:42' },
  { id: 2, name: 'Investor update recap', duration: '03:18' }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card
        title="Welcome back, Alex"
        subtitle="Your workspace is ready. Pick up where you left off and publish your next audio in minutes."
      >
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/text-to-audio">
            <Button>Start Text Conversion</Button>
          </Link>
          <Link to="/upload-file">
            <Button variant="secondary">Upload a File</Button>
          </Link>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {mockStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} delta={stat.delta} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="Default Voice" subtitle="Favorite voice profile used for fast conversions.">
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-slate-400">Voice:</span> en-US-JennyNeural</p>
            <p><span className="text-slate-400">Language:</span> English (US)</p>
            <p><span className="text-slate-400">Speed:</span> 1.05x</p>
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Jump into common tasks.">
          <div className="grid gap-2 sm:grid-cols-2">
            <Link to="/text-to-audio">
              <Button className="w-full">New Text Conversion</Button>
            </Link>
            <Link to="/upload-file">
              <Button className="w-full" variant="secondary">Upload Document</Button>
            </Link>
            <Link to="/history">
              <Button className="w-full" variant="secondary">View Full History</Button>
            </Link>
            <Link to="/profile">
              <Button className="w-full" variant="secondary">Manage Voice Profile</Button>
            </Link>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Recent Conversions" subtitle="Latest generated conversions from your account.">
          {mockRecentConversions.length ? (
            <ul className="space-y-3">
              {mockRecentConversions.map((item) => (
                <li key={item.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.type} • {item.voice} • {item.createdAt}
                      </p>
                    </div>
                    <Link className="text-xs text-brand-200 hover:text-brand-100" to={`/history/${item.id}`}>
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No conversions yet" message="Your generated conversions will appear here." />
          )}
        </Card>

        <Card title="Recent Audio Preview" subtitle="Quick playback of latest outputs.">
          <div className="space-y-3">
            <AudioPlayerCard title="Most recent output" />
            <ul className="space-y-2 text-sm text-slate-300">
              {mockRecentAudio.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2">
                  <span>{item.name}</span>
                  <span className="text-xs text-slate-400">{item.duration}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}
