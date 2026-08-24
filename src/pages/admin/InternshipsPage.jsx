import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Search, Filter, Eye, CheckCircle2, XCircle,
  Building2, MapPin, DollarSign, Clock, ShieldAlert, AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { MOCK_INTERNSHIPS } from '../../data/mockData';

export default function AdminInternshipsPage() {
  const { toast } = useToast();

  const [internships, setInternships] = useState(MOCK_INTERNSHIPS.map(i => ({
    ...i,
    applicantsCount: Math.floor(15 + Math.random() * 50),
    status: 'PUBLISHED',
  })));

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [suspendTarget, setSuspendTarget] = useState(null);

  const filterTabs = [
    { key: 'ALL', label: 'All Internships' },
    { key: 'PUBLISHED', label: 'Published' },
    { key: 'PENDING', label: 'Pending Review' },
    { key: 'CLOSED', label: 'Closed' },
    { key: 'SUSPENDED', label: 'Suspended' },
  ];

  const filtered = useMemo(() => {
    return internships.filter((item) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.company.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      return true;
    });
  }, [internships, search, statusFilter]);

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    setInternships(internships.map(i => i.id === suspendTarget.id ? { ...i, status: 'SUSPENDED' } : i));
    toast({ type: 'error', title: 'Internship Suspended', message: `"${suspendTarget.title}" suspended.` });
    setSuspendTarget(null);
  };

  const columns = [
    {
      key: 'title',
      label: 'Internship Role & Company',
      sortable: true,
      render: (_, row) => (
        <div>
          <Link to={`/internships/${row.id}`} target="_blank" style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)', textDecoration: 'none' }}>
            {row.title}
          </Link>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.company}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.location} ({row.duration})</p>
        </div>
      )
    },
    {
      key: 'stipend',
      label: 'Stipend',
      render: (v) => <strong style={{ color: 'var(--color-success-700)', fontSize: 'var(--text-xs)' }}>{v}</strong>
    },
    {
      key: 'applicantsCount',
      label: 'Applicants',
      sortable: true,
      render: (v) => <span className="badge badge-primary">{v} Students</span>
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
          <Link to={`/internships/${row.id}`} target="_blank">
            <Button size="xs" variant="outline" leftIcon={<Eye size={12} />}>
              View
            </Button>
          </Link>

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
    <div className="admin-internships-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <GraduationCap size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Master Internships Directory</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Inspect and moderate all active student internships and campus trainee programs
            </p>
          </div>

          <Link to="/admin/internships/requests">
            <Button variant="primary" size="sm">
              View Approval Queue
            </Button>
          </Link>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', overflowX: 'auto', paddingBottom: 4 }}>
          {filterTabs.map((tab) => {
            const count = tab.key === 'ALL' ? internships.length : internships.filter(i => i.status === tab.key).length;
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
              placeholder="Search internships or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> programs
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="internships" title="No internships found" description="No internships match your filter." />
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

      {/* Suspend Confirm Dialog */}
      <ConfirmDialog
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleConfirmSuspend}
        title="Suspend Internship Program?"
        message={`Are you sure you want to suspend "${suspendTarget?.title}"?`}
        confirmText="Yes, Suspend"
        danger
      />

    </div>
  );
}
