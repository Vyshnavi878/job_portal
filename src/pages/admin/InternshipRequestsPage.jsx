import { useState } from 'react';
import {
  GraduationCap, Search, Eye, CheckCircle2, XCircle,
  Building2, MapPin, DollarSign, Clock, AlertCircle
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
import { formatInternshipId } from '../../utils/applicationUtils';

export default function AdminInternshipRequestsPage() {
  const { addToast } = useToast();
  const { internships, approveInternship, rejectInternship } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const pendingInternships = internships.filter(i => i.status === 'PENDING');

  const filtered = pendingInternships.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      (formatInternshipId(r.id) || '').toLowerCase().includes(q) ||
      String(r.id || '').toLowerCase().includes(q) ||
      r.company?.toLowerCase().includes(q)
    );
  });

  const handleApprove = (item) => {
    approveInternship(item.id);
    addToast(`Internship "${item.title}" by ${item.company} has been APPROVED & PUBLISHED.`, 'success');
    if (selectedReq?.id === item.id) {
      setViewModalOpen(false);
    }
  };

  const handleOpenReject = (item) => {
    setRejectTarget(item);
    setRejectionReason('Stipend does not meet minimum fair compensation requirements.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget || !rejectionReason.trim()) return;
    rejectInternship(rejectTarget.id, rejectionReason);
    addToast(`Internship request rejected for ${rejectTarget.company}.`, 'info');
    setRejectModalOpen(false);
    if (selectedReq?.id === rejectTarget.id) {
      setViewModalOpen(false);
    }
    setRejectTarget(null);
  };

  const columns = [
    {
      key: 'title',
      label: 'Internship',
      sortable: true,
      render: (_, row) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{row.title}</strong>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              fontWeight: 700,
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              padding: '1px 6px',
              borderRadius: '4px'
            }}>
              {formatInternshipId(row.id)}
            </span>
          </div>
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
      key: 'duration',
      label: 'Duration',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>⏳ {v || '3 Months'}</span>
    },
    {
      key: 'stipend',
      label: 'Stipend',
      render: (v) => <strong style={{ fontSize: 'var(--text-xs)', color: '#047857' }}>{v}</strong>
    },
    {
      key: 'location',
      label: 'Location',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>📍 {v}</span>
    },
    {
      key: 'submittedDate',
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
              setSelectedReq(row);
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
        </div>
      )
    }
  ];

  return (
    <div className="admin-internship-requests-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <GraduationCap size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Internship Approvals Queue</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Audit incoming employer internship postings for stipend fairness and training quality before publishing.
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
              {pendingInternships.length} Pending Approvals
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
            placeholder="Search pending internships by title, company..."
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
            title="All Internship Approvals Cleared"
            description="There are currently no internship approval requests waiting in the queue."
          />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </div>

      {/* ── 1. Internship Review Modal ── */}
      {viewModalOpen && selectedReq && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Review Internship: ${selectedReq.title}`}
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
                <GraduationCap size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>{selectedReq.title}</span>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {formatInternshipId(selectedReq.id)}
                  </span>
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: '#93c5fd', margin: '2px 0 0 0' }}>{selectedReq.company} • 📍 {selectedReq.location}</p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#cbd5e1' }}>
                  <span>💰 Stipend: {selectedReq.stipend}</span>
                  <span>⏳ Duration: {selectedReq.duration || '3 Months'}</span>
                  <span>📅 Submitted: {selectedReq.submittedDate || 'Aug 2026'}</span>
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Employer & Location
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <strong>Internship ID:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary-600)' }}>{formatInternshipId(selectedReq.id)}</span>
                </p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Company:</strong> {selectedReq.company}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Location:</strong> {selectedReq.location}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Submitted Date:</strong> {selectedReq.submittedDate || 'Aug 2026'}</p>
              </div>

              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Stipend & Capacity
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Stipend:</strong> {selectedReq.stipend}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Duration:</strong> {selectedReq.duration || '3 Months'}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Openings:</strong> {selectedReq.openings || 2} Interns</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Internship Objectives & Eligibility
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.6, background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                {selectedReq.description || 'Hands-on practical industry internship providing direct mentorship, project delivery exposure, and career growth pathways.'}
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenReject(selectedReq);
                }}
              >
                Reject Request
              </Button>
              <Button
                variant="primary"
                leftIcon={<CheckCircle2 size={14} />}
                onClick={() => handleApprove(selectedReq)}
              >
                Approve & Publish Internship
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
          title={`Reject Internship: ${rejectTarget.title}`}
          size="md"
        >
          <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Specify the moderation reason for rejecting this internship posting.
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
    </div>
  );
}
