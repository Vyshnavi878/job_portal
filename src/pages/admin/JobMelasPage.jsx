import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Plus, Search, Filter, Eye, Edit2, Users,
  Building2, MapPin, Clock, CheckCircle2, Ticket, XCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

export default function AdminJobMelasPage() {
  const { addToast } = useToast();
  const { jobMelas, approveJobMela, rejectJobMela } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedMela, setSelectedMela] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filterTabs = [
    { key: 'ALL', label: 'All Career Melas' },
    { key: 'UPCOMING', label: 'Upcoming' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'ONGOING', label: 'Ongoing Today' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const filtered = jobMelas.filter((e) => {
    const eventTitle = e.event || e.title || '';
    const eventCity = e.location || e.city || '';
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!eventTitle.toLowerCase().includes(q) && !eventCity.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'APPROVED' && (e.status !== 'APPROVED' && e.status !== 'UPCOMING')) return false;
      if (statusFilter === 'UPCOMING' && e.status !== 'UPCOMING' && e.status !== 'APPROVED') return false;
      if (statusFilter !== 'APPROVED' && statusFilter !== 'UPCOMING' && e.status !== statusFilter) return false;
    }
    return true;
  });

  const handleApprove = (m) => {
    approveJobMela(m.id);
    addToast(`"${m.event || m.title}" has been APPROVED.`, 'success');
    if (selectedMela?.id === m.id) {
      setSelectedMela({ ...selectedMela, status: 'APPROVED' });
    }
  };

  const handleReject = (m) => {
    rejectJobMela(m.id);
    addToast(`"${m.event || m.title}" has been REJECTED.`, 'info');
    if (selectedMela?.id === m.id) {
      setSelectedMela({ ...selectedMela, status: 'REJECTED' });
    }
  };

  const columns = [
    {
      key: 'event',
      label: 'Event',
      sortable: true,
      render: (_, row) => {
        const title = row.event || row.title || 'Job Mela Event';
        const venue = row.venue || row.location || 'State Convention Center';
        return (
          <div>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{title}</strong>
            <span style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: 600 }}>{venue}</span>
          </div>
        );
      }
    },
    {
      key: 'date',
      label: 'Date & Time',
      sortable: true,
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
          <strong style={{ display: 'block' }}>{row.date ? new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Sept 2026'}</strong>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.time || '09:00 AM - 05:00 PM'}</span>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>📍 {v || 'Vijayawada'}</span>
    },
    {
      key: 'organizer',
      label: 'Organizer',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v || 'AP Skill Development Corp'}</span>
    },
    {
      key: 'companies',
      label: 'Companies',
      render: (v, row) => {
        const count = typeof v === 'number' ? v : (Array.isArray(v) ? v.length : 35);
        return (
          <Link to="/admin/job-melas/participation" style={{ textDecoration: 'none' }}>
            <span className="badge badge-primary" style={{ cursor: 'pointer' }}>
              <Building2 size={12} style={{ marginRight: 4 }} /> {count} Companies
            </span>
          </Link>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={v || 'UPCOMING'} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Button
            size="xs"
            variant="outline"
            leftIcon={<Eye size={12} />}
            onClick={() => {
              setSelectedMela(row);
              setViewModalOpen(true);
            }}
          >
            View
          </Button>

          {row.status !== 'APPROVED' && row.status !== 'UPCOMING' && (
            <Button
              size="xs"
              variant="primary"
              onClick={() => handleApprove(row)}
            >
              Approve
            </Button>
          )}

          {row.status !== 'REJECTED' && (
            <Button
              size="xs"
              variant="danger"
              onClick={() => handleReject(row)}
            >
              Reject
            </Button>
          )}

          <Link to="/admin/registrations" style={{ textDecoration: 'none' }}>
            <Button size="xs" variant="secondary">
              Manage
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
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Mega Job Melas & Career Summits</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Govern state-wide employment drives, review mega summits, and allocate company booths.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/admin/job-melas/create" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
                Create New Job Mela
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 440 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search event name, location, venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: statusFilter === tab.key ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                  background: statusFilter === tab.key ? 'var(--color-primary-600)' : 'var(--color-surface)',
                  color: statusFilter === tab.key ? '#fff' : 'var(--color-text-muted)',
                  transition: 'all 150ms ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={40} />}
            title="No Job Melas Found"
            description="No job mela events match your search or status filter."
          />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </div>

      {/* ── 1. Job Mela View Modal ── */}
      {viewModalOpen && selectedMela && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Job Mela Event: ${selectedMela.event || selectedMela.title}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Header Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              color: '#fff',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)'
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xl)',
                fontWeight: 800
              }}>
                <CalendarDays size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff' }}>
                  {selectedMela.event || selectedMela.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: '#93c5fd', margin: '2px 0 0 0' }}>
                  {selectedMela.venue || selectedMela.location} • 📍 {selectedMela.location}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#cbd5e1' }}>
                  <span>📅 Date: {selectedMela.date ? new Date(selectedMela.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Sept 2026'}</span>
                  <span>⏰ Time: {selectedMela.time || '09:00 AM - 05:00 PM'}</span>
                  <span>🛡️ Status: {selectedMela.status}</span>
                </div>
              </div>
            </div>

            {/* Event Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Organizing Authority
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Lead Organizer:</strong> {selectedMela.organizer || 'APSSDC & NTR Vikasa'}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Venue:</strong> {selectedMela.venue || selectedMela.location}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>City/District:</strong> {selectedMela.location}</p>
              </div>

              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Scale & Participation
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Participating Employers:</strong> {selectedMela.companiesCount || 35}+ Companies</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Candidate Passes:</strong> {selectedMela.registeredCandidates || 2400}+ Issued</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Status:</strong> {selectedMela.status}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              <Link to="/admin/registrations" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">
                  Manage Candidate Passes
                </Button>
              </Link>
              {selectedMela.status !== 'APPROVED' && selectedMela.status !== 'UPCOMING' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleApprove(selectedMela);
                    setSelectedMela({ ...selectedMela, status: 'APPROVED' });
                  }}
                >
                  Approve Event
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
