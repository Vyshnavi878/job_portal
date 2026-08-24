import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Plus, Search, Filter, Eye, Edit2, Users,
  Building2, MapPin, Clock, CheckCircle2, Ticket
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import { MOCK_JOB_MELAS } from '../../data/mockData';

export default function AdminJobMelasPage() {
  const [events] = useState(MOCK_JOB_MELAS.map(e => ({
    ...e,
    participatingCompaniesCount: e.participatingCompanies?.length || 18,
    registeredCandidatesCount: e.registeredCandidates || 2400,
    status: e.status || 'UPCOMING',
  })));

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filterTabs = [
    { key: 'ALL', label: 'All Career Melas' },
    { key: 'UPCOMING', label: 'Upcoming' },
    { key: 'ONGOING', label: 'Ongoing Today' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const filtered = events.filter((e) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!e.title.toLowerCase().includes(q) && !e.city.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    {
      key: 'title',
      label: 'Job Mela Event',
      sortable: true,
      render: (_, row) => (
        <div>
          <Link to={`/job-melas/${row.id}`} target="_blank" style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)', textDecoration: 'none' }}>
            {row.title}
          </Link>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.venue}, {row.city}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Date: {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {row.time}</p>
        </div>
      )
    },
    {
      key: 'participatingCompaniesCount',
      label: 'Employers',
      render: (v) => (
        <Link to="/admin/job-melas/participation" style={{ textDecoration: 'none' }}>
          <span className="badge badge-primary" style={{ cursor: 'pointer' }}>
            <Building2 size={12} style={{ marginRight: 4 }} /> {v} Companies
          </span>
        </Link>
      )
    },
    {
      key: 'registeredCandidatesCount',
      label: 'Candidate Passes',
      render: (v) => (
        <Link to="/admin/job-melas/registrations" style={{ textDecoration: 'none' }}>
          <span className="badge badge-info" style={{ cursor: 'pointer' }}>
            <Ticket size={12} style={{ marginRight: 4 }} /> {v} Passes Issued
          </span>
        </Link>
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
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Link to={`/job-melas/${row.id}`} target="_blank">
            <Button size="xs" variant="outline" leftIcon={<Eye size={12} />}>
              View
            </Button>
          </Link>
          <Link to="/admin/job-melas/participation">
            <Button size="xs" variant="secondary">
              Stalls
            </Button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="admin-job-melas-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <CalendarDays size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>National Job Mela Operations</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Configure mega career expos, coordinate corporate stall allocations, and monitor candidate footfalls
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Link to="/admin/job-melas/participation">
              <Button variant="outline" size="sm">
                Participation Requests
              </Button>
            </Link>
            <Link to="/admin/job-melas/create">
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
                Create Job Mela
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', overflowX: 'auto', paddingBottom: 4 }}>
          {filterTabs.map((tab) => {
            const count = tab.key === 'ALL' ? events.length : events.filter(e => e.status === tab.key).length;
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
              placeholder="Search by event title or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> events
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="default" title="No job melas found" description="No events match your search query." />
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

    </div>
  );
}
