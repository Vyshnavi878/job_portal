import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Search, Filter, Eye, CheckCircle2, XCircle,
  Building2, MapPin, DollarSign, Clock, ShieldAlert, AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { MOCK_JOBS } from '../../data/mockData';

const ALL_ADMIN_JOBS = [
  ...MOCK_JOBS.map(j => ({ ...j, applicantsCount: Math.floor(12 + Math.random() * 80) })),
  {
    id: '99',
    title: 'Senior Cloud Security Architect',
    company: 'TechCorp India',
    salary: '₹32 - ₹48 LPA',
    location: 'Bengaluru',
    type: 'Full-time',
    status: 'PENDING',
    postedDate: '2026-08-24',
    applicantsCount: 0,
  },
  {
    id: '100',
    title: 'Spam Casino Operator',
    company: 'Rogue Offshores',
    salary: '₹50 LPA',
    location: 'Remote',
    type: 'Full-time',
    status: 'SUSPENDED',
    postedDate: '2026-08-10',
    applicantsCount: 3,
  },
];

export default function AdminJobsPage() {
  const { toast } = useToast();

  const [jobs, setJobs] = useState(ALL_ADMIN_JOBS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Suspend / Close target
  const [suspendTarget, setSuspendTarget] = useState(null);

  const filterTabs = [
    { key: 'ALL', label: 'All Jobs' },
    { key: 'PUBLISHED', label: 'Published' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'DRAFT', label: 'Draft' },
    { key: 'CLOSED', label: 'Closed' },
    { key: 'EXPIRED', label: 'Expired' },
    { key: 'SUSPENDED', label: 'Suspended' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!j.title.toLowerCase().includes(q) && !j.company.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'ALL' && j.status !== statusFilter) return false;
      return true;
    });
  }, [jobs, search, statusFilter]);

  const handleApprove = (j) => {
    setJobs(jobs.map(item => item.id === j.id ? { ...item, status: 'PUBLISHED' } : item));
    toast({ type: 'success', title: 'Job Approved', message: `"${j.title}" is now published.` });
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    setJobs(jobs.map(item => item.id === suspendTarget.id ? { ...item, status: 'SUSPENDED' } : item));
    toast({ type: 'error', title: 'Job Suspended', message: `"${suspendTarget.title}" suspended.` });
    setSuspendTarget(null);
  };

  const columns = [
    {
      key: 'title',
      label: 'Job Title & Employer',
      sortable: true,
      render: (_, row) => (
        <div>
          <Link to={`/jobs/${row.id}`} target="_blank" style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)', textDecoration: 'none' }}>
            {row.title}
          </Link>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.company}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.location} ({row.type})</p>
        </div>
      )
    },
    {
      key: 'salary',
      label: 'CTC Range',
      render: (v) => <strong style={{ color: 'var(--color-success-700)', fontSize: 'var(--text-xs)' }}>{v}</strong>
    },
    {
      key: 'applicantsCount',
      label: 'Applicants',
      sortable: true,
      render: (v) => <span className="badge badge-primary">{v} Candidates</span>
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
          <Link to={`/jobs/${row.id}`} target="_blank">
            <Button size="xs" variant="outline" leftIcon={<Eye size={12} />}>
              View
            </Button>
          </Link>

          {row.status === 'PENDING' && (
            <Button size="xs" variant="primary" onClick={() => handleApprove(row)}>
              Approve
            </Button>
          )}

          {row.status === 'PUBLISHED' && (
            <Button size="xs" variant="danger" onClick={() => setSuspendTarget(row)}>
              Suspend
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-jobs-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Briefcase size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Master Jobs Directory</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Manage all published, draft, expired, and suspended job postings across all registered companies
            </p>
          </div>

          <Link to="/admin/jobs/requests">
            <Button variant="primary" size="sm">
              View Approval Queue (28)
            </Button>
          </Link>
        </div>

        {/* Status Filter Tabs (ALL, DRAFT, PENDING, PUBLISHED, REJECTED, CLOSED, EXPIRED, SUSPENDED) */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', overflowX: 'auto', paddingBottom: 4 }}>
          {filterTabs.map((tab) => {
            const count = tab.key === 'ALL' ? jobs.length : jobs.filter(j => j.status === tab.key).length;
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
              placeholder="Search jobs by title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> postings
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="jobs" title="No jobs match filter" description="No jobs found matching your criteria." />
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

      {/* Suspend Confirmation Dialog */}
      <ConfirmDialog
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleConfirmSuspend}
        title="Suspend Job Posting?"
        message={`Are you sure you want to suspend "${suspendTarget?.title}"? It will immediately be hidden from search engines and candidate listings.`}
        confirmText="Yes, Suspend Job"
        danger
      />

    </div>
  );
}
