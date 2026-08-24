import { useState } from 'react';
import {
  Building2, Search, Filter, Eye, CheckCircle2, XCircle,
  CalendarDays, MapPin, Users, Briefcase, AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';

const INITIAL_PARTICIPATION_REQUESTS = [
  {
    id: 'PART-01',
    companyName: 'TechCorp India Technologies Pvt Ltd',
    recruiterName: 'Rahul Mehta',
    recruiterPhone: '+91 80 4920 1000',
    eventName: 'Bengaluru Mega IT Job Mela 2026',
    boothPreference: 'Standard 3x3m Premium Stall',
    allocatedBooth: 'Booth B-14 (Hall 3)',
    hiringPositions: ['Senior Frontend Engineer', 'Cloud Architect', 'Backend Developer'],
    expectedHires: 15,
    requestedDate: '2026-08-22',
    status: 'APPROVED',
  },
  {
    id: 'PART-02',
    companyName: 'Swiggy',
    recruiterName: 'Sneha Rao',
    recruiterPhone: '+91 80 6123 7890',
    eventName: 'Bengaluru Mega IT Job Mela 2026',
    boothPreference: 'Corporate 6x3m Double Stall',
    allocatedBooth: 'Awaiting Allocation',
    hiringPositions: ['Product Manager', 'Data Scientist', 'UI Designer'],
    expectedHires: 25,
    requestedDate: '2026-08-23',
    status: 'PENDING',
  },
  {
    id: 'PART-03',
    companyName: 'Crypto Trading Global',
    recruiterName: 'Pooja Nair',
    recruiterPhone: '+91 98765 43219',
    eventName: 'Delhi NCR Mega Career Expo 2026',
    boothPreference: 'Standard 3x3m Premium Stall',
    allocatedBooth: 'N/A',
    hiringPositions: ['Crypto Analyst'],
    expectedHires: 2,
    requestedDate: '2026-08-21',
    status: 'REJECTED',
  },
];

export default function AdminParticipationPage() {
  const { toast } = useToast();

  const [requests, setRequests] = useState(INITIAL_PARTICIPATION_REQUESTS);
  const [search, setSearch] = useState('');

  const [selectedReq, setSelectedReq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Reject Reason Modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleApprove = (item) => {
    const stall = `Booth S-${Math.floor(10 + Math.random() * 50)} (Hall 2)`;
    setRequests(requests.map(r => r.id === item.id ? { ...r, status: 'APPROVED', allocatedBooth: stall } : r));
    if (selectedReq?.id === item.id) setSelectedReq({ ...selectedReq, status: 'APPROVED', allocatedBooth: stall });
    toast({
      type: 'success',
      title: 'Stall Allocation Approved',
      message: `Approved ${item.companyName} for ${item.eventName}. Allocated ${stall}.`,
    });
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget || !rejectionReason.trim()) return;
    setRequests(requests.map(r => r.id === rejectTarget.id ? { ...r, status: 'REJECTED' } : r));
    setRejectModalOpen(false);
    toast({
      type: 'error',
      title: 'Participation Rejected',
      message: `Participation request rejected for ${rejectTarget.companyName}.`,
    });
  };

  const filtered = requests.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.companyName.toLowerCase().includes(q) || r.eventName.toLowerCase().includes(q) || r.recruiterName.toLowerCase().includes(q);
  });

  const columns = [
    {
      key: 'companyName',
      label: 'Employer & Event',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-sm)' }}>{row.companyName}</strong>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.eventName}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Recruiter SPOC: {row.recruiterName} ({row.recruiterPhone})</p>
        </div>
      )
    },
    {
      key: 'boothPreference',
      label: 'Stall Tier & Allocation',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>{row.boothPreference}</span>
          <strong style={{ color: row.status === 'APPROVED' ? 'var(--color-success-700)' : 'var(--color-warning-700)' }}>
            {row.allocatedBooth}
          </strong>
        </div>
      )
    },
    {
      key: 'expectedHires',
      label: 'Target Hires',
      render: (v) => <span className="badge badge-primary">{v} Positions</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={v} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button size="xs" variant="outline" leftIcon={<Eye size={12} />} onClick={() => { setSelectedReq(row); setModalOpen(true); }}>
            Inspect
          </Button>
          {row.status === 'PENDING' && (
            <>
              <Button size="xs" variant="primary" onClick={() => handleApprove(row)}>
                Allocate Stall
              </Button>
              <Button size="xs" variant="danger" onClick={() => { setRejectTarget(row); setRejectionReason('Stall capacity exhausted in requested pavilion.'); setRejectModalOpen(true); }}>
                Reject
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-participation-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Building2 size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Employer Job Mela Participation Requests</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Moderate corporate booth registrations, assign pavilion halls, and dispatch candidate queues
            </p>
          </div>

          <span className="badge badge-warning" style={{ fontSize: 'var(--text-xs)', padding: '6px 14px' }}>
            {requests.filter(r => r.status === 'PENDING').length} Stalls Awaiting Allocation
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search company or event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> employer requests
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="companies" title="No participation requests" description="No requests match your search criteria." />
            </div>
          ) : (
            <Table
              columns={columns}
              data={filtered}
              rowKey="id"
            />
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedReq && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Stall Allocation Review: ${selectedReq.companyName}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{selectedReq.companyName}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{selectedReq.eventName}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Requested by: {selectedReq.recruiterName} ({selectedReq.recruiterPhone})</p>
              </div>
              <StatusBadge status={selectedReq.status} size="lg" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Stall Tier</span><strong>{selectedReq.boothPreference}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Allocated Location</span><strong style={{ color: 'var(--color-primary-600)' }}>{selectedReq.allocatedBooth}</strong></div>
            </div>

            <div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Positions to Showcase</span>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {selectedReq.hiringPositions.map((pos) => (
                  <span key={pos} className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>{pos}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button size="sm" variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
              {selectedReq.status === 'PENDING' && (
                <Button size="sm" variant="primary" leftIcon={<CheckCircle2 size={14} />} onClick={() => handleApprove(selectedReq)}>
                  Approve & Assign Stall
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <Modal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Stall Request"
          size="sm"
        >
          <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FormField label="Rejection Reason" required>
              <Textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </FormField>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="secondary" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="danger">Confirm Rejection</Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
