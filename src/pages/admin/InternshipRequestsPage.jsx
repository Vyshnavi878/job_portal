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

const INITIAL_INTERNSHIP_REQUESTS = [
  {
    id: 'INT-REQ-01',
    title: 'AI Engineering & LLM Intern',
    company: 'Razorpay Technologies',
    recruiter: 'Arjun Sen',
    location: 'Bengaluru, Karnataka',
    stipend: '₹40,000 / month',
    duration: '6 Months',
    openings: 3,
    submittedDate: '2026-08-24, 09:00 AM',
    status: 'PENDING',
    description: 'Work closely with our Core Payment AI guild to build retrieval agents and fraud anomaly detection algorithms.',
    eligibility: 'B.Tech/M.Tech Computer Science 2026/2027 batch graduating students.',
  },
  {
    id: 'INT-REQ-02',
    title: 'Product Design & UI Research Intern',
    company: 'Swiggy',
    recruiter: 'Sneha Rao',
    location: 'Remote',
    stipend: '₹30,000 / month',
    duration: '3 Months',
    openings: 2,
    submittedDate: '2026-08-23, 03:30 PM',
    status: 'PENDING',
    description: 'Help conduct usability studies and design component token variations in Figma.',
    eligibility: 'Degree in Design, HCI, or related field with strong portfolio.',
  },
];

export default function AdminInternshipRequestsPage() {
  const { toast } = useToast();

  const [requests, setRequests] = useState(INITIAL_INTERNSHIP_REQUESTS);
  const [search, setSearch] = useState('');

  const [selectedReq, setSelectedReq] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleApprove = (item) => {
    setRequests(requests.map(r => r.id === item.id ? { ...r, status: 'PUBLISHED' } : r));
    if (selectedReq?.id === item.id) setSelectedReq({ ...selectedReq, status: 'PUBLISHED' });
    toast({
      type: 'success',
      title: 'Internship Approved',
      message: `"${item.title}" by ${item.company} is now published on the portal.`,
    });
  };

  const handleOpenReject = (item) => {
    setRejectTarget(item);
    setRejectionReason('Stipend does not meet minimum fair compensation requirements.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget || !rejectionReason.trim()) return;
    setRequests(requests.map(r => r.id === rejectTarget.id ? { ...r, status: 'REJECTED' } : r));
    setRejectModalOpen(false);
    toast({
      type: 'error',
      title: 'Internship Rejected',
      message: `Internship request rejected for ${rejectTarget.company}.`,
    });
  };

  const filtered = requests.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.company.toLowerCase().includes(q);
  });

  const columns = [
    {
      key: 'title',
      label: 'Internship & Employer',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-sm)' }}>{row.title}</strong>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.company}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Recruiter: {row.recruiter} ({row.location})</p>
        </div>
      )
    },
    {
      key: 'stipend',
      label: 'Stipend & Duration',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <strong style={{ color: 'var(--color-success-700)' }}>{row.stipend}</strong>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.duration}</p>
        </div>
      )
    },
    {
      key: 'submittedDate',
      label: 'Submitted On',
      sortable: true,
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
          <Button size="xs" variant="outline" leftIcon={<Eye size={12} />} onClick={() => { setSelectedReq(row); setViewModalOpen(true); }}>
            Review
          </Button>
          {row.status === 'PENDING' && (
            <>
              <Button size="xs" variant="primary" onClick={() => handleApprove(row)}>
                Approve
              </Button>
              <Button size="xs" variant="danger" onClick={() => handleOpenReject(row)}>
                Reject
              </Button>
            </>
          )}
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
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Internship Approval Requests</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Moderate and verify student internship postings, stipend standards, and educational eligibility
            </p>
          </div>

          <span className="badge badge-warning" style={{ fontSize: 'var(--text-xs)', padding: '6px 14px' }}>
            {requests.filter(r => r.status === 'PENDING').length} Internships Awaiting Review
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
              placeholder="Search internships or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> submissions
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="internships" title="No pending requests" description="All submitted internship programs have been verified." />
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
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Internship Review: ${selectedReq.title}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{selectedReq.title}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{selectedReq.company} • Posted by {selectedReq.recruiter}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{selectedReq.location}</p>
              </div>
              <StatusBadge status={selectedReq.status} size="lg" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Stipend</span><strong>{selectedReq.stipend}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Duration</span><strong>{selectedReq.duration}</strong></div>
            </div>

            <div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Program Summary</span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.5 }}>{selectedReq.description}</p>
            </div>

            <div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Student Eligibility</span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{selectedReq.eligibility}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button size="sm" variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>
              {selectedReq.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button size="sm" variant="danger" onClick={() => { setViewModalOpen(false); handleOpenReject(selectedReq); }}>Reject</Button>
                  <Button size="sm" variant="primary" leftIcon={<CheckCircle2 size={14} />} onClick={() => handleApprove(selectedReq)}>Approve & Publish</Button>
                </div>
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
          title="Reject Internship Request"
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
