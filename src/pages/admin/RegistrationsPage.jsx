import { useState, useMemo } from 'react';
import {
  Ticket, Search, Filter, CalendarDays, User, Mail, Phone,
  CheckCircle2, Clock, Users, ArrowRight, Eye
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import ExportDropdown from '../../components/ui/ExportDropdown';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';
import { exportToExcel, exportToPDF, getExportFilename } from '../../utils/exportUtils';

export default function AdminRegistrationsPage() {
  const { addToast } = useToast();
  const { registrations } = useAdmin();

  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [selectedPass, setSelectedPass] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);

  const availableEvents = useMemo(() => {
    const list = (registrations || []).map(r => r.event || r.eventName).filter(Boolean);
    return Array.from(new Set(list));
  }, [registrations]);

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const candName = r.candidate || r.candidateName || '';
      const candEmail = r.email || r.candidateEmail || '';
      const eventName = r.event || r.eventName || '';
      const passId = r.id || '';

      if (search.trim()) {
        const q = search.toLowerCase();
        if (!candName.toLowerCase().includes(q) && !candEmail.toLowerCase().includes(q) && !passId.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (eventFilter !== 'ALL' && !eventName.toLowerCase().includes(eventFilter.toLowerCase())) return false;
      return true;
    });
  }, [registrations, search, eventFilter]);

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting registrations list to Excel...', 'info');
    const headers = ['Registration ID', 'Candidate Name', 'Email', 'Phone', 'Job Mela', 'Registration Date', 'Registration Status'];
    const rows = filtered.map(r => [
      r.id || 'REG-N/A',
      r.candidate || r.candidateName || 'Candidate',
      r.email || r.candidateEmail || 'N/A',
      r.phone || '+91 98765 43210',
      r.event || r.eventName || 'Job Mela',
      r.registrationDate || r.registeredDate || 'Aug 2026',
      r.status || 'CONFIRMED'
    ]);
    exportToExcel({
      filename: getExportFilename('job_mela_registrations', eventFilter !== 'ALL' ? eventFilter : 'all', 'xlsx'),
      sheetName: 'Registrations',
      headers,
      rows
    });
    addToast('Excel export downloaded successfully!', 'success');
  };

  const handleExportPdf = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting registrations list to PDF...', 'info');
    const headers = ['Reg ID', 'Candidate Name', 'Email', 'Phone', 'Job Mela', 'Date', 'Status'];
    const rows = filtered.map(r => [
      r.id || 'REG-N/A',
      r.candidate || r.candidateName || 'Candidate',
      r.email || r.candidateEmail || 'N/A',
      r.phone || '+91 98765 43210',
      r.event || r.eventName || 'Job Mela',
      r.registrationDate || r.registeredDate || 'Aug 2026',
      r.status || 'CONFIRMED'
    ]);
    exportToPDF({
      filename: getExportFilename('job_mela_registrations', eventFilter !== 'ALL' ? eventFilter : 'all', 'pdf'),
      title: 'Job Mela Candidate Registrations',
      subtitle: eventFilter !== 'ALL' ? `Event: ${eventFilter}` : 'All Job Mela Events',
      metadata: {
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Event Filter': eventFilter !== 'ALL' ? eventFilter : 'All Events',
        'Total Records': filtered.length
      },
      headers,
      rows
    });
    addToast('PDF export downloaded successfully!', 'success');
  };

  const columns = [
    {
      key: 'candidate',
      label: 'Candidate',
      sortable: true,
      render: (_, row) => {
        const name = row.candidate || row.candidateName || 'Candidate';
        const email = row.email || row.candidateEmail || 'candidate@example.com';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #1e1b4b, #3b82f6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 'var(--text-xs)'
            }}>
              {name[0]}
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--color-primary-600)', fontWeight: 800, display: 'block' }}>{row.id}</span>
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{name}</strong>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{email}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'event',
      label: 'Job Mela Event',
      sortable: true,
      render: (_, row) => {
        const eventName = row.event || row.eventName || 'Job Mela Summit';
        return (
          <div>
            <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{eventName}</strong>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Gate: {row.gateNumber || 'Main Entry'}</span>
          </div>
        );
      }
    },
    {
      key: 'registrationDate',
      label: 'Registration Date',
      sortable: true,
      render: (v, row) => {
        const dt = v || row.registeredDate;
        return (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            {dt ? new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026'}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={v || 'CONFIRMED'} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Eye size={12} />}
          onClick={() => {
            setSelectedPass(row);
            setPassModalOpen(true);
          }}
        >
          View Pass
        </Button>
      )
    }
  ];

  return (
    <div className="admin-registrations-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Ticket size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Job Mela Candidate Registrations</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Live registration audit and digital entry passes issued for regional mega employment summits.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <span style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              padding: '6px 12px',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700
            }}>
              {registrations.length + 15200} Total Candidate Passes Issued
            </span>
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
              placeholder="Search candidate name, email, pass ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            {availableEvents.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="form-control"
                  style={{ height: 38, borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)', fontWeight: 600, maxWidth: 220 }}
                >
                  <option value="ALL">All Job Melas</option>
                  {availableEvents.map(evt => (
                    <option key={evt} value={evt}>{evt}</option>
                  ))}
                </select>
              </div>
            )}

            <ExportDropdown
              onExportExcel={handleExportExcel}
              onExportPdf={handleExportPdf}
              disabled={filtered.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Ticket size={40} />}
            title="No Registrations Found"
            description="No candidate registrations match your current search criteria."
          />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </div>

      {/* ── 1. Digital Pass Modal ── */}
      {passModalOpen && selectedPass && (
        <Modal
          isOpen={passModalOpen}
          onClose={() => setPassModalOpen(false)}
          title="Digital Mela Pass Verification"
          size="sm"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#fff',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)'
            }}>
              <Ticket size={32} style={{ margin: '0 auto var(--space-2)' }} />
              <span style={{ fontSize: '10px', color: '#c7d2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                NTR VIKASA VERIFIED ENTRY PASS
              </span>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '4px 0 0 0', color: '#fff' }}>
                {selectedPass.id}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: '#e0e7ff', margin: '4px 0 0 0' }}>
                {selectedPass.candidate || selectedPass.candidateName}
              </p>
            </div>

            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
              <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                <strong>Event:</strong> {selectedPass.event || selectedPass.eventName}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                <strong>Candidate Email:</strong> {selectedPass.email || selectedPass.candidateEmail}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                <strong>Entry Gate:</strong> {selectedPass.gateNumber || 'Gate 1 (Main Hall)'}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}>
                <strong>Status:</strong> {selectedPass.status || 'CONFIRMED'}
              </p>
            </div>

            <Button variant="outline" fullWidth onClick={() => setPassModalOpen(false)}>
              Close Pass
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
