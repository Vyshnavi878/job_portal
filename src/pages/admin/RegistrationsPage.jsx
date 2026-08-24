import { useState, useMemo } from 'react';
import {
  Ticket, Search, Filter, CalendarDays, User, Mail, Phone,
  CheckCircle2, Clock, Users, ArrowRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import StatCard from '../../components/ui/StatCard';
import { EmptyState } from '../../components/ui/States';

const INITIAL_REGISTRATIONS = [
  {
    id: 'REG-892401',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@example.com',
    candidatePhone: '+91 98765 43210',
    eventName: 'Bengaluru Mega IT Job Mela 2026',
    gateNumber: 'Gate 3 (Fast-Track)',
    registeredDate: '2026-08-21, 11:20 AM',
    status: 'CONFIRMED',
  },
  {
    id: 'REG-892402',
    candidateName: 'Amitav Ghosh',
    candidateEmail: 'amitav.ghosh@example.com',
    candidatePhone: '+91 98123 45678',
    eventName: 'Bengaluru Mega IT Job Mela 2026',
    gateNumber: 'Gate 1 (General Entry)',
    registeredDate: '2026-08-20, 04:10 PM',
    status: 'CONFIRMED',
  },
  {
    id: 'REG-892403',
    candidateName: 'Sneha Kulkarni',
    candidateEmail: 'sneha.kulkarni@example.com',
    candidatePhone: '+91 97654 32109',
    eventName: 'Bengaluru Mega IT Job Mela 2026',
    gateNumber: 'Gate 2 (General Entry)',
    registeredDate: '2026-08-19, 02:45 PM',
    status: 'ATTENDED',
  },
  {
    id: 'REG-892404',
    candidateName: 'Vikram Patel',
    candidateEmail: 'vikram.patel@example.com',
    candidatePhone: '+91 98765 01234',
    eventName: 'Delhi NCR Mega Career Expo 2026',
    gateNumber: 'Gate 5 (Main Pavilion)',
    registeredDate: '2026-08-18, 09:30 AM',
    status: 'CONFIRMED',
  },
];

export default function AdminRegistrationsPage() {
  const [registrations] = useState(INITIAL_REGISTRATIONS);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!r.candidateName.toLowerCase().includes(q) && !r.candidateEmail.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (eventFilter !== 'ALL' && !r.eventName.includes(eventFilter)) return false;
      return true;
    });
  }, [registrations, search, eventFilter]);

  const columns = [
    {
      key: 'id',
      label: 'Pass ID & Candidate',
      sortable: true,
      render: (_, row) => (
        <div>
          <span style={{ fontSize: '10px', color: 'var(--color-primary-600)', fontWeight: 800 }}>{row.id}</span>
          <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>{row.candidateName}</strong>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.candidateEmail}</p>
        </div>
      )
    },
    {
      key: 'eventName',
      label: 'Job Mela Event',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-xs)' }}>{row.eventName}</strong>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Allocated: {row.gateNumber}</p>
        </div>
      )
    },
    {
      key: 'candidatePhone',
      label: 'Phone',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)' }}>{v}</span>
    },
    {
      key: 'registeredDate',
      label: 'Issued Date',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Ticket Status',
      render: (v) => <span className={`badge ${v === 'ATTENDED' ? 'badge-info' : 'badge-success'}`}>{v}</span>
    }
  ];

  return (
    <div className="admin-registrations-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Ticket size={20} style={{ color: 'var(--color-primary-600)' }} />
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Job Mela Candidate Registrations & Passes</h1>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
          Audit issued digital QR entry badges, turnstile gate check-ins, and venue capacities
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <StatCard label="Total Passes Issued" value="15,200" change="+850 today" positive icon={<Ticket size={20} />} iconBg="#eef2ff" iconColor="#4f46e5" />
        <StatCard label="Checked-In at Gates" value="6,420" change="Live Turnstiles" positive icon={<CheckCircle2 size={20} />} iconBg="#f0fdf4" iconColor="#16a34a" variant="success" />
        <StatCard label="Remaining Hall Capacity" value="3,580" change="45% Available" positive icon={<Users size={20} />} iconBg="#eff6ff" iconColor="#2563eb" />
      </div>

      {/* Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search candidate name, email or Pass ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> candidate passes
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="default" title="No candidate passes found" description="No registrations match your search criteria." />
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
