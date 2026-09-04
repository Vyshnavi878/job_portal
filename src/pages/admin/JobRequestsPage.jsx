import { useState } from 'react';
import {
  Briefcase, Search, Filter, Eye, CheckCircle2, XCircle,
  Building2, MapPin, DollarSign, Clock, AlertCircle, FileText,
  FileEdit
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

export default function AdminJobRequestsPage() {
  const { addToast } = useToast();
  const { jobs, approveJob, rejectJob, requestJobChanges } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [changesTarget, setChangesTarget] = useState(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [changesModalOpen, setChangesModalOpen] = useState(false);

  const pendingJobs = jobs.filter(j => j.status === 'PENDING');

  const filtered = pendingJobs.filter(j => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      j.title?.toLowerCase().includes(q) ||
      j.company?.toLowerCase().includes(q) ||
      j.recruiter?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q)
    );
  });

  const handleApprove = (job) => {
    approveJob(job.id);
    addToast(`"${job.title}" by ${job.company} has been APPROVED & PUBLISHED.`, 'success');
    if (selectedJob?.id === job.id) {
      setViewModalOpen(false);
    }
  };

  const handleOpenReject = (job) => {
    setRejectTarget(job);
    setRejectionReason('Job description does not comply with portal verification and wage transparency standards.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget) return;
    rejectJob(rejectTarget.id, rejectionReason || 'Rejected by administrator.');
    addToast(`Job approval rejected for "${rejectTarget.title}".`, 'info');
    setRejectModalOpen(false);
    if (selectedJob?.id === rejectTarget.id) {
      setViewModalOpen(false);
    }
    setRejectTarget(null);
  };

  const handleOpenRequestChanges = (job) => {
    setChangesTarget(job);
    setChangeNotes('Please clarify salary compensation range, educational criteria, and job responsibilities.');
    setChangesModalOpen(true);
  };

  const handleConfirmRequestChanges = (e) => {
    e.preventDefault();
    if (!changesTarget) return;
    requestJobChanges(changesTarget.id, changeNotes || 'Modifications requested by administrator.');
    addToast(`Changes requested for "${changesTarget.title}". Recruiter notified.`, 'warning');
    setChangesModalOpen(false);
    if (selectedJob?.id === changesTarget.id) {
      setViewModalOpen(false);
    }
    setChangesTarget(null);
  };

  const columns = [
    {
      key: 'title',
      label: 'Job',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{row.title}</strong>
          <span style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.company}</span>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (v) => <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v}</strong>
    },
    {
      key: 'location',
      label: 'Location',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>📍 {v}</span>
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{v || '3-5 Years'}</span>
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (v) => <strong style={{ fontSize: 'var(--text-xs)', color: '#047857' }}>{v}</strong>
    },
    {
      key: 'recruiter',
      label: 'Recruiter',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v || 'Talent Lead'}</span>
    },
    {
      key: 'postedDate',
      label: 'Submitted Date',
      sortable: true,
      render: (v) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
          {v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => (
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
          background: '#fffbeb',
          color: '#b45309',
          border: '1px solid #fde68a',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4
        }}>
          <Clock size={12} />
          {v || 'PENDING'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Button
            size="xs"
            variant="outline"
            leftIcon={<Eye size={12} />}
            onClick={() => {
              setSelectedJob(row);
              setViewModalOpen(true);
            }}
          >
            Review
          </Button>
          <Button
            size="xs"
            variant="primary"
            leftIcon={<CheckCircle2 size={12} />}
            onClick={() => handleApprove(row)}
          >
            Approve
          </Button>
          <Button
            size="xs"
            variant="danger"
            onClick={() => handleOpenReject(row)}
          >
            Reject
          </Button>
          <Button
            size="xs"
            variant="secondary"
            onClick={() => handleOpenRequestChanges(row)}
          >
            Changes
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-job-requests-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <CheckCircle2 size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Job Approval Moderation Queue</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Audit incoming employer job openings for statutory compliance, salary transparency, and accuracy before publishing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <span style={{
              background: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fde68a',
              padding: '6px 12px',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700
            }}>
              {pendingJobs.length} Pending Approvals
            </span>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
        <div style={{ position: 'relative', maxWidth: 440 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search pending jobs by title, company, recruiter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={40} />}
            title="All Job Approvals Cleared"
            description="There are currently no job approval requests waiting in the moderation queue."
          />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </div>

      {/* ── 1. Job Review Modal ── */}
      {viewModalOpen && selectedJob && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Review Job Opening: ${selectedJob.title}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Header Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              color: '#fff',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)'
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xl)',
                fontWeight: 800
              }}>
                <Briefcase size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff' }}>{selectedJob.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: '#93c5fd', margin: '2px 0 0 0' }}>{selectedJob.company} • 📍 {selectedJob.location}</p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#cbd5e1' }}>
                  <span>💰 {selectedJob.salary}</span>
                  <span>💼 Experience: {selectedJob.experience || '3-5 Years'}</span>
                  <span>🛡️ Status: {selectedJob.status}</span>
                </div>
              </div>
            </div>

            {/* Job Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Posting Parameters
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Company:</strong> {selectedJob.company}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Recruiter Lead:</strong> {selectedJob.recruiter}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Submitted Date:</strong> {selectedJob.postedDate || 'Aug 2026'}</p>
              </div>

              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Compensation & Details
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Salary Range:</strong> {selectedJob.salary}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Experience Level:</strong> {selectedJob.experience || '2-5 Years'}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Location:</strong> {selectedJob.location}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Role Description
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.6, background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                {selectedJob.description || 'Enterprise role responsibilities including software architecture, cross-functional team leadership, and quality engineering.'}
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenRequestChanges(selectedJob);
                }}
              >
                Request Changes
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenReject(selectedJob);
                }}
              >
                Reject Job
              </Button>
              <Button
                variant="primary"
                leftIcon={<CheckCircle2 size={14} />}
                onClick={() => handleApprove(selectedJob)}
              >
                Approve & Publish Job
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── 2. Reject Modal ── */}
      {rejectModalOpen && rejectTarget && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title={`Reject Job: ${rejectTarget.title}`}
          size="md"
        >
          <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Specify the moderation reason for rejecting this job posting.
            </p>

            <FormField label="Rejection Notes" required>
              <Textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                required
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger">
                Confirm Rejection
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── 3. Request Changes Modal ── */}
      {changesModalOpen && changesTarget && (
        <Modal
          isOpen={changesModalOpen}
          onClose={() => setChangesModalOpen(false)}
          title={`Request Changes: ${changesTarget.title}`}
          size="md"
        >
          <form onSubmit={handleConfirmRequestChanges} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Specify the requested modifications for the recruiter before this job can be approved.
            </p>

            <FormField label="Modification Instructions" required>
              <Textarea
                rows={3}
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                placeholder="Required modifications..."
                required
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setChangesModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Request to Recruiter
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
