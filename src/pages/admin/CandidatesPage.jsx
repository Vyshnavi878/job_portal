import { useState, useMemo } from 'react';
import {
  Users, Search, Filter, Eye, ShieldAlert, ShieldCheck,
  Mail, Phone, MapPin, GraduationCap, Briefcase, FileText,
  CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';

const INITIAL_CANDIDATES = [
  {
    id: 'CAND-01',
    name: 'Priya Sharma',
    headline: 'Senior React & Frontend Engineer',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    experience: '4.2 Years',
    education: "B.Tech Computer Science, VTU",
    skills: ['React', 'TypeScript', 'Node.js', 'Redux Toolkit'],
    totalApplications: 18,
    interviewsScheduled: 2,
    status: 'ACTIVE',
    registeredOn: '2025-08-14',
  },
  {
    id: 'CAND-02',
    name: 'Amitav Ghosh',
    headline: 'Staff Software Engineer',
    email: 'amitav.ghosh@example.com',
    phone: '+91 98123 45678',
    location: 'Bengaluru, Karnataka',
    experience: '8.5 Years',
    education: "B.E. Information Technology, Jadavpur University",
    skills: ['Java', 'Spring Boot', 'Kafka', 'AWS'],
    totalApplications: 6,
    interviewsScheduled: 1,
    status: 'ACTIVE',
    registeredOn: '2025-10-20',
  },
  {
    id: 'CAND-03',
    name: 'Sneha Kulkarni',
    headline: 'UI/UX Product Designer',
    email: 'sneha.kulkarni@example.com',
    phone: '+91 97654 32109',
    location: 'Pune, Maharashtra',
    experience: '3.0 Years',
    education: "M.Tech Software Systems, BITS Pilani",
    skills: ['Figma', 'UX Research', 'Design Systems'],
    totalApplications: 12,
    interviewsScheduled: 3,
    status: 'ACTIVE',
    registeredOn: '2026-01-05',
  },
  {
    id: 'CAND-04',
    name: 'Vikram Patel',
    headline: 'DevOps & Security Engineer',
    email: 'vikram.patel@example.com',
    phone: '+91 98765 01234',
    location: 'Hyderabad, Telangana',
    experience: '5.1 Years',
    education: "B.Tech IT, NIT Warangal",
    skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    totalApplications: 9,
    interviewsScheduled: 1,
    status: 'ACTIVE',
    registeredOn: '2026-02-14',
  },
  {
    id: 'CAND-05',
    name: 'Spam User 909',
    headline: 'Bot Automated Submissions',
    email: 'bot909@disposable-email.com',
    phone: '+91 90000 00000',
    location: 'Unknown',
    experience: '0.0 Years',
    education: "None",
    skills: ['Spamming'],
    totalApplications: 140,
    interviewsScheduled: 0,
    status: 'SUSPENDED',
    registeredOn: '2026-08-01',
  },
];

export default function AdminCandidatesPage() {
  const { toast } = useToast();

  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Candidate Profile Modal
  const [selectedCand, setSelectedCand] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Suspend Dialog
  const [suspendTarget, setSuspendTarget] = useState(null);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !c.skills.some(s => s.toLowerCase().includes(q))) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      return true;
    });
  }, [candidates, search, statusFilter]);

  const handleActivate = (c) => {
    setCandidates(candidates.map(item => item.id === c.id ? { ...item, status: 'ACTIVE' } : item));
    toast({ type: 'success', title: 'Candidate Activated', message: `${c.name} account is now active.` });
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    setCandidates(candidates.map(item => item.id === suspendTarget.id ? { ...item, status: 'SUSPENDED' } : item));
    toast({ type: 'error', title: 'Candidate Account Suspended', message: `${suspendTarget.name} has been suspended.` });
    setSuspendTarget(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Candidate Name',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-sm)' }}>{row.name}</strong>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.headline}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.location}</p>
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
      key: 'experience',
      label: 'Experience & Education',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <strong>{row.experience}</strong>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.education}</p>
        </div>
      )
    },
    {
      key: 'totalApplications',
      label: 'Activity',
      sortable: true,
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <span className="badge badge-primary">{row.totalApplications} Applications</span>
          <p style={{ fontSize: '10px', color: 'var(--color-success-700)', marginTop: 2 }}>{row.interviewsScheduled} Interviews</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <span className={`badge ${v === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{v}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Button size="xs" variant="outline" leftIcon={<Eye size={12} />} onClick={() => { setSelectedCand(row); setProfileModalOpen(true); }}>
            Profile
          </Button>

          {row.status === 'ACTIVE' ? (
            <Button size="xs" variant="danger" onClick={() => setSuspendTarget(row)}>
              Suspend
            </Button>
          ) : (
            <Button size="xs" variant="secondary" onClick={() => handleActivate(row)}>
              Activate
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-candidates-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Users size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Candidate Talent Directory</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Inspect candidate profiles, monitor application velocities, and manage account security
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All ({candidates.length})
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'ACTIVE' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setStatusFilter('ACTIVE')}
            >
              Active ({candidates.filter(c => c.status === 'ACTIVE').length})
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'SUSPENDED' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setStatusFilter('SUSPENDED')}
            >
              Suspended ({candidates.filter(c => c.status === 'SUSPENDED').length})
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search by candidate name, skill, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> registered candidates
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="default" title="No candidates found" description="No candidates matched your search filter." />
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

      {/* ── Candidate Profile Modal ── */}
      {selectedCand && (
        <Modal
          open={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title={`Candidate Profile: ${selectedCand.name}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{selectedCand.name}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{selectedCand.headline}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Registered on: {selectedCand.registeredOn}</p>
              </div>
              <span className={`badge ${selectedCand.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{selectedCand.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Email</span><strong>{selectedCand.email}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Phone</span><strong>{selectedCand.phone}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Location</span><strong>{selectedCand.location}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Total Applications</span><strong>{selectedCand.totalApplications} Sent</strong></div>
            </div>

            <div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--space-2)' }}>
                Skills & Tech Stack
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {selectedCand.skills.map((s) => (
                  <span key={s} className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button size="sm" variant="secondary" onClick={() => setProfileModalOpen(false)}>
                Close
              </Button>
              {selectedCand.status === 'ACTIVE' ? (
                <Button size="sm" variant="danger" onClick={() => { setProfileModalOpen(false); setSuspendTarget(selectedCand); }}>
                  Suspend Candidate
                </Button>
              ) : (
                <Button size="sm" variant="primary" onClick={() => { handleActivate(selectedCand); setProfileModalOpen(false); }}>
                  Activate Candidate
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Suspend Confirm Dialog */}
      <ConfirmDialog
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleConfirmSuspend}
        title="Suspend Candidate Account?"
        message={`Are you sure you want to suspend "${suspendTarget?.name}"? They will no longer be able to log in or apply to open positions.`}
        confirmText="Yes, Suspend Account"
        danger
      />

    </div>
  );
}
