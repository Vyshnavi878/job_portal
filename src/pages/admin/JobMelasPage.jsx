import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Plus, Search, Filter, Eye, Building2, MapPin,
  Clock, CheckCircle2, Ticket, XCircle, Inbox, Check, X, AlertCircle,
  FileSpreadsheet, FileText
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import ExportDropdown from '../../components/ui/ExportDropdown';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';
import { exportToExcel, exportToPDF, getExportFilename } from '../../utils/exportUtils';

export default function AdminJobMelasPage() {
  const { addToast } = useToast();
  const {
    jobMelas,
    candidates,
    companies,
    registrations,
    approveJobMela,
    rejectJobMela
  } = useAdmin();

  // Three primary actions state: 'ADMIN_CREATED' | 'REQUESTS'
  const [activeAction, setActiveAction] = useState('ADMIN_CREATED');

  // Search and status filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [requestStatusTab, setRequestStatusTab] = useState('ALL');

  // Main event view modal
  const [selectedMela, setSelectedMela] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Request details modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestDetailsOpen, setRequestDetailsOpen] = useState(false);

  // Status-based filter tabs for Job Melas (strictly preserved)
  const filterTabs = [
    { key: 'ALL', label: 'All Career Melas' },
    { key: 'UPCOMING', label: 'Upcoming' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'ONGOING', label: 'Ongoing Today' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  // Helper to identify Admin Created vs External Requests
  const isAdminCreated = (m) =>
    Boolean(m.createdByAdmin || m.organizer?.includes('NTR Vikasa') || m.organizer === 'NTR Vikasa State Employment Authority');

  // 1. Admin Created Job Melas
  const adminMelas = jobMelas.filter((m) => isAdminCreated(m));

  // 2. External Organization Requests
  const requestsList = jobMelas.filter((m) => !isAdminCreated(m) || m.status === 'PENDING');
  const pendingRequestsCount = jobMelas.filter((m) => m.status === 'PENDING').length;

  // Filtered Admin Melas
  const filteredAdminMelas = adminMelas.filter((e) => {
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

  // Filtered Requests
  const filteredRequests = requestsList.filter((r) => {
    const title = r.event || r.title || '';
    const organizer = r.organizer || '';
    const location = r.location || r.venue || '';
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!title.toLowerCase().includes(q) && !organizer.toLowerCase().includes(q) && !location.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (requestStatusTab !== 'ALL' && r.status !== requestStatusTab) {
      return false;
    }
    return true;
  });

  const currentList = activeAction === 'ADMIN_CREATED' ? filteredAdminMelas : filteredRequests;

  const handleExportMainExcel = () => {
    if (currentList.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting Job Melas list to Excel...', 'info');
    const headers = [
      'Job Mela Name',
      'Event Date',
      'Time',
      'Venue',
      'Location / City',
      'Organizing Authority',
      'Status',
      'Participating Companies',
      'Registered Candidates'
    ];
    const rows = currentList.map(m => [
      m.event || m.title || 'Job Mela Event',
      m.date ? new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Sept 2026',
      m.time || '09:00 AM - 05:00 PM',
      m.venue || m.location || 'Convention Center',
      m.location || 'Andhra Pradesh',
      m.organizer || 'NTR Vikasa Authority',
      m.status || 'UPCOMING',
      m.companiesCount || (Array.isArray(m.companies) ? m.companies.length : 35),
      m.registeredCandidatesCount || m.registeredCandidates || 1200
    ]);
    exportToExcel({
      filename: getExportFilename('job_melas', activeAction === 'ADMIN_CREATED' ? statusFilter.toLowerCase() : requestStatusTab.toLowerCase(), 'xlsx'),
      sheetName: 'Job Melas',
      headers,
      rows
    });
    addToast('Excel export downloaded successfully!', 'success');
  };

  const handleExportMainPdf = () => {
    if (currentList.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting Job Melas list to PDF...', 'info');
    const headers = ['Event Name', 'Date', 'Location', 'Organizer', 'Status', 'Companies', 'Registrations'];
    const rows = currentList.map(m => [
      m.event || m.title || 'Job Mela Event',
      m.date ? new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Sept 2026',
      m.location || 'Andhra Pradesh',
      m.organizer || 'NTR Vikasa Authority',
      m.status || 'UPCOMING',
      m.companiesCount || (Array.isArray(m.companies) ? m.companies.length : 35),
      m.registeredCandidatesCount || m.registeredCandidates || 1200
    ]);
    const currentFilterTitle = activeAction === 'ADMIN_CREATED' ? statusFilter : requestStatusTab;
    exportToPDF({
      filename: getExportFilename('job_melas', currentFilterTitle.toLowerCase(), 'pdf'),
      title: activeAction === 'ADMIN_CREATED' ? 'Job Melas & Career Summits' : 'Job Mela Event Requests',
      subtitle: `Status: ${currentFilterTitle === 'ALL' ? 'All Events' : currentFilterTitle}`,
      metadata: {
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Status Filter': currentFilterTitle === 'ALL' ? 'All Events' : currentFilterTitle,
        'Total Records': currentList.length
      },
      headers,
      rows
    });
    addToast('PDF export downloaded successfully!', 'success');
  };

  // Scoped helper for individual mela candidates
  const getScopedMelaCandidates = (mela) => {
    if (!mela) return [];
    const eventQuery = (mela.event || mela.title || '').toLowerCase();
    const matching = (registrations || []).filter(r => {
      const regEvent = (r.event || r.eventName || '').toLowerCase();
      return regEvent.includes(eventQuery) || eventQuery.includes(regEvent);
    });
    if (matching.length > 0) return matching;
    return (candidates || []).slice(0, 10).map((c, idx) => ({
      id: `REG-${mela.id || 'MELA'}-${1000 + idx}`,
      candidate: c.name,
      candidateEmail: c.email,
      phone: c.phone || '+91 98765 43210',
      registrationDate: c.registrationDate || '2026-08-28',
      status: 'CONFIRMED',
      event: mela.event || mela.title,
      position: c.headline || 'Software Engineer'
    }));
  };

  // Scoped helper for individual mela participating companies
  const getScopedMelaCompanies = (mela) => {
    if (!mela) return [];
    return (companies || []).map((comp, idx) => ({
      company: comp.name,
      position: idx % 2 === 0 ? 'Software Engineer / Graduate Trainee' : 'Operations Specialist & Analyst',
      qualification: 'B.Tech / B.Sc / Any Degree',
      experience: '0-3 Years',
      salary: '₹3,50,000 - ₹8,00,000 / year',
      vacancies: 15 + (idx * 5),
      applications: 45 + (idx * 12),
      location: mela.location || comp.location || 'On-site Mela Stalls',
      notes: comp.verificationStatus === 'VERIFIED' ? 'Verified Participant' : 'Pending Verification'
    }));
  };

  const handleExportMelaCandidatesExcel = () => {
    if (!selectedMela) return;
    const records = getScopedMelaCandidates(selectedMela);
    if (records.length === 0) {
      addToast('No registered candidates available for this Job Mela.', 'info');
      return;
    }
    addToast('Exporting registered candidates to Excel...', 'info');
    const headers = ['Registration ID', 'Candidate Name', 'Email', 'Phone', 'Registration Date', 'Registration Status', 'Job Mela'];
    const rows = records.map(r => [
      r.id || 'REG-N/A',
      r.candidate || r.candidateName || r.name || 'Candidate',
      r.candidateEmail || r.email || 'N/A',
      r.phone || '+91 98765 43210',
      r.registrationDate || 'Aug 2026',
      r.status || 'CONFIRMED',
      selectedMela.event || selectedMela.title || 'Job Mela'
    ]);
    const melaSlug = (selectedMela.event || selectedMela.title || 'mela').toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    exportToExcel({
      filename: `${melaSlug}_registered_candidates.xlsx`,
      sheetName: 'Registered Candidates',
      headers,
      rows
    });
    addToast('Candidates Excel export downloaded!', 'success');
  };

  const handleExportMelaCandidatesPdf = () => {
    if (!selectedMela) return;
    const records = getScopedMelaCandidates(selectedMela);
    if (records.length === 0) {
      addToast('No registered candidates available for this Job Mela.', 'info');
      return;
    }
    addToast('Exporting registered candidates to PDF...', 'info');
    const headers = ['Reg ID', 'Candidate Name', 'Email', 'Phone', 'Date', 'Status'];
    const rows = records.map(r => [
      r.id || 'REG-N/A',
      r.candidate || r.candidateName || r.name || 'Candidate',
      r.candidateEmail || r.email || 'N/A',
      r.phone || '+91 98765 43210',
      r.registrationDate || 'Aug 2026',
      r.status || 'CONFIRMED'
    ]);
    const melaSlug = (selectedMela.event || selectedMela.title || 'mela').toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    exportToPDF({
      filename: `${melaSlug}_registered_candidates.pdf`,
      title: `${selectedMela.event || selectedMela.title} — Registered Candidates`,
      subtitle: `Venue: ${selectedMela.venue || selectedMela.location} | Date: ${selectedMela.date || '15 Sept 2026'}`,
      metadata: {
        'Job Mela': selectedMela.event || selectedMela.title,
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Total Candidates': records.length
      },
      headers,
      rows
    });
    addToast('Candidates PDF export downloaded!', 'success');
  };

  const handleExportMelaCompaniesExcel = () => {
    if (!selectedMela) return;
    const records = getScopedMelaCompanies(selectedMela);
    if (records.length === 0) {
      addToast('No participating companies available for this Job Mela.', 'info');
      return;
    }
    addToast('Exporting participating companies to Excel...', 'info');
    const headers = ['Company', 'Position / Role', 'Qualification', 'Experience', 'Salary', 'Vacancies', 'Applications', 'Location', 'Notes'];
    const rows = records.map(c => [
      c.company,
      c.position,
      c.qualification,
      c.experience,
      c.salary,
      c.vacancies,
      c.applications,
      c.location,
      c.notes
    ]);
    const melaSlug = (selectedMela.event || selectedMela.title || 'mela').toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    exportToExcel({
      filename: `${melaSlug}_participating_companies.xlsx`,
      sheetName: 'Participating Companies',
      headers,
      rows
    });
    addToast('Participating companies Excel downloaded!', 'success');
  };

  const handleExportMelaCompaniesPdf = () => {
    if (!selectedMela) return;
    const records = getScopedMelaCompanies(selectedMela);
    if (records.length === 0) {
      addToast('No participating companies available for this Job Mela.', 'info');
      return;
    }
    addToast('Exporting participating companies to PDF...', 'info');
    const headers = ['Company', 'Role', 'Experience', 'Salary', 'Vacancies', 'Location'];
    const rows = records.map(c => [
      c.company,
      c.position,
      c.experience,
      c.salary,
      c.vacancies,
      c.location
    ]);
    const melaSlug = (selectedMela.event || selectedMela.title || 'mela').toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    exportToPDF({
      filename: `${melaSlug}_participating_companies.pdf`,
      title: `${selectedMela.event || selectedMela.title} — Participating Companies`,
      subtitle: `Venue: ${selectedMela.venue || selectedMela.location} | Date: ${selectedMela.date || '15 Sept 2026'}`,
      metadata: {
        'Job Mela': selectedMela.event || selectedMela.title,
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Total Companies': records.length
      },
      headers,
      rows
    });
    addToast('Participating companies PDF downloaded!', 'success');
  };

  const individualMelaExportItems = [
    {
      label: 'Registered Candidates - Excel (.xlsx)',
      icon: <FileSpreadsheet size={15} style={{ color: '#16a34a' }} />,
      onClick: handleExportMelaCandidatesExcel
    },
    {
      label: 'Registered Candidates - PDF (.pdf)',
      icon: <FileText size={15} style={{ color: '#dc2626' }} />,
      onClick: handleExportMelaCandidatesPdf
    },
    {
      label: 'Participating Companies - Excel (.xlsx)',
      icon: <FileSpreadsheet size={15} style={{ color: '#16a34a' }} />,
      onClick: handleExportMelaCompaniesExcel
    },
    {
      label: 'Participating Companies - PDF (.pdf)',
      icon: <FileText size={15} style={{ color: '#dc2626' }} />,
      onClick: handleExportMelaCompaniesPdf
    }
  ];

  const handleApprove = (m) => {
    approveJobMela(m.id);
    addToast(`"${m.event || m.title}" has been APPROVED.`, 'success');
    if (selectedMela?.id === m.id) {
      setSelectedMela({ ...selectedMela, status: 'APPROVED' });
    }
    if (selectedRequest?.id === m.id) {
      setSelectedRequest({ ...selectedRequest, status: 'APPROVED' });
    }
  };

  const handleReject = (m) => {
    rejectJobMela(m.id);
    addToast(`"${m.event || m.title}" has been REJECTED.`, 'info');
    if (selectedMela?.id === m.id) {
      setSelectedMela({ ...selectedMela, status: 'REJECTED' });
    }
    if (selectedRequest?.id === m.id) {
      setSelectedRequest({ ...selectedRequest, status: 'REJECTED' });
    }
  };

  // Columns for Admin Created Melas Table
  const adminColumns = [
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
      label: 'Organizing Authority',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', fontWeight: 600 }}>{v || 'NTR Vikasa Authority'}</span>
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

  // Columns for Job Mela Requests Table
  const requestColumns = [
    {
      key: 'event',
      label: 'Job Mela / Event Name',
      sortable: true,
      render: (_, row) => {
        const title = row.event || row.title || 'Job Mela Event';
        const venue = row.venue || row.location || 'Proposed Venue';
        return (
          <div>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{title}</strong>
            <span style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: 600 }}>{venue}</span>
          </div>
        );
      }
    },
    {
      key: 'organizer',
      label: 'Requesting Organization / Authority',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)' }}>{v || 'External Authority'}</span>
    },
    {
      key: 'date',
      label: 'Proposed Date & Time',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
          <strong style={{ display: 'block' }}>
            {row.date ? new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '20 Oct 2026'}
          </strong>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.time || '09:00 AM - 05:00 PM'}</span>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Venue / Location',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>📍 {v || 'Hyderabad'}</span>
    },
    {
      key: 'requestDate',
      label: 'Request Date',
      render: (v, row) => {
        const reqDate = v || row.createdAt || '2026-09-01';
        return (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            {new Date(reqDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Request Status',
      render: (v) => <StatusBadge status={v || 'PENDING'} />
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
              setSelectedRequest(row);
              setRequestDetailsOpen(true);
            }}
          >
            View Details
          </Button>

          {row.status === 'PENDING' && (
            <>
              <Button
                size="xs"
                variant="primary"
                leftIcon={<Check size={12} />}
                onClick={() => handleApprove(row)}
              >
                Approve
              </Button>
              <Button
                size="xs"
                variant="danger"
                leftIcon={<X size={12} />}
                onClick={() => handleReject(row)}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-job-melas-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar with Exactly 3 Primary Actions */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <CalendarDays size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Mega Job Melas & Career Summits</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Govern state-wide employment drives, review external summit requests, and allocate company booths.
            </p>
          </div>

          {/* Actions Area */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant={activeAction === 'REQUESTS' ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Inbox size={16} />}
              onClick={() => setActiveAction('REQUESTS')}
            >
              Job Mela Requests {pendingRequestsCount > 0 ? `(${pendingRequestsCount})` : ''}
            </Button>
            <Button
              variant={activeAction === 'ADMIN_CREATED' ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<CalendarDays size={16} />}
              onClick={() => setActiveAction('ADMIN_CREATED')}
            >
              Admin Created Melas
            </Button>
            <Link to="/admin/job-melas/create" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
                Create Job Mela
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── VIEW 1: ADMIN CREATED MELAS ── */}
      {activeAction === 'ADMIN_CREATED' && (
        <>
          {/* Search & Status Filter Tabs for Admin Created Melas */}
          <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 440 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search admin-created events, venue, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
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

                <ExportDropdown
                  onExportExcel={handleExportMainExcel}
                  onExportPdf={handleExportMainPdf}
                  disabled={filteredAdminMelas.length === 0}
                />
              </div>
            </div>
          </div>

          {/* Admin Created Melas Table */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
            {filteredAdminMelas.length === 0 ? (
              <EmptyState
                icon={<CalendarDays size={40} />}
                title="No Admin Created Job Melas Found"
                description="No admin-created job mela events match your search or status filter."
              />
            ) : (
              <Table columns={adminColumns} data={filteredAdminMelas} />
            )}
          </div>
        </>
      )}

      {/* ── VIEW 2: JOB MELA REQUESTS ── */}
      {activeAction === 'REQUESTS' && (
        <>
          {/* Search & Request Status Filters */}
          <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 440 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search request event name, organization, venue..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
                  {[
                    { key: 'ALL', label: 'All Requests' },
                    { key: 'PENDING', label: `Pending (${pendingRequestsCount})` },
                    { key: 'APPROVED', label: 'Approved' },
                    { key: 'REJECTED', label: 'Rejected' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setRequestStatusTab(tab.key)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: requestStatusTab === tab.key ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                        background: requestStatusTab === tab.key ? 'var(--color-primary-600)' : 'var(--color-surface)',
                        color: requestStatusTab === tab.key ? '#fff' : 'var(--color-text-muted)',
                        transition: 'all 150ms ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <ExportDropdown
                  onExportExcel={handleExportMainExcel}
                  onExportPdf={handleExportMainPdf}
                  disabled={filteredRequests.length === 0}
                />
              </div>
            </div>
          </div>

          {/* Job Mela Requests Table */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
            {filteredRequests.length === 0 ? (
              <EmptyState
                icon={<Inbox size={40} />}
                title="No Job Mela Requests Found"
                description="No external organization requests match your search or filter."
              />
            ) : (
              <Table columns={requestColumns} data={filteredRequests} />
            )}
          </div>
        </>
      )}

      {/* ── 1. Event Details View Modal ── */}
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
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Candidate Passes:</strong> {selectedMela.registeredCandidatesCount || selectedMela.registeredCandidates || 2400}+ Issued</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Status:</strong> {selectedMela.status}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', flexWrap: 'wrap' }}>
              <ExportDropdown items={individualMelaExportItems} label="Export" />
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

      {/* ── 2. Request Details View Modal ── */}
      {requestDetailsOpen && selectedRequest && (
        <Modal
          isOpen={requestDetailsOpen}
          onClose={() => setRequestDetailsOpen(false)}
          title={`Job Mela Request: ${selectedRequest.event || selectedRequest.title}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Header Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#fff',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)'
            }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Inbox size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: 0, color: '#fff' }}>
                    {selectedRequest.event || selectedRequest.title}
                  </h3>
                  <StatusBadge status={selectedRequest.status || 'PENDING'} />
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Submitted by: <strong style={{ color: '#e2e8f0' }}>{selectedRequest.organizer || 'External Authority'}</strong>
                </p>
              </div>
            </div>

            {/* Request Information Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Event Logistics & Location
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <strong>Proposed Date:</strong> {selectedRequest.date ? new Date(selectedRequest.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '20 Oct 2026'}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <strong>Event Timings:</strong> {selectedRequest.time || '09:00 AM - 05:00 PM'}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <strong>Venue / Ground:</strong> {selectedRequest.venue || selectedRequest.location}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}>
                  <strong>City / Region:</strong> {selectedRequest.location || 'Andhra Pradesh'}
                </p>
              </div>

              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Scale & Request Timeline
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <strong>Target Vacancies:</strong> {selectedRequest.vacanciesCount || 800}+ Positions
                </p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <strong>Expected Companies:</strong> {selectedRequest.companiesCount || 40}+ Employers
                </p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <strong>Submission Date:</strong> {new Date(selectedRequest.requestDate || selectedRequest.createdAt || '2026-09-01').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}>
                  <strong>Current Status:</strong> {selectedRequest.status || 'PENDING'}
                </p>
              </div>
            </div>

            {/* Request Review Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button variant="outline" size="sm" onClick={() => setRequestDetailsOpen(false)}>
                Close
              </Button>
              {selectedRequest.status === 'PENDING' && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<X size={14} />}
                    onClick={() => {
                      handleReject(selectedRequest);
                      setSelectedRequest({ ...selectedRequest, status: 'REJECTED' });
                    }}
                  >
                    Reject Request
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Check size={14} />}
                    onClick={() => {
                      handleApprove(selectedRequest);
                      setSelectedRequest({ ...selectedRequest, status: 'APPROVED' });
                    }}
                  >
                    Approve & Publish Event
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}


