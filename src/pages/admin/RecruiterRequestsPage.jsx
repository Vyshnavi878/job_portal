import { useState } from 'react';
import {
  UserCheck, Search, Filter, Eye, CheckCircle2, XCircle,
  FileText, ShieldCheck, Building2, Mail, Phone, MapPin,
  AlertCircle, Download, ExternalLink
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';

const INITIAL_REQUESTS = [
  {
    id: 'REQ-101',
    recruiterName: 'Rahul Mehta',
    designation: 'Senior Talent Acquisition Lead',
    email: 'rahul.mehta@techcorp-india.example.com',
    phone: '+91 80 4920 1000',
    companyName: 'TechCorp India Technologies Pvt Ltd',
    companyWebsite: 'https://techcorp-india.example.com',
    industry: 'Information Technology',
    companySize: '1000-5000 employees',
    location: 'Bengaluru, Karnataka',
    submittedDate: '2026-08-24, 09:30 AM',
    status: 'PENDING',
    cinNumber: 'U72200KA2012PTC064123',
    gstNumber: '29ABCDE1234F1Z5',
    documents: [
      { name: 'Certificate_of_Incorporation_MCA.pdf', size: '2.4 MB', type: 'COI' },
      { name: 'GSTIN_Registration_Certificate.pdf', size: '1.1 MB', type: 'GST' },
      { name: 'Authorized_Recruiter_ID_Proof.pdf', size: '850 KB', type: 'ID' },
    ]
  },
  {
    id: 'REQ-102',
    recruiterName: 'Vikram Seth',
    designation: 'VP of Human Resources',
    email: 'vikram.seth@fintech-innovations.example.com',
    phone: '+91 22 6123 4567',
    companyName: 'Fintech Innovations Ltd',
    companyWebsite: 'https://fintech-innovations.example.com',
    industry: 'Financial Services',
    companySize: '500-1000 employees',
    location: 'Mumbai, Maharashtra',
    submittedDate: '2026-08-24, 08:15 AM',
    status: 'PENDING',
    cinNumber: 'L65990MH2016PLC281920',
    gstNumber: '27AABCF5678G1Z2',
    documents: [
      { name: 'MCA_COI_Certificate.pdf', size: '3.1 MB', type: 'COI' },
      { name: 'GST_Certificate_Form_REG06.pdf', size: '1.4 MB', type: 'GST' },
    ]
  },
  {
    id: 'REQ-103',
    recruiterName: 'Ananya Roy',
    designation: 'Director Talent Acquisition',
    email: 'ananya.roy@healthtech-diagnostics.example.com',
    phone: '+91 40 4012 3456',
    companyName: 'HealthTech Diagnostics India',
    companyWebsite: 'https://healthtech.example.com',
    industry: 'Healthcare',
    companySize: '200-500 employees',
    location: 'Hyderabad, Telangana',
    submittedDate: '2026-08-23, 04:45 PM',
    status: 'PENDING',
    cinNumber: 'U85110TG2018PTC125890',
    gstNumber: '36AAACH9012J1Z8',
    documents: [
      { name: 'Incorporation_Proof.pdf', size: '1.9 MB', type: 'COI' },
      { name: 'Official_ID_Proof.pdf', size: '650 KB', type: 'ID' },
    ]
  }
];

export default function AdminRecruiterRequestsPage() {
  const { toast } = useToast();

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [search, setSearch] = useState('');

  // View Details Modal
  const [selectedReq, setSelectedReq] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Reject Reason Modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleApprove = (req) => {
    setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'APPROVED' } : r));
    if (selectedReq?.id === req.id) {
      setSelectedReq({ ...selectedReq, status: 'APPROVED' });
    }
    toast({
      type: 'success',
      title: 'Recruiter Verified & Approved',
      message: `${req.recruiterName} (${req.companyName}) has been approved. Login access enabled.`,
    });
  };

  const handleOpenRejectModal = (req) => {
    setRejectTarget(req);
    setRejectionReason('Official GSTIN or Certificate of Incorporation mismatch with MCA database.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget || !rejectionReason.trim()) return;
    setRequests(requests.map(r => r.id === rejectTarget.id ? { ...r, status: 'REJECTED' } : r));
    if (selectedReq?.id === rejectTarget.id) {
      setSelectedReq({ ...selectedReq, status: 'REJECTED' });
    }
    setRejectModalOpen(false);
    toast({
      type: 'error',
      title: 'Recruiter Request Rejected',
      message: `Registration request for ${rejectTarget.companyName} rejected. Reason sent to applicant.`,
    });
  };

  const filtered = requests.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.recruiterName.toLowerCase().includes(q) || r.companyName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
  });

  const columns = [
    {
      key: 'recruiterName',
      label: 'Recruiter & Company',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-sm)' }}>{row.recruiterName}</strong>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.companyName}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.designation}</p>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Contact Info',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <p>{row.email}</p>
          <p style={{ color: 'var(--color-text-muted)' }}>{row.phone}</p>
        </div>
      )
    },
    {
      key: 'submittedDate',
      label: 'Submitted Date',
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
            Review Docs
          </Button>
          {row.status === 'PENDING' && (
            <>
              <Button size="xs" variant="primary" onClick={() => handleApprove(row)}>
                Approve
              </Button>
              <Button size="xs" variant="danger" onClick={() => handleOpenRejectModal(row)}>
                Reject
              </Button>
            </>
          )}
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
              <UserCheck size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Recruiter Verification Requests</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Review business registration credentials (COI, GSTIN, ID proof) before granting employer portal access
            </p>
          </div>

          <span className="badge badge-warning" style={{ fontSize: 'var(--text-xs)', padding: '6px 14px' }}>
            {requests.filter(r => r.status === 'PENDING').length} Pending Verifications
          </span>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search by recruiter or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> verification requests
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="default" title="No verification requests" description="All recruiter registration requests have been moderated." />
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

      {/* ── Document Review Modal ── */}
      {selectedReq && (
        <Modal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Verification Review: ${selectedReq.companyName}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Header info */}
            <div style={{
              background: 'var(--color-gray-50)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{selectedReq.companyName}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{selectedReq.recruiterName} ({selectedReq.designation})</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Email: {selectedReq.email} • Phone: {selectedReq.phone} • Location: {selectedReq.location}
                </p>
              </div>
              <StatusBadge status={selectedReq.status} size="lg" />
            </div>

            {/* Legal Registration Data */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Corporate Identity Number (CIN)</span>
                <strong>{selectedReq.cinNumber}</strong>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Goods & Services Tax (GSTIN)</span>
                <strong>{selectedReq.gstNumber}</strong>
              </div>
            </div>

            {/* Uploaded Verification Documents */}
            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                Submitted Verification Documents ({selectedReq.documents.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {selectedReq.documents.map((doc, idx) => (
                  <div key={idx} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-gray-50)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <FileText size={18} style={{ color: 'var(--color-primary-600)' }} />
                      <div>
                        <strong style={{ fontSize: 'var(--text-xs)' }}>{doc.name}</strong>
                        <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Size: {doc.size} • Type: {doc.type}</p>
                      </div>
                    </div>

                    <Button size="xs" variant="outline" leftIcon={<Download size={12} />} onClick={() => toast({ type: 'info', title: 'Downloading Document', message: `Downloading ${doc.name}` })}>
                      Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button variant="secondary" size="sm" onClick={() => setViewModalOpen(false)}>
                Close Preview
              </Button>

              {selectedReq.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button variant="danger" size="sm" onClick={() => { setViewModalOpen(false); handleOpenRejectModal(selectedReq); }}>
                    Reject Request
                  </Button>
                  <Button variant="primary" size="sm" leftIcon={<CheckCircle2 size={14} />} onClick={() => handleApprove(selectedReq)}>
                    Approve Recruiter
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── Reject Reason Modal (Required for Rejections) ── */}
      {rejectTarget && (
        <Modal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Recruiter Registration"
          size="sm"
        >
          <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Please provide the official reason for rejecting <strong>{rejectTarget.companyName}</strong>. This feedback will be sent directly to the applicant's email address.
            </p>

            <FormField label="Official Reason for Rejection" required>
              <Textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Uploaded GST document is blurred / CIN not found on MCA portal..."
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
