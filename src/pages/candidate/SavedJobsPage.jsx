import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, DollarSign, Clock, Briefcase, Trash2, ArrowRight, Building2, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/States';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { MOCK_JOBS } from '../../data/mockData';

export default function CandidateSavedJobsPage() {
  const { toast } = useToast();

  // Initialize with some mock saved jobs
  const [savedJobs, setSavedJobs] = useState(MOCK_JOBS.slice(0, 4));
  const [search, setSearch] = useState('');

  const handleRemove = (id, title) => {
    setSavedJobs(savedJobs.filter(j => j.id !== id));
    toast({
      type: 'info',
      title: 'Job Removed',
      message: `Removed "${title}" from your saved bookmarks.`,
    });
  };

  const filteredSaved = savedJobs.filter(j => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
  });

  return (
    <div className="candidate-saved-jobs-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Bookmark size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Saved Jobs & Bookmarks</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Keep track of positions you're interested in applying for later
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/jobs"><Button variant="primary" size="sm">Browse More Jobs</Button></Link>
          </div>
        </div>

        {savedJobs.length > 0 && (
          <div style={{ marginTop: 'var(--space-4)', maxWidth: 360 }}>
            <div className="input-wrapper">
              <span className="input-icon-left"><Search size={15} /></span>
              <input
                className="input has-icon-left"
                placeholder="Search within saved bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* List / Empty State */}
      {savedJobs.length === 0 ? (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-12)' }}>
          <EmptyState
            icon="jobs"
            title="No Saved Jobs Yet"
            description="When you find an interesting opening while browsing, click the bookmark icon to save it here for quick review."
            action={
              <Link to="/jobs">
                <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                  Explore Open Jobs
                </Button>
              </Link>
            }
          />
        </div>
      ) : filteredSaved.length === 0 ? (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
          <EmptyState
            icon="jobs"
            title="No matching saved jobs"
            description="No bookmarks matched your search query."
            action={<Button onClick={() => setSearch('')}>Clear Search</Button>}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
          {filteredSaved.map((job) => (
            <div
              key={job.id}
              className="card card-hoverable"
              style={{
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-xl)',
                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
                    color: '#fff',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {job.company?.[0]}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(job.id, job.title)}
                    style={{
                      background: 'var(--color-danger-50)',
                      border: '1px solid var(--color-danger-200)',
                      color: 'var(--color-danger-600)',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600
                    }}
                    title="Remove from saved"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>

                <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 2 }}>{job.title}</h3>
                </Link>

                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                  {job.company}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} /> {job.location} ({job.workMode})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <DollarSign size={13} /> {job.salary}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} /> Apply by {new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-primary" style={{ fontSize: '10px' }}>{job.type}</span>
                <Link to={`/jobs/${job.id}`}>
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight size={13} />}>
                    View & Apply
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
