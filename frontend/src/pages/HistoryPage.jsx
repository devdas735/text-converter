import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import InputField from '../components/common/InputField.jsx';
import Loader from '../components/common/Loader.jsx';
import Modal from '../components/common/Modal.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { deleteConversionRequest, fetchHistoryRequest, resolveAudioUrl } from '../services/conversionService.js';

const ITEMS_PER_PAGE = 6;

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function HistoryPage() {
  const { token } = useAuth();

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedForDelete, setSelectedForDelete] = useState(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setError('You must be logged in to view history.');
        setHistoryItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetchHistoryRequest(token);
        setHistoryItems(response || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch history.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  const filtered = useMemo(() => {
    return historyItems.filter((item) => {
      const matchesSearch = !search.trim() ||
        (item.output_audio_filename || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.voice_name || '').toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || item.input_type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [historyItems, search, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete || !token) return;

    try {
      await deleteConversionRequest(token, selectedForDelete.id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== selectedForDelete.id));
      setSelectedForDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete conversion.');
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Conversion History" subtitle="Search, filter, and manage all previous conversion outputs.">
        <div className="grid gap-3 md:grid-cols-3">
          <InputField
            label="Search"
            placeholder="Search by file or voice"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Input Type</span>
            <select
              className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2.5 text-slate-100 focus:border-brand-500 focus:outline-none"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Types</option>
              <option value="text">Text</option>
              <option value="file">File</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Status</span>
            <select
              className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2.5 text-slate-100 focus:border-brand-500 focus:outline-none"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </label>
        </div>
      </Card>

      <Card title="Past Conversions" subtitle="Premium list view with quick actions.">
        {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

        {loading ? (
          <Loader label="Loading conversion history..." />
        ) : paginatedItems.length === 0 ? (
          <EmptyState
            title="No conversions found"
            message="Try a different search/filter or create your first conversion."
          />
        ) : (
          <div className="space-y-3">
            {paginatedItems.map((item) => {
              const audioUrl = resolveAudioUrl(item.output_audio_url);
              return (
                <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">{item.output_audio_filename || item.input_type}</p>
                      <p className="text-xs text-slate-400">
                        {item.input_type.toUpperCase()} • {item.voice_name} • {item.language_code} • {formatDate(item.created_at)}
                      </p>
                      <span className="inline-block rounded-full border border-white/15 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-300">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link to={`/history/${item.id}`}>
                        <Button variant="secondary">View</Button>
                      </Link>
                      <a href={audioUrl || '#'} target="_blank" rel="noreferrer">
                        <Button variant="secondary" disabled={!audioUrl}>Play</Button>
                      </a>
                      <a href={audioUrl || '#'} download={item.output_audio_filename || undefined}>
                        <Button variant="secondary" disabled={!audioUrl}>Download</Button>
                      </a>
                      <Button variant="danger" onClick={() => setSelectedForDelete(item)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing {paginatedItems.length} of {filtered.length} item(s)
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={Boolean(selectedForDelete)}
        title="Delete conversion"
        onClose={() => setSelectedForDelete(null)}
      >
        <p className="mb-4">
          Are you sure you want to remove <strong>{selectedForDelete?.output_audio_filename}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleDeleteConfirm}>Confirm Delete</Button>
          <Button variant="secondary" onClick={() => setSelectedForDelete(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
