import { useState } from 'react';
import {
  UserCheck, Search, Filter, Eye, CheckCircle2, XCircle,
  FileText, ShieldCheck, Building2, Mail, Phone, MapPin,
  AlertCircle, Download, ExternalLink
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

export default function AdminRecruiterRequestsPage() {
  const { addToast } = useToast();
  const { recruiters, verifyRecruiter, suspendRecruiter } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const pendingRequests = recruiters.filter(r => r.verificationStatus === 'PENDING');

  const filtered = pendingRequests.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.company?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q)
    );
  });

  const handleApprove = (req) => {
    verifyRecruiter(req.id);
    addToast(`Recruiter ${req.name} (${req.company}) has been VERIFIED & APPROVED.`, 'success');
    if (selectedReq?.id === req.id) {
      setViewModalOpen(false);
    }
  };

  const handleOpenReject = (req) => {
    setRejectTarget(req);
    setRejectionReason('Official organizational email address or employer authorization proof could not be verified.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget) return;
    suspendRecruiter(rejectTarget.id);
    addToast(`Recruiter verification rejected for ${rejectTarget.name}.`, 'info');
    setRejectModalOpen(false);
    if (selectedReq?.id === rejectTarget.id) {
      setViewModalOpen(false);
    }
    setRejectTarget(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Recruiter',
      sortable: true,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 'var(--text-sm)'
          }}>
            {row.name?.[0] || 'R'}
          </div>
          <div>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{row.name}</strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.designation || 'Talent Lead'}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{row.company}</strong>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>{row.industry || 'IT & Services'}</span>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>📍 {row.location || 'India'}</span>
        </div>
      )
    },
    {
      key: 'registrationDate',
      label: 'Submitted Date',
      sortable: true,
      render: (v) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
          {v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026'}
        </span>
      )
    },
    {
      key: 'verificationStatus',
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
          <AlertCircle size={12} />
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
    <div className="admin-recruiter-requests-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <ShieldCheck size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Recruiter Verification Requests</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Verify recruiter identity, company affiliation proofs, and authorization before granting hiring access.
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
              {pendingRequests.length} Pending Verifications
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
            placeholder="Search pending recruiter by name, company, email..."
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
            title="All Recruiter Requests Handled"
            description="There are currently no pending recruiter verification requests in the queue."
          />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </div>

      {/* ── 1. Review Dossier Modal ── */}
      {viewModalOpen && selectedReq && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Review Verification: ${selectedReq.name}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Header Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
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
                {selectedReq.name?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff' }}>{selectedReq.name}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: '#c7d2fe', margin: '2px 0 0 0' }}>{selectedReq.designation} • {selectedReq.company}</p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#e0e7ff' }}>
                  <span>📍 {selectedReq.location || 'India'}</span>
                  <span>📅 Submitted: {selectedReq.registrationDate || 'Aug 2026'}</span>
                </div>
              </div>
            </div>

            {/* Recruiter Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Employer Details
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Company:</strong> {selectedReq.company}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Official Email:</strong> {selectedReq.email}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Phone:</strong> {selectedReq.phone || '+91 80 4920 1000'}</p>
              </div>

              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Verification Documents
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', background: '#fff', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={14} style={{ color: 'var(--color-primary-600)' }} />
                      <span>Company_Authorization_Letter.pdf</span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', background: '#fff', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={14} style={{ color: 'var(--color-primary-600)' }} />
                      <span>Recruiter_Government_ID.pdf</span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Verified</span>
                  </div>
                </div>
              </div>
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
                Approve & Verify Recruiter
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
          title={`Reject Recruiter Verification: ${rejectTarget.name}`}
          size="md"
        >
          <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Specify the moderation reason for rejecting recruiter verification for {rejectTarget.name}.
            </p>

            <FormField label="Rejection Reason" required>
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
