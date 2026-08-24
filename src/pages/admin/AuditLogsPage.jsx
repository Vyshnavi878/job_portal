import { useState, useMemo } from 'react';
import {
  History, Search, Filter, ShieldCheck, ShieldAlert,
  User, Download, Clock, ArrowUpDown
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';

const INITIAL_AUDIT_LOGS = [
  { id: '1', timestamp: '2026-08-24 10:15:22', user: 'Admin User', role: 'ADMIN', action: 'RECRUITER_APPROVED', status: 'SUCCESS', details: 'Approved TechCorp India registration (CIN: U72200KA2012PTC064123)' },
  { id: '2', timestamp: '2026-08-24 09:42:10', user: 'Rahul Mehta', role: 'RECRUITER', action: 'JOB_POSTED', status: 'PENDING', details: 'Submitted job opening: Senior Cloud Security Architect' },
  { id: '3', timestamp: '2026-08-24 09:12:05', user: 'Priya Sharma', role: 'CANDIDATE', action: 'JOB_APPLIED', status: 'SUCCESS', details: 'Applied to Senior Frontend Engineer (TechCorp India)' },
  { id: '4', timestamp: '2026-08-24 08:30:19', user: 'Admin User', role: 'ADMIN', action: 'JOB_MELA_STALL_ALLOCATED', status: 'SUCCESS', details: 'Allocated Booth B-14 (Hall 3) to TechCorp India' },
  { id: '5', timestamp: '2026-08-23 18:24:55', user: 'Security Bot', role: 'SYSTEM', action: 'SPAM_ACCOUNT_SUSPENDED', status: 'SUSPENDED', details: 'Suspended automated bot account: bot909@disposable-email.com' },
  { id: '6', timestamp: '2026-08-23 16:10:04', user: 'Admin User', role: 'ADMIN', action: 'JOB_REJECTED', status: 'REJECTED', details: 'Rejected Cryptocurrency Arbitrage Analyst due to policy non-compliance' },
  { id: '7', timestamp: '2026-08-23 14:05:33', user: 'Sneha Kulkarni', role: 'CANDIDATE', action: 'MELA_REGISTERED', status: 'SUCCESS', details: 'Issued digital fast-track pass PASS-BLR-892403' },
  { id: '8', timestamp: '2026-08-23 11:20:18', user: 'Sameer Sen', role: 'RECRUITER', action: 'INTERVIEW_SCHEDULED', status: 'SUCCESS', details: 'Scheduled Round 1 technical interview with Priya Sharma' },
];

export default function AdminAuditLogsPage() {
  const { toast } = useToast();

  const [logs] = useState(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!l.user.toLowerCase().includes(q) && !l.action.toLowerCase().includes(q) && !l.details.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (roleFilter !== 'ALL' && l.role !== roleFilter) return false;
      return true;
    });
  }, [logs, search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedLogs = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      key: 'timestamp',
      label: 'DATE & TIME',
      sortable: true,
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{v}</span>
    },
    {
      key: 'user',
      label: 'USER',
      sortable: true,
      render: (v, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-xs)' }}>{v}</strong>
        </div>
      )
    },
    {
      key: 'role',
      label: 'ROLE',
      render: (v) => (
        <span className={`badge ${v === 'ADMIN' ? 'badge-primary' : v === 'RECRUITER' ? 'badge-info' : v === 'SYSTEM' ? 'badge-danger' : 'badge-secondary'}`} style={{ fontSize: '10px' }}>
          {v}
        </span>
      )
    },
    {
      key: 'action',
      label: 'ACTION',
      render: (v) => <code style={{ fontSize: '11px', background: 'var(--color-gray-100)', padding: '2px 6px', borderRadius: 4 }}>{v}</code>
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (v) => (
        <span className={`badge ${v === 'SUCCESS' ? 'badge-success' : v === 'REJECTED' || v === 'SUSPENDED' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
          {v}
        </span>
      )
    },
    {
      key: 'details',
      label: 'DETAILS',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v}</span>
    }
  ];

  return (
    <div className="admin-audit-logs-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <History size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Immutable System Audit Logs</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Comprehensive chronological ledger of all administrative interventions, recruiter verifications, and security events
            </p>
          </div>

          <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={() => toast({ type: 'success', title: 'Audit Trail Exported', message: 'Audit logs exported as CSV.' })}>
            Export Audit Trail
          </Button>
        </div>

        {/* Filter Role Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          {['ALL', 'ADMIN', 'RECRUITER', 'CANDIDATE', 'SYSTEM'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => { setRoleFilter(role); setCurrentPage(1); }}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: roleFilter === role ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                background: roleFilter === role ? 'var(--color-primary-600)' : 'transparent',
                color: roleFilter === role ? '#fff' : 'var(--color-text-muted)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {role === 'ALL' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search user, action, or details..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{paginatedLogs.length}</strong> of <strong>{filtered.length}</strong> entries
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="default" title="No audit records" description="No audit log entries match your filter query." />
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={paginatedLogs}
                rowKey="id"
              />
              <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
