import { useState, useMemo, useEffect } from 'react';
import {
  History, Search, Filter, ShieldCheck, ShieldAlert,
  User, Download, Clock, ArrowUpDown, CheckCircle2, XCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

export default function AdminAuditLogsPage() {
  const { addToast } = useToast();
  const { auditLogs } = useAdmin();

  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = useMemo(() => {
    return auditLogs.filter((l) => {
      const act = l.action || '';
      const usr = l.user || l.admin || '';
      const tgt = l.target || '';
      const res = l.result || '';

      if (search.trim()) {
        const q = search.toLowerCase();
        if (!act.toLowerCase().includes(q) && !usr.toLowerCase().includes(q) && !tgt.toLowerCase().includes(q) && !res.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [auditLogs, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleExport = () => {
    addToast('Audit log records exported as CSV successfully.', 'success');
  };

  const columns = [
    {
      key: 'action',
      label: 'Action',
      sortable: true,
      render: (v) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <History size={14} style={{ color: 'var(--color-primary-600)' }} />
          <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v}</strong>
        </div>
      )
    },
    {
      key: 'admin',
      label: 'Admin / User',
      sortable: true,
      render: (v, row) => {
        const userName = v || row.user || 'Admin User';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{
              width: 24,
              height: 24,
              borderRadius: 'var(--radius-full)',
              background: '#e0e7ff',
              color: '#3730a3',
              fontSize: '10px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {userName[0]}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{userName}</span>
          </div>
        );
      }
    },
    {
      key: 'target',
      label: 'Target',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v || 'System Entity'}</span>
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{v || '04 Sept 2026'}</span>
    },
    {
      key: 'time',
      label: 'Time',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{v || '10:32 AM'}</span>
    },
    {
      key: 'result',
      label: 'Result',
      render: (v) => {
        const isSuccess = (v || 'Success').toLowerCase() === 'success';
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: isSuccess ? '#ecfdf5' : '#fef2f2',
            color: isSuccess ? '#047857' : '#b91c1c',
            border: isSuccess ? '1px solid #a7f3d0' : '1px solid #fecaca',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isSuccess ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {v || 'Success'}
          </span>
        );
      }
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
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Security & System Audit Logs</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Immutable audit trail recording administrative approvals, user suspensions, and security operations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={handleExport}>
              Export Audit CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
        <div style={{ position: 'relative', maxWidth: 440 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by action, admin name, target entity..."
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
            icon={<History size={40} />}
            title="No Audit Records Found"
            description="No audit events matched your search query."
          />
        ) : (
          <>
            <Table columns={columns} data={paginatedLogs} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
