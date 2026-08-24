import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Search, Filter, Eye, ShieldAlert, ShieldCheck,
  Building2, Briefcase, Mail, Phone, MapPin, MoreVertical,
  CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';

const INITIAL_RECRUITERS = [
  {
    id: 'REC-01',
    name: 'Rahul Mehta',
    designation: 'Senior Talent Acquisition Lead',
    email: 'rahul.mehta@techcorp-india.example.com',
    phone: '+91 80 4920 1000',
    company: 'TechCorp India Technologies Pvt Ltd',
    industry: 'Information Technology',
    location: 'Bengaluru, Karnataka',
    activeJobsCount: 6,
    totalApplicantsHired: 18,
    status: 'APPROVED',
    joinedDate: '2025-11-12',
  },
  {
    id: 'REC-02',
    name: 'Kavita Menon',
    designation: 'HR Business Partner',
    email: 'kavita.menon@flipkart.example.com',
    phone: '+91 80 6798 1234',
    company: 'Flipkart India',
    industry: 'E-Commerce',
    location: 'Bengaluru, Karnataka',
    activeJobsCount: 14,
    totalApplicantsHired: 42,
    status: 'APPROVED',
    joinedDate: '2025-06-18',
  },
  {
    id: 'REC-03',
    name: 'Sameer Sen',
    designation: 'Director Recruiting',
    email: 'sameer.sen@infosys.example.com',
    phone: '+91 80 2852 0261',
    company: 'Infosys Ltd',
    industry: 'Information Technology',
    location: 'Bengaluru, Karnataka',
    activeJobsCount: 22,
    totalApplicantsHired: 89,
    status: 'APPROVED',
    joinedDate: '2025-01-10',
  },
  {
    id: 'REC-04',
    name: 'Pooja Nair',
    designation: 'Staffing Specialist',
    email: 'pooja.nair@cryptotrading.example.com',
    phone: '+91 98765 43219',
    company: 'Crypto Trading Global',
    industry: 'Financial Services',
    location: 'Remote',
    activeJobsCount: 0,
    totalApplicantsHired: 0,
    status: 'SUSPENDED',
    joinedDate: '2026-03-15',
  },
  {
    id: 'REC-05',
    name: 'Deepak Varma',
    designation: 'Tech Recruiter',
    email: 'deepak.varma@fakefirm.example.com',
    phone: '+91 91234 56789',
    company: 'Fake Consultants India',
    industry: 'Consulting',
    location: 'Noida, Uttar Pradesh',
    activeJobsCount: 0,
    totalApplicantsHired: 0,
    status: 'REJECTED',
    joinedDate: '2026-08-01',
  },
];

export default function AdminRecruitersPage() {
  const { toast } = useToast();

  const [recruiters, setRecruiters] = useState(INITIAL_RECRUITERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // View modal
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Suspend Dialog
  const [suspendTarget, setSuspendTarget] = useState(null);

  const filterTabs = [
    { key: 'ALL', label: 'All Recruiters' },
    { key: 'APPROVED', label: 'Approved & Active' },
    { key: 'PENDING', label: 'Pending Verification' },
    { key: 'SUSPENDED', label: 'Suspended' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  const filtered = useMemo(() => {
    return recruiters.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.company.toLowerCase().includes(q) && !r.email.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      return true;
    });
  }, [recruiters, search, statusFilter]);

  const handleActivate = (r) => {
    setRecruiters(recruiters.map(item => item.id === r.id ? { ...item, status: 'APPROVED' } : item));
    toast({ type: 'success', title: 'Recruiter Activated', message: `${r.name} has been activated.` });
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    setRecruiters(recruiters.map(item => item.id === suspendTarget.id ? { ...item, status: 'SUSPENDED' } : item));
    toast({ type: 'error', title: 'Recruiter Suspended', message: `${suspendTarget.name} has been suspended.` });
    setSuspendTarget(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Recruiter & Company',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-sm)' }}>{row.name}</strong>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.company}</p>
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
      key: 'activeJobsCount',
      label: 'Jobs & Hires',
      sortable: true,
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <span className="badge badge-primary">{row.activeJobsCount} Active Jobs</span>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 2 }}>{row.totalApplicantsHired} Hired</p>
        </div>
      )
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
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Button size="xs" variant="outline" leftIcon={<Eye size={12} />} onClick={() => { setSelectedRecruiter(row); setViewModalOpen(true); }}>
            Profile
          </Button>

          <Link to="/admin/jobs">
            <Button size="xs" variant="ghost" title="View Recruiter Jobs">
              <Briefcase size={13} />
            </Button>
          </Link>

          {row.status === 'APPROVED' ? (
            <Button size="xs" variant="danger" onClick={() => setSuspendTarget(row)} title="Suspend Recruiter">
              Suspend
            </Button>
          ) : row.status === 'SUSPENDED' ? (
            <Button size="xs" variant="secondary" onClick={() => handleActivate(row)} title="Activate Recruiter">
              Activate
            </Button>
          ) : null}
        </div>
      )
    }
  ];

  return (
    <div className="admin-recruiters-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Users size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Recruiter Directory & Management</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Manage corporate hiring managers, suspend rogue accounts, and audit recruitment activities
            </p>
          </div>

          <Link to="/admin/recruiters/requests">
            <Button variant="primary" size="sm">
              View Verification Queue
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', overflowX: 'auto', paddingBottom: 4 }}>
          {filterTabs.map((tab) => {
            const count = tab.key === 'ALL' ? recruiters.length : recruiters.filter(r => r.status === tab.key).length;
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: active ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                  background: active ? 'var(--color-primary-600)' : 'var(--color-surface)',
                  color: active ? '#fff' : 'var(--color-text-muted)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {tab.label}
                <span style={{
                  background: active ? 'rgba(255,255,255,0.25)' : 'var(--color-gray-100)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '10px'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search by recruiter, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> recruiters
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="default" title="No recruiters found" description="No recruiters match your search filter." />
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

      {/* ── Recruiter Profile Details Modal ── */}
      {selectedRecruiter && (
        <Modal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Recruiter Dossier: ${selectedRecruiter.name}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{selectedRecruiter.name}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{selectedRecruiter.designation}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{selectedRecruiter.company}</p>
              </div>
              <StatusBadge status={selectedRecruiter.status} size="lg" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Email</span><strong>{selectedRecruiter.email}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Phone</span><strong>{selectedRecruiter.phone}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Active Job Postings</span><strong>{selectedRecruiter.activeJobsCount}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Total Candidates Hired</span><strong>{selectedRecruiter.totalApplicantsHired}</strong></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <Link to="/admin/jobs">
                <Button size="sm" variant="outline" leftIcon={<Briefcase size={14} />}>
                  Inspect All Posted Jobs
                </Button>
              </Link>
              <Button size="sm" variant="secondary" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Suspend Confirmation Dialog */}
      <ConfirmDialog
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleConfirmSuspend}
        title="Suspend Recruiter Access?"
        message={`Are you sure you want to suspend recruiter account "${suspendTarget?.name}"? All active job postings will be hidden and portal login revoked.`}
        confirmText="Yes, Suspend Recruiter"
        danger
      />

    </div>
  );
}
