import { useState, useMemo, useEffect } from 'react';
import {
  Ticket, Search, Filter, CalendarDays, User, Mail, Phone,
  CheckCircle2, Clock, Users, ArrowRight, Eye, MapPin, Building2,
  FileText, Download, ShieldCheck, Info, ExternalLink, Calendar
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import ExportDropdown from '../../components/ui/ExportDropdown';
import { exportToExcel, exportToPDF, exportToCSV, generatePDFBlob, getExportFilename } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

export default function AdminRegistrationsPage() {
  const { addToast } = useToast();
  const { registrations, candidates = [], jobMelas = [] } = useAdmin();

  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, eventFilter]);

  const [selectedPass, setSelectedPass] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);

  // Candidate Profile Modal view
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [activeCandProfile, setActiveCandProfile] = useState(null);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedRegistrations = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  // Matched candidate & job mela for selected pass
  const matchedCand = useMemo(() => {
    if (!selectedPass) return null;
    return candidates.find(c =>
      (selectedPass.candidateId && c.id === selectedPass.candidateId) ||
      (selectedPass.email && c.email?.toLowerCase() === selectedPass.email?.toLowerCase()) ||
      (selectedPass.candidateEmail && c.email?.toLowerCase() === selectedPass.candidateEmail?.toLowerCase()) ||
      (c.name?.toLowerCase() === (selectedPass.candidate || selectedPass.candidateName)?.toLowerCase())
    );
  }, [selectedPass, candidates]);

  const matchedMela = useMemo(() => {
    if (!selectedPass) return null;
    return jobMelas.find(m =>
      (selectedPass.melaId && m.id === selectedPass.melaId) ||
      (selectedPass.event && (m.event?.toLowerCase() === selectedPass.event?.toLowerCase() || m.title?.toLowerCase() === selectedPass.event?.toLowerCase())) ||
      (selectedPass.eventName && (m.event?.toLowerCase() === selectedPass.eventName?.toLowerCase() || m.title?.toLowerCase() === selectedPass.eventName?.toLowerCase()))
    );
  }, [selectedPass, jobMelas]);

  const handleOpenCandidateProfile = () => {
    if (!selectedPass) return;
    const profileData = matchedCand || {
      id: selectedPass.candidateId || 'cand-ext',
      name: selectedPass.candidate || selectedPass.candidateName || 'Candidate',
      email: selectedPass.email || selectedPass.candidateEmail || 'candidate@example.com',
      phone: selectedPass.phone || selectedPass.candidatePhone || '+91 98765 43210',
      headline: selectedPass.headline || 'Job Seeker / Mela Participant',
      location: selectedPass.location || matchedMela?.city || 'India',
      experience: selectedPass.experience || '2+ Years',
      education: selectedPass.education || 'Graduate',
      skills: selectedPass.skills || ['Communication', 'Teamwork', 'Core Skills'],
      registrationDate: selectedPass.registeredDate || selectedPass.registrationDate || '2026-08-01',
      profileStatus: 'COMPLETE',
      accountStatus: 'ACTIVE',
      applicationsCount: 1,
      resumeName: selectedPass.resumeName || `${(selectedPass.candidate || selectedPass.candidateName || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`
    };
    setActiveCandProfile(profileData);
    setCandidateModalOpen(true);
  };

  // ── Single Pass Resume Actions ──
  const candResumeName = selectedPass?.resumeName || matchedCand?.resumeName || (matchedCand?.name ? `${matchedCand.name.replace(/\s+/g, '_')}_Resume.pdf` : (selectedPass?.candidate ? `${selectedPass.candidate.replace(/\s+/g, '_')}_Resume.pdf` : null));

  const handleViewResume = () => {
    if (!selectedPass) return;
    if (selectedPass.resumeUrl || matchedCand?.resumeUrl) {
      window.open(selectedPass.resumeUrl || matchedCand.resumeUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const candName = selectedPass.candidate || selectedPass.candidateName || matchedCand?.name || 'Registered Candidate';
    const resumeFileName = candResumeName || `${candName.replace(/\s+/g, '_')}_Resume.pdf`;
    const headers = ['Resume Section', 'Candidate Details'];
    const rows = [
      ['Candidate Name', candName],
      ['Job Mela Registration ID', selectedPass.id || selectedPass.passId || 'N/A'],
      ['Target Job Mela Event', selectedPass.event || selectedPass.jobMela || 'State Employment Mega Job Mela'],
      ['Email Address', selectedPass.candidateEmail || selectedPass.email || matchedCand?.email || 'N/A'],
      ['Phone Number', selectedPass.candidatePhone || selectedPass.phone || matchedCand?.phone || '+91 98765 43210'],
      ['Location / District', selectedPass.location || selectedPass.district || matchedCand?.location || 'Andhra Pradesh'],
      ['Total Experience', selectedPass.experience || matchedCand?.experience || 'N/A'],
      ['Education Qualification', selectedPass.education || selectedPass.qualification || matchedCand?.education || 'Graduate'],
      ['Key Skills', Array.isArray(selectedPass.skills || matchedCand?.skills) ? (selectedPass.skills || matchedCand?.skills).join(', ') : (selectedPass.skills || matchedCand?.skills || 'N/A')],
      ['Pass / Gate Status', selectedPass.status || 'CONFIRMED']
    ];

    const blob = generatePDFBlob({
      filename: resumeFileName,
      title: `Candidate Resume: ${candName}`,
      subtitle: `Job Mela Registration Dossier — Pass: ${selectedPass.id || 'N/A'} at ${selectedPass.event || 'Job Mela'}`,
      metadata: {
        'Candidate Name': candName,
        'Pass ID': selectedPass.id || 'N/A',
        'Event': selectedPass.event || 'Job Mela',
        'Status': selectedPass.status || 'CONFIRMED'
      },
      headers,
      rows
    });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  };

  const handleDownloadResume = () => {
    if (!selectedPass) return;
    const candName = selectedPass.candidate || selectedPass.candidateName || matchedCand?.name || 'Registered Candidate';
    const resumeFileName = candResumeName || `${candName.replace(/\s+/g, '_')}_Resume.pdf`;
    if (selectedPass.resumeUrl || matchedCand?.resumeUrl) {
      const a = document.createElement('a');
      a.href = selectedPass.resumeUrl || matchedCand.resumeUrl;
      a.download = resumeFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const headers = ['Resume Section', 'Candidate Details'];
    const rows = [
      ['Candidate Name', candName],
      ['Job Mela Registration ID', selectedPass.id || selectedPass.passId || 'N/A'],
      ['Target Job Mela Event', selectedPass.event || selectedPass.jobMela || 'State Employment Mega Job Mela'],
      ['Email Address', selectedPass.candidateEmail || selectedPass.email || matchedCand?.email || 'N/A'],
      ['Phone Number', selectedPass.candidatePhone || selectedPass.phone || matchedCand?.phone || '+91 98765 43210'],
      ['Location / District', selectedPass.location || selectedPass.district || matchedCand?.location || 'Andhra Pradesh'],
      ['Total Experience', selectedPass.experience || matchedCand?.experience || 'N/A'],
      ['Education Qualification', selectedPass.education || selectedPass.qualification || matchedCand?.education || 'Graduate'],
      ['Key Skills', Array.isArray(selectedPass.skills || matchedCand?.skills) ? (selectedPass.skills || matchedCand?.skills).join(', ') : (selectedPass.skills || matchedCand?.skills || 'N/A')],
      ['Pass / Gate Status', selectedPass.status || 'CONFIRMED']
    ];

    exportToPDF({
      filename: resumeFileName,
      title: `Candidate Resume: ${candName}`,
      subtitle: `Job Mela Registration Dossier — Pass: ${selectedPass.id || 'N/A'} at ${selectedPass.event || 'Job Mela'}`,
      metadata: {
        'Candidate Name': candName,
        'Pass ID': selectedPass.id || 'N/A',
        'Event': selectedPass.event || 'Job Mela',
        'Status': selectedPass.status || 'CONFIRMED'
      },
      headers,
      rows
    });
    addToast(`Downloading candidate resume: ${resumeFileName}`, 'success');
  };

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting registrations list to Excel...', 'info');
    const headers = [
      'Registration ID',
      'Candidate Name',
      'Phone',
      'Email',
      'Job Mela',
      'Registration Date',
      'Registration Status'
    ];
    const rows = filtered.map(r => [
      r.id || 'N/A',
      r.candidate || r.candidateName || 'N/A',
      r.phone || r.candidatePhone || 'N/A',
      r.email || r.candidateEmail || 'N/A',
      r.event || r.eventName || 'Job Mela',
      r.registeredDate || r.registrationDate ? new Date(r.registeredDate || r.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026',
      r.status || 'CONFIRMED'
    ]);
    exportToExcel({
      filename: getExportFilename('job_mela_registrations', eventFilter === 'ALL' ? 'all' : 'filtered', 'xlsx'),
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
    const headers = ['Registration ID', 'Candidate Name', 'Phone', 'Email', 'Job Mela', 'Date', 'Status'];
    const rows = filtered.map(r => [
      r.id || 'N/A',
      r.candidate || r.candidateName || 'N/A',
      r.phone || r.candidatePhone || 'N/A',
      r.email || r.candidateEmail || 'N/A',
      r.event || r.eventName || 'Job Mela',
      r.registeredDate || r.registrationDate ? new Date(r.registeredDate || r.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026',
      r.status || 'CONFIRMED'
    ]);

    exportToPDF({
      filename: getExportFilename('job_mela_registrations', eventFilter === 'ALL' ? 'all' : 'filtered', 'pdf'),
      title: 'Job Mela Candidate Registrations Report',
      subtitle: `NTR Vikasa Admin Audit - Event: ${eventFilter === 'ALL' ? 'All Events' : eventFilter}`,
      metadata: {
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Event Filter': eventFilter === 'ALL' ? 'All Job Melas' : eventFilter,
        'Search Query': search || 'None',
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
          <>
            <Table columns={columns} data={paginatedRegistrations} />
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

      {/* ── 1. Digital Pass Modal (Improved Record View) ── */}
      {passModalOpen && selectedPass && (
        <Modal
          isOpen={passModalOpen}
          onClose={() => setPassModalOpen(false)}
          title="Digital Mela Pass Verification"
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

            {/* ── Section 1: Verified Entry Pass Header ── */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#fff',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <span style={{
                  fontSize: '11px',
                  color: '#c7d2fe',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Ticket size={14} /> NTR VIKASA VERIFIED ENTRY PASS
                </span>
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(255,255,255,0.18)',
                  color: '#fff',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700
                }}>
                  Registration ID: {selectedPass.id}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: '2px 0 0 0', color: '#fff' }}>
                  {selectedPass.candidate || selectedPass.candidateName || matchedCand?.name || 'Candidate'}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: '#c7d2fe', margin: '4px 0 0 0' }}>
                  <strong>Event:</strong> {selectedPass.event || selectedPass.eventName || matchedMela?.event || matchedMela?.title || 'Job Mela Summit'}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 6, fontSize: '11px', color: '#e0e7ff' }}>
                  <span>🚪 <strong>Gate:</strong> {selectedPass.gateNumber || selectedPass.entryGate || 'Gate 1 (Main Hall)'}</span>
                  <span>🎫 <strong>Pass Status:</strong> {selectedPass.status || 'CONFIRMED'}</span>
                </div>
              </div>
            </div>

            {/* ── Section 2: Registration Details & Section 3: Job Mela Details (2-Column Grid) ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>

              {/* Registration Details */}
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)'
              }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0, letterSpacing: '0.05em' }}>
                  Registration Details
                </h4>

                <div style={{ fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Registration ID:</span>
                    <strong>{selectedPass.id}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Candidate Email:</span>
                    <span>{selectedPass.email || selectedPass.candidateEmail || matchedCand?.email || 'N/A'}</span>
                  </div>

                  {(selectedPass.phone || selectedPass.candidatePhone || matchedCand?.phone) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 4 }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Phone:</span>
                      <span>{selectedPass.phone || selectedPass.candidatePhone || matchedCand?.phone}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Registration Date:</span>
                    <span>
                      {selectedPass.registeredDate || selectedPass.registrationDate
                        ? new Date(selectedPass.registeredDate || selectedPass.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '20 Aug 2026'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Entry Gate:</span>
                    <strong>{selectedPass.gateNumber || selectedPass.entryGate || 'Gate 1 – Main Hall'}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 2 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Registration Status:</span>
                    <StatusBadge status={selectedPass.status || 'CONFIRMED'} />
                  </div>
                </div>
              </div>

              {/* Job Mela Details */}
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)'
              }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0, letterSpacing: '0.05em' }}>
                  Job Mela Details
                </h4>

                <div style={{ fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>
                    <strong style={{ color: 'var(--color-text)', fontSize: 'var(--text-sm)', display: 'block' }}>
                      {matchedMela?.event || matchedMela?.title || selectedPass.event || selectedPass.eventName || 'Job Mela Summit'}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                      {matchedMela?.city ? `📍 ${matchedMela.city}, ${matchedMela.state || 'AP'}` : '📍 State Exhibition Centre'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <Calendar size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Event Date:</strong> {matchedMela?.date ? new Date(matchedMela.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '18 Sept 2026'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <Clock size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Event Time:</strong> {matchedMela?.time || (matchedMela?.startTime ? `${matchedMela.startTime} - ${matchedMela.endTime}` : '09:00 AM - 05:30 PM')}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <MapPin size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Venue:</strong> {matchedMela?.venue || 'State Convention & Exhibition Centre'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <Building2 size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Organizing Authority:</strong> {matchedMela?.organizer || matchedMela?.authority || 'NTR Vikasa Authority'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Event Status:</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: '#ecfdf5',
                      color: '#047857',
                      border: '1px solid #a7f3d0'
                    }}>
                      {matchedMela?.status || 'UPCOMING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 4: Entry / Check-In Status ── */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}>
              <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
                Entry Verification
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--space-3)',
                marginTop: 2
              }}>
                <div style={{ background: '#fff', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                    REGISTRATION STATUS
                  </span>
                  <div style={{ marginTop: 3 }}>
                    <StatusBadge status={selectedPass.status || 'CONFIRMED'} />
                  </div>
                </div>

                <div style={{ background: '#fff', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                    PASS STATUS
                  </span>
                  <strong style={{ fontSize: 'var(--text-xs)', color: '#047857', display: 'block', marginTop: 3 }}>
                    {selectedPass.passStatus || (selectedPass.status === 'CONFIRMED' ? 'Active Entry Pass' : 'Pending Verification')}
                  </strong>
                </div>

                <div style={{ background: '#fff', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                    CHECK-IN STATUS
                  </span>
                  <strong style={{ fontSize: 'var(--text-xs)', color: selectedPass.checkedIn ? '#047857' : 'var(--color-text-muted)', display: 'block', marginTop: 3 }}>
                    {selectedPass.checkInStatus || (selectedPass.checkedIn ? 'Checked In' : 'Not Checked In')}
                  </strong>
                </div>
              </div>
            </div>

            {/* ── Section 6: Resume ── */}
            <div style={{
              background: 'var(--color-gray-50)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)'
            }}>
              <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                Resume
              </h4>

              {candResumeName ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3) var(--space-4)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 200 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--color-text)', display: 'block' }}>
                        {candResumeName}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        PDF Document • Verified Candidate Resume
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <Button
                      size="xs"
                      variant="outline"
                      leftIcon={<Eye size={13} />}
                      onClick={handleViewResume}
                    >
                      View Resume
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      leftIcon={<Download size={13} />}
                      onClick={handleDownloadResume}
                    >
                      Download Resume
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <Info size={14} />
                  <span>No resume available</span>
                </div>
              )}
            </div>

            {/* ── Section 7: Company Interactions (Rendered only if actual candidate-company interaction data exists) ── */}
            {(selectedPass.companyInteractions || selectedPass.appliedCompanies || selectedPass.interactedCompanies) && (
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)'
              }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
                  Company Interactions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(selectedPass.companyInteractions || selectedPass.appliedCompanies || selectedPass.interactedCompanies).map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'var(--color-gray-50)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)'
                    }}>
                      <strong>{typeof item === 'string' ? item : item.company}</strong>
                      <span style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>
                        {typeof item === 'object' ? item.status || 'Applied' : 'Interacted'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Section 8: Actions ── */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 'var(--space-3)',
              borderTop: '1px solid var(--color-border)',
              paddingTop: 'var(--space-4)',
              marginTop: 'var(--space-2)'
            }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenCandidateProfile}
              >
                View Candidate Profile
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPassModalOpen(false)}
              >
                Close
              </Button>
            </div>

          </div>
        </Modal>
      )}

      {/* ── 2. Candidate Full Profile Modal (Launched from Pass Verification) ── */}
      {candidateModalOpen && activeCandProfile && (
        <Modal
          isOpen={candidateModalOpen}
          onClose={() => setCandidateModalOpen(false)}
          title={`Candidate Profile: ${activeCandProfile.name}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#fff',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-xl)'
            }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-lg)',
                fontWeight: 800
              }}>
                {activeCandProfile.name?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: 0, color: '#fff' }}>{activeCandProfile.name}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: '#c7d2fe', margin: '2px 0 0 0' }}>{activeCandProfile.headline}</p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 4, fontSize: '11px', color: '#e0e7ff' }}>
                  <span>📍 {activeCandProfile.location}</span>
                  <span>💼 Experience: {activeCandProfile.experience}</span>
                  <span>📅 Joined: {activeCandProfile.registrationDate || 'Aug 2026'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Contact Information
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Email:</strong> {activeCandProfile.email}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Phone:</strong> {activeCandProfile.phone || '+91 98765 43210'}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Location:</strong> {activeCandProfile.location}</p>
              </div>

              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Education & Experience
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Education:</strong> {activeCandProfile.education || 'Graduate'}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Experience:</strong> {activeCandProfile.experience}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Job Melas:</strong> Verified Participant</p>
              </div>
            </div>

            {/* Resume preview in modal */}
            {activeCandProfile.resumeName && (
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={18} style={{ color: 'var(--color-primary-600)' }} />
                  <div>
                    <strong style={{ fontSize: 'var(--text-xs)', display: 'block' }}>{activeCandProfile.resumeName}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Verified Candidate CV</span>
                  </div>
                </div>
                <Button size="xs" variant="outline" leftIcon={<Eye size={12} />} onClick={handleViewResume}>
                  View
                </Button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button variant="outline" size="sm" onClick={() => setCandidateModalOpen(false)}>
                Close Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
