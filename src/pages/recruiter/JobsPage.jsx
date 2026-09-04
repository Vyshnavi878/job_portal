import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase, Plus, Search, Filter, Users, Eye, Edit2,
  XCircle, CheckCircle2, Clock, AlertTriangle, ArrowRight,
  MoreVertical, Calendar, DollarSign, MapPin, Sparkles, Building2
} from 'lucide-react';
import { useRecruiter } from '../../context/RecruiterContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/States';
import { ConfirmDialog } from '../../components/ui/Modal';

export default function JobsPage() {
  const navigate = useNavigate();
  const { recruiter, closeJob, updateJob } = useRecruiter();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [closingJobId, setClosingJobId] = useState(null);

  const jobs = recruiter?.jobs || [];

  // Extract unique departments
  const departments = useMemo(() => {
    const set = new Set(jobs.map(j => j.department).filter(Boolean));
    return Array.from(set);
  }, [jobs]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: jobs.length,
      active: jobs.filter(j => j.status === 'PUBLISHED').length,
      pending: jobs.filter(j => j.status === 'PENDING').length,
      draft: jobs.filter(j => j.status === 'DRAFT').length,
      closed: jobs.filter(j => j.status === 'CLOSED').length,
    };
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter
      if (selectedStatusTab === 'ACTIVE' && job.status !== 'PUBLISHED') return false;
      if (selectedStatusTab === 'PENDING' && job.status !== 'PENDING') return false;
      if (selectedStatusTab === 'DRAFT' && job.status !== 'DRAFT') return false;
      if (selectedStatusTab === 'CLOSED' && job.status !== 'CLOSED') return false;

      // Department filter
      if (departmentFilter !== 'ALL' && job.department !== departmentFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title?.toLowerCase().includes(q);
        const matchDept = job.department?.toLowerCase().includes(q);
        const matchLoc = job.location?.toLowerCase().includes(q);
        const matchSkills = job.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDept && !matchLoc && !matchSkills) return false;
      }

      return true;
    });
  }, [jobs, selectedStatusTab, departmentFilter, searchQuery]);

  const handleConfirmClose = () => {
    if (closingJobId) {
      closeJob(closingJobId);
      addToast('Job posting has been closed successfully.', 'info');
      setClosingJobId(null);
    }
  };

  const handleReopen = (jobId) => {
    updateJob(jobId, { status: 'PUBLISHED' });
    addToast('Job posting has been republished and is now active.', 'success');
  };

  return (
    <div className="portal-page">
      {/* Page Header */}
      <div className="portal-header-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: 0 }}>
            Job Postings & Requisitions
          </h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage active hiring positions, review incoming applicants, and track recruitment progress.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/recruiter/candidates">
            <Button variant="outline" icon={<Search size={16} />}>
              Find Talent
            </Button>
          </Link>
          <Link to="/recruiter/jobs/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar & Tabs */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by job title, department, location, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%', height: '42px', borderRadius: '8px' }}
            />
          </div>

          <div style={{ width: '220px' }}>
            <select
              className="form-control"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ height: '42px', borderRadius: '8px' }}
            >
              <option value="ALL">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderTop: '1px solid var(--color-gray-100)',
          paddingTop: '0.85rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'ALL', label: 'All Jobs', count: tabCounts.all },
            { id: 'ACTIVE', label: 'Active / Published', count: tabCounts.active },
            { id: 'PENDING', label: 'Pending Approval', count: tabCounts.pending },
            { id: 'DRAFT', label: 'Drafts', count: tabCounts.draft },
            { id: 'CLOSED', label: 'Closed', count: tabCounts.closed },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              style={{
                background: selectedStatusTab === tab.id ? 'var(--color-primary-50)' : 'transparent',
                color: selectedStatusTab === tab.id ? 'var(--color-primary-700)' : 'var(--color-gray-600)',
                fontWeight: selectedStatusTab === tab.id ? 600 : 500,
                border: selectedStatusTab === tab.id ? '1px solid var(--color-primary-200)' : '1px solid transparent',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: selectedStatusTab === tab.id ? 'var(--color-primary-600)' : 'var(--color-gray-200)',
                color: selectedStatusTab === tab.id ? '#fff' : 'var(--color-gray-700)',
                fontSize: '0.75rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '10px',
                fontWeight: 600
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Listing Table */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={48} />}
          title="No job postings found"
          description="Try changing your search terms or filters, or post a new job requisition to start receiving applicants."
          action={
            <Link to="/recruiter/jobs/new">
              <Button variant="primary" icon={<Plus size={16} />}>Post New Job</Button>
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                transition: 'box-shadow 0.2s ease',
                border: job.status === 'PUBLISHED' ? '1px solid #c7d2fe' : '1px solid var(--color-gray-200)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>
                      {job.title}
                    </h2>
                    <StatusBadge status={job.status} />
                    <span style={{
                      fontSize: '0.75rem',
                      background: 'var(--color-gray-100)',
                      color: 'var(--color-gray-700)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 500
                    }}>
                      {job.workMode || 'Hybrid'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.825rem', color: 'var(--color-gray-600)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Building2 size={14} color="var(--color-gray-400)" />
                      {job.department}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={14} color="var(--color-gray-400)" />
                      {job.location || 'India'}
                    </span>
                    {job.salary && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>
                        <DollarSign size={14} color="var(--color-gray-400)" />
                        {job.salary}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} color="var(--color-gray-400)" />
                      Posted: {job.createdAt} • Deadline: {job.deadline}
                    </span>
                  </div>
                </div>

                {/* Quick Pipeline Stats */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  background: '#f8fafc',
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-200)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>{job.applicantsCount || 0}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Applicants</div>
                  </div>
                  <div style={{ width: '1px', height: '24px', background: 'var(--color-gray-200)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-600)' }}>{job.shortlistedCount || 0}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Shortlisted</div>
                  </div>
                  <div style={{ width: '1px', height: '24px', background: 'var(--color-gray-200)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#8b5cf6' }}>{job.interviewsCount || 0}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Interviews</div>
                  </div>
                </div>
              </div>

              {/* Skills required */}
              {job.skills && job.skills.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', fontWeight: 600 }}>Skills:</span>
                  {job.skills.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'var(--color-primary-50)',
                        color: 'var(--color-primary-700)',
                        fontSize: '0.75rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontWeight: 500
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-gray-100)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <Link to="/recruiter/applications" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="sm" icon={<Users size={14} />}>
                    View Applicants ({job.applicantsCount || 0})
                  </Button>
                </Link>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {job.status === 'CLOSED' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<CheckCircle2 size={14} />}
                      onClick={() => handleReopen(job.id)}
                    >
                      Reopen Job
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: 'var(--color-danger-600)' }}
                      icon={<XCircle size={14} />}
                      onClick={() => setClosingJobId(job.id)}
                    >
                      Close Job
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Close Job Confirm Dialog */}
      {closingJobId && (
        <ConfirmDialog
          isOpen={!!closingJobId}
          onClose={() => setClosingJobId(null)}
          onConfirm={handleConfirmClose}
          title="Close Job Posting?"
          message="Are you sure you want to close this job posting? Candidates will no longer be able to submit new applications for this role."
          confirmText="Yes, Close Job"
          variant="danger"
        />
      )}
    </div>
  );
}
