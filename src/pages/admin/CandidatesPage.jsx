import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users, Search, Filter, Eye, ShieldAlert, ShieldCheck,
  Mail, Phone, MapPin, GraduationCap, Briefcase, FileText,
  CheckCircle2, XCircle, AlertTriangle, Sparkles, Calendar, Ticket,
  Download, FileSpreadsheet
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import ExportDropdown from '../../components/ui/ExportDropdown';
import { exportToExcel, exportToPDF, exportToCSV, generatePDFBlob, getExportFilename } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';
import { useCandidate } from '../../context/CandidateContext';
import {
  isJobMelaApplication,
  getApplicationNumber,
  getApplicationType,
  getJobMelaDetails,
  normalizeApplication
} from '../../utils/applicationUtils';

// Consolidated Pages
import AdminApplicationsPage from './ApplicationsPage';
import AdminRegistrationsPage from './RegistrationsPage';

export default function AdminCandidatesPage() {
  const { addToast } = useToast();
  const { candidates, suspendCandidate, activateCandidate } = useAdmin();
  const { allCandidateApplications = [] } = useCandidate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const validTabs = ['candidates', 'applications', 'registrations'];
  const currentTab = validTabs.includes(tabParam) ? tabParam : 'candidates';

  const [activeSection, setActiveSection] = useState(currentTab);

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveSection(tabParam);
    } else if (!tabParam) {
      setActiveSection('candidates');
    }
  }, [tabParam]);

  const handleTabChange = (tabKey) => {
    setActiveSection(tabKey);
    if (tabKey === 'candidates') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabKey });
    }
  };

  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Candidate Profile Modal
  const [selectedCand, setSelectedCand] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Suspend Dialog
  const [suspendTarget, setSuspendTarget] = useState(null);

  // Derive all submitted applications for the selected candidate
  const candidateAppsList = useMemo(() => {
    if (!selectedCand) return [];
    // Match in allCandidateApplications
    const matches = allCandidateApplications.filter(ca =>
      (ca.candidateId && ca.candidateId === selectedCand.id) ||
      (ca.candidateEmail && ca.candidateEmail.toLowerCase() === selectedCand.email?.toLowerCase()) ||
      (ca.candidateName && ca.candidateName.toLowerCase() === selectedCand.name?.toLowerCase())
    );

    if (matches.length > 0) {
      return matches.map(app => normalizeApplication(app));
    }

    // Fallback: check selectedCand.applications if present
    if (Array.isArray(selectedCand.applications)) {
      return selectedCand.applications.map(app => normalizeApplication(app, selectedCand));
    }

    return [];
  }, [selectedCand, allCandidateApplications]);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesEmail = c.email?.toLowerCase().includes(q);
        const matchesHeadline = c.headline?.toLowerCase().includes(q);
        const matchesSkills = c.skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesHeadline && !matchesSkills) return false;
      }
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'ACTIVE' && c.accountStatus !== 'ACTIVE') return false;
        if (statusFilter === 'SUSPENDED' && c.accountStatus !== 'SUSPENDED') return false;
      }
      return true;
    });
  }, [candidates, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleActivate = (c) => {
    activateCandidate(c.id);
    addToast(`${c.name}'s account is now ACTIVE.`, 'success');
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    suspendCandidate(suspendTarget.id);
    addToast(`Candidate account for ${suspendTarget.name} has been SUSPENDED.`, 'error');
    setSuspendTarget(null);
  };

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting candidate list to Excel...', 'info');
    const headers = [
      'Candidate Name',
      'Headline',
      'Email',
      'Phone',
      'Location',
      'Registration Date',
      'Profile Status',
      'Account Status'
    ];
    const rows = filtered.map(c => [
      c.name || 'N/A',
      c.headline || 'Job Seeker',
      c.email || 'N/A',
      c.phone || 'N/A',
      c.location || 'India',
      c.registrationDate ? new Date(c.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026',
      c.profileStatus || 'COMPLETE',
      c.accountStatus || 'ACTIVE'
    ]);
    exportToExcel({
      filename: getExportFilename('candidates', statusFilter.toLowerCase(), 'xlsx'),
      sheetName: 'Candidates',
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
    addToast('Exporting candidate list to PDF...', 'info');
    const headers = ['Candidate', 'Email', 'Phone', 'Registration Date', 'Profile Status', 'Account Status'];
    const rows = filtered.map(c => [
      c.name || 'N/A',
      c.email || 'N/A',
      c.phone || 'N/A',
      c.registrationDate ? new Date(c.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026',
      c.profileStatus || 'COMPLETE',
      c.accountStatus || 'ACTIVE'
    ]);
    exportToPDF({
      filename: getExportFilename('candidates', statusFilter.toLowerCase(), 'pdf'),
      title: 'Platform Candidates Directory Report',
      subtitle: `NTR Vikasa Admin Report - Status: ${statusFilter === 'ALL' ? 'All Accounts' : statusFilter}`,
      metadata: {
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Status Filter': statusFilter === 'ALL' ? 'All Accounts' : statusFilter,
        'Search Query': search || 'None',
        'Total Records': filtered.length
      },
      headers,
      rows
    });
    addToast('PDF export downloaded successfully!', 'success');
  };

  // ── Single Candidate Actions (Resume & Export) ──
  const handleViewResume = () => {
    if (!selectedCand) return;
    const resumeFileName = selectedCand.resumeName || selectedCand.resume?.fileName || (selectedCand.name ? `${selectedCand.name.replace(/\s+/g, '_')}_Resume.pdf` : 'Priya_Sharma_Resume.pdf');
    if (selectedCand.resumeUrl) {
      window.open(selectedCand.resumeUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Generate candidate resume PDF for native browser viewing
    const headers = ['Resume Section', 'Candidate Details'];
    const rows = [
      ['Candidate Name', selectedCand.name || 'N/A'],
      ['Headline / Role', selectedCand.headline || 'Job Seeker'],
      ['Email Address', selectedCand.email || 'N/A'],
      ['Phone Number', selectedCand.phone || 'N/A'],
      ['Current Location', selectedCand.location || 'India'],
      ['Total Experience', selectedCand.experience || 'N/A'],
      ['Education Background', selectedCand.education || 'N/A'],
      ['Skills & Competencies', Array.isArray(selectedCand.skills) ? selectedCand.skills.join(', ') : (selectedCand.skills || 'N/A')],
      ['Applications Submitted', `${selectedCand.applicationsCount || 0} applications submitted`],
      ['Verification Status', selectedCand.profileStatus || 'COMPLETE']
    ];

    const blob = generatePDFBlob({
      filename: resumeFileName,
      title: `Curriculum Vitae: ${selectedCand.name}`,
      subtitle: `Verified Candidate Resume Document — ${selectedCand.headline || 'Job Seeker'}`,
      metadata: {
        'Candidate Name': selectedCand.name || 'N/A',
        'Document': resumeFileName,
        'Experience': selectedCand.experience || 'N/A',
        'Status': selectedCand.accountStatus || 'ACTIVE'
      },
      headers,
      rows
    });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  };

  const handleDownloadResume = () => {
    if (!selectedCand) return;
    const resumeFileName = selectedCand.resumeName || selectedCand.resume?.fileName || (selectedCand.name ? `${selectedCand.name.replace(/\s+/g, '_')}_Resume.pdf` : 'Priya_Sharma_Resume.pdf');
    if (selectedCand.resumeUrl) {
      const a = document.createElement('a');
      a.href = selectedCand.resumeUrl;
      a.download = resumeFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Generate and download candidate resume PDF
    const headers = ['Resume Section', 'Candidate Details'];
    const rows = [
      ['Candidate Name', selectedCand.name || 'N/A'],
      ['Headline / Role', selectedCand.headline || 'Job Seeker'],
      ['Email Address', selectedCand.email || 'N/A'],
      ['Phone Number', selectedCand.phone || 'N/A'],
      ['Current Location', selectedCand.location || 'India'],
      ['Total Experience', selectedCand.experience || 'N/A'],
      ['Education Background', selectedCand.education || 'N/A'],
      ['Skills & Competencies', Array.isArray(selectedCand.skills) ? selectedCand.skills.join(', ') : (selectedCand.skills || 'N/A')],
      ['Applications Submitted', `${selectedCand.applicationsCount || 0} applications submitted`],
      ['Verification Status', selectedCand.profileStatus || 'COMPLETE']
    ];

    exportToPDF({
      filename: resumeFileName,
      title: `Curriculum Vitae: ${selectedCand.name}`,
      subtitle: `Verified Candidate Resume Document — ${selectedCand.headline || 'Job Seeker'}`,
      metadata: {
        'Candidate Name': selectedCand.name || 'N/A',
        'Document': resumeFileName,
        'Experience': selectedCand.experience || 'N/A',
        'Status': selectedCand.accountStatus || 'ACTIVE'
      },
      headers,
      rows
    });
    addToast(`Downloading candidate resume: ${resumeFileName}`, 'success');
  };

  const handleExportSingleCandidateExcel = () => {
    if (!selectedCand) return;
    addToast(`Exporting ${selectedCand.name}'s profile to Excel...`, 'info');
    const headers = [
      'Candidate Name',
      'Headline / Designation',
      'Email',
      'Phone',
      'Location',
      'Experience',
      'Education',
      'Skills',
      'Applications Count',
      'Registration Date',
      'Profile Status',
      'Account Status'
    ];
    const rows = [
      [
        selectedCand.name || 'N/A',
        selectedCand.headline || 'Job Seeker',
        selectedCand.email || 'N/A',
        selectedCand.phone || 'N/A',
        selectedCand.location || 'India',
        selectedCand.experience || 'N/A',
        selectedCand.education || 'N/A',
        Array.isArray(selectedCand.skills) ? selectedCand.skills.join(', ') : (selectedCand.skills || 'N/A'),
        selectedCand.applicationsCount !== undefined ? selectedCand.applicationsCount : 0,
        selectedCand.registrationDate ? new Date(selectedCand.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026',
        selectedCand.profileStatus || 'COMPLETE',
        selectedCand.accountStatus || 'ACTIVE'
      ]
    ];
    const safeBaseName = selectedCand.name ? selectedCand.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_') : 'candidate';
    exportToExcel({
      filename: `candidate_${safeBaseName}_profile.xlsx`,
      sheetName: 'Candidate Profile',
      headers,
      rows
    });
    addToast('Candidate Excel export downloaded successfully!', 'success');
  };

  const handleExportSingleCandidateCsv = () => {
    if (!selectedCand) return;
    addToast(`Exporting ${selectedCand.name}'s profile to CSV...`, 'info');
    const headers = [
      'Candidate Name',
      'Headline / Designation',
      'Email',
      'Phone',
      'Location',
      'Experience',
      'Education',
      'Skills',
      'Applications Count',
      'Registration Date',
      'Profile Status',
      'Account Status'
    ];
    const rows = [
      [
        selectedCand.name || 'N/A',
        selectedCand.headline || 'Job Seeker',
        selectedCand.email || 'N/A',
        selectedCand.phone || 'N/A',
        selectedCand.location || 'India',
        selectedCand.experience || 'N/A',
        selectedCand.education || 'N/A',
        Array.isArray(selectedCand.skills) ? selectedCand.skills.join(', ') : (selectedCand.skills || 'N/A'),
        selectedCand.applicationsCount !== undefined ? selectedCand.applicationsCount : 0,
        selectedCand.registrationDate ? new Date(selectedCand.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026',
        selectedCand.profileStatus || 'COMPLETE',
        selectedCand.accountStatus || 'ACTIVE'
      ]
    ];
    const safeBaseName = selectedCand.name ? selectedCand.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_') : 'candidate';
    exportToCSV({
      filename: `candidate_${safeBaseName}_profile.csv`,
      headers,
      rows
    });
    addToast('Candidate CSV export downloaded successfully!', 'success');
  };

  const handleExportSingleCandidatePdf = () => {
    if (!selectedCand) return;
    addToast(`Exporting ${selectedCand.name}'s profile to PDF...`, 'info');
    const safeBaseName = selectedCand.name ? selectedCand.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_') : 'candidate';
    const headers = ['Profile Field', 'Information'];
    const rows = [
      ['Candidate Name', selectedCand.name || 'N/A'],
      ['Headline / Designation', selectedCand.headline || 'Job Seeker'],
      ['Email Address', selectedCand.email || 'N/A'],
      ['Phone Number', selectedCand.phone || 'N/A'],
      ['Location', selectedCand.location || 'India'],
      ['Total Experience', selectedCand.experience || 'N/A'],
      ['Education Details', selectedCand.education || 'N/A'],
      ['Skills & Competencies', Array.isArray(selectedCand.skills) ? selectedCand.skills.join(', ') : (selectedCand.skills || 'N/A')],
      ['Applications Submitted', `${selectedCand.applicationsCount || 0} applications`],
      ['Registration Date', selectedCand.registrationDate ? new Date(selectedCand.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026'],
      ['Profile Status', selectedCand.profileStatus || 'COMPLETE'],
      ['Account Status', selectedCand.accountStatus || 'ACTIVE']
    ];

    exportToPDF({
      filename: `candidate_${safeBaseName}_profile.pdf`,
      title: `Candidate Profile: ${selectedCand.name}`,
      subtitle: `NTR Vikasa Candidate Record - ${selectedCand.headline || 'Job Seeker'}`,
      metadata: {
        'Generated Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Candidate Name': selectedCand.name || 'N/A',
        'Account Status': selectedCand.accountStatus || 'ACTIVE',
        'Profile Status': selectedCand.profileStatus || 'COMPLETE'
      },
      headers,
      rows
    });
    addToast('Candidate PDF export downloaded successfully!', 'success');
  };

  const columns = [
    {
      key: 'name',
      label: 'Candidate',
      sortable: true,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-primary-600), #7c3aed)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 'var(--text-sm)'
          }}>
            {row.name?.[0] || 'C'}
          </div>
          <div>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{row.name}</strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.headline || 'Job Seeker'}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>{row.location}</span>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email & Phone',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Mail size={12} style={{ color: 'var(--color-primary-600)' }} />
            <span>{row.email}</span>
          </div>
          {row.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, color: 'var(--color-text-muted)' }}>
              <Phone size={12} />
              <span>{row.phone}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'registrationDate',
      label: 'Registration Date',
      sortable: true,
      render: (v) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
          {v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026'}
        </span>
      )
    },
    {
      key: 'profileStatus',
      label: 'Profile Status',
      render: (v) => {
        const isComplete = v === 'COMPLETE' || v === 'VERIFIED';
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: isComplete ? '#ecfdf5' : '#fffbeb',
            color: isComplete ? '#047857' : '#b45309',
            border: isComplete ? '1px solid #a7f3d0' : '1px solid #fde68a',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isComplete ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            {v || 'COMPLETE'}
          </span>
        );
      }
    },
    {
      key: 'accountStatus',
      label: 'Account Status',
      render: (v) => {
        const isActive = v === 'ACTIVE';
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: isActive ? '#f0fdf4' : '#fef2f2',
            color: isActive ? '#15803d' : '#b91c1c',
            border: isActive ? '1px solid #bbf7d0' : '1px solid #fecaca',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isActive ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
            {v || 'ACTIVE'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Button
            size="xs"
            variant="outline"
            leftIcon={<Eye size={13} />}
            onClick={() => {
              setSelectedCand(row);
              setProfileModalOpen(true);
            }}
          >
            View Profile
          </Button>

          {row.accountStatus === 'ACTIVE' ? (
            <Button
              size="xs"
              variant="danger"
              onClick={() => setSuspendTarget(row)}
            >
              Suspend
            </Button>
          ) : (
            <Button
              size="xs"
              variant="secondary"
              onClick={() => handleActivate(row)}
            >
              Activate
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-candidates-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── 0. Consolidated Navigation Tabs (Candidates | Applications | Job Mela Registrations) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: 'var(--color-surface)',
        padding: '6px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        width: 'fit-content',
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => handleTabChange('candidates')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'candidates' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'candidates' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'candidates' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <Users size={16} /> Candidates
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('applications')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'applications' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'applications' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'applications' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <FileText size={16} /> Applications
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('registrations')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'registrations' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'registrations' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'registrations' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <Ticket size={16} /> Job Mela Registrations
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeSection === 'applications' ? (
        <AdminApplicationsPage />
      ) : activeSection === 'registrations' ? (
        <AdminRegistrationsPage />
      ) : (
        <>
          {/* Header Bar */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                  <Users size={20} style={{ color: 'var(--color-primary-600)' }} />
                  <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Platform Candidates Directory</h1>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Search, moderate, and manage job seekers registered across NTR Vikasa employment programs.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span style={{
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700
                }}>
                  {candidates.filter(c => c.accountStatus === 'ACTIVE').length} Active Candidates
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
                  placeholder="Search candidate name, email, headline, skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
                  {['ALL', 'ACTIVE', 'SUSPENDED'].map((filterKey) => (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setStatusFilter(filterKey)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: statusFilter === filterKey ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                        background: statusFilter === filterKey ? 'var(--color-primary-600)' : 'var(--color-surface)',
                        color: statusFilter === filterKey ? '#fff' : 'var(--color-text-muted)',
                        transition: 'all 150ms ease'
                      }}
                    >
                      {filterKey === 'ALL' ? 'All Accounts' : filterKey}
                    </button>
                  ))}
                </div>

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
                icon={<Users size={40} />}
                title="No Candidates Found"
                description="No candidate records match your current search and filter criteria."
              />
            ) : (
              <>
                <Table columns={columns} data={paginatedCandidates} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filtered.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                />
              </>
            )}
          </div>

          {/* ── 1. Candidate Full Profile Modal ── */}
          {profileModalOpen && selectedCand && (
            <Modal
              isOpen={profileModalOpen}
              onClose={() => setProfileModalOpen(false)}
              title={`Candidate Profile: ${selectedCand.name}`}
              size="lg"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Header Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                  color: '#fff',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-xl)'
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 800
                  }}>
                    {selectedCand.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff' }}>{selectedCand.name}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: '#c7d2fe', margin: '2px 0 0 0' }}>{selectedCand.headline}</p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#e0e7ff' }}>
                      <span>📍 {selectedCand.location}</span>
                      <span>💼 Experience: {selectedCand.experience}</span>
                      <span>📅 Joined: {selectedCand.registrationDate || 'Aug 2026'}</span>
                    </div>
                  </div>
                </div>

                {/* Candidate Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Contact Information
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Email:</strong> {selectedCand.email}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Phone:</strong> {selectedCand.phone || '+91 98765 43210'}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Location:</strong> {selectedCand.location}</p>
                  </div>

                  <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Education & Experience
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Education:</strong> {selectedCand.education || 'B.Tech Computer Science'}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Experience:</strong> {selectedCand.experience}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Applications:</strong> {selectedCand.applicationsCount || 12} Submitted</p>
                  </div>
                </div>

                {/* Resume Section */}
                {(() => {
                  const resumeFileName = selectedCand.resumeName || selectedCand.resume?.fileName || (selectedCand.name ? `${selectedCand.name.replace(/\s+/g, '_')}_Resume.pdf` : 'Priya_Sharma_Resume.pdf');

                  return (
                    <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                        Resume
                      </h4>
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
                              {resumeFileName}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              Candidate Resume Document
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
                    </div>
                  );
                })()}

                {/* Skills */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                    Skills & Competencies
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {selectedCand.skills?.map((skill) => (
                      <span key={skill} style={{
                        background: 'var(--color-primary-50)',
                        color: 'var(--color-primary-700)',
                        border: '1px solid var(--color-primary-200)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submitted Applications History */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
                      Submitted Applications ({candidateAppsList.length})
                    </h4>
                  </div>

                  {candidateAppsList.length === 0 ? (
                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                      No active job applications found for this candidate.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {candidateAppsList.map((app) => (
                        <div
                          key={app.id || app.appNumber}
                          style={{
                            background: app.isMela ? '#fbf8ff' : 'var(--color-surface)',
                            border: `1px solid ${app.isMela ? '#e9d5ff' : 'var(--color-border)'}`,
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-3)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 'var(--space-2)'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                              <span style={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                fontSize: 'var(--text-xs)',
                                background: app.isMela ? '#f5f3ff' : '#eff6ff',
                                color: app.isMela ? '#6d28d9' : '#1d4ed8',
                                border: `1px solid ${app.isMela ? '#ddd6fe' : '#bfdbfe'}`,
                                padding: '2px 7px',
                                borderRadius: '4px',
                                letterSpacing: '0.03em'
                              }}>
                                {app.appNumber || getApplicationNumber(app)}
                              </span>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '10px',
                                background: app.isMela ? '#ecfdf5' : '#f1f5f9',
                                color: app.isMela ? '#047857' : 'var(--color-text-muted)',
                                border: `1px solid ${app.isMela ? '#a7f3d0' : '#e2e8f0'}`
                              }}>
                                {app.applicationType || (app.isMela ? 'Job Mela Application' : 'Direct Job Application')}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                Applied: {app.appliedDate || 'Aug 2026'}
                              </span>
                            </div>
                            <div style={{ marginTop: 4 }}>
                              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                                {app.jobTitle || app.title || app.job || 'Position'}
                              </strong>
                              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginLeft: 6 }}>
                                at <strong style={{ color: 'var(--color-text)' }}>{app.company}</strong>
                              </span>
                            </div>
                            {app.isMela && (
                              <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', fontSize: '11px' }}>
                                <span style={{ color: '#7c3aed', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <Sparkles size={11} />
                                  Job Mela: {app.melaTitle || app.melaDetails?.melaTitle || 'AP Mega IT & ITES Job Mela 2026'}
                                </span>
                                {(app.passId || app.melaDetails?.passId) && (
                                  <span style={{ color: '#047857', fontWeight: 600, fontFamily: 'monospace' }}>
                                    Pass: {app.passId || app.melaDetails?.passId}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div>
                            <StatusBadge status={app.status || 'APPLIED'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: 'var(--space-4)'
                }}>
                  <div>
                    <ExportDropdown
                      label="Export Candidate"
                      size="sm"
                      align="left"
                      items={[
                        {
                          label: 'Export PDF',
                          icon: <FileText size={15} style={{ color: '#dc2626' }} />,
                          onClick: handleExportSingleCandidatePdf
                        },
                        {
                          label: 'Export CSV',
                          icon: <FileSpreadsheet size={15} style={{ color: '#0284c7' }} />,
                          onClick: handleExportSingleCandidateCsv
                        },
                        {
                          label: 'Export Excel',
                          icon: <FileSpreadsheet size={15} style={{ color: '#16a34a' }} />,
                          onClick: handleExportSingleCandidateExcel
                        }
                      ]}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <Button variant="outline" onClick={() => setProfileModalOpen(false)}>
                      Close
                    </Button>
                    {selectedCand.accountStatus === 'ACTIVE' ? (
                      <Button
                        variant="danger"
                        onClick={() => {
                          setProfileModalOpen(false);
                          setSuspendTarget(selectedCand);
                        }}
                      >
                        Suspend Account
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => {
                          handleActivate(selectedCand);
                          setSelectedCand({ ...selectedCand, accountStatus: 'ACTIVE' });
                        }}
                      >
                        Activate Account
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Modal>
          )}

          {/* ── 2. Confirm Suspend Dialog ── */}
          {suspendTarget && (
            <ConfirmDialog
              isOpen={Boolean(suspendTarget)}
              title="Suspend Candidate Account?"
              message={`Are you sure you want to suspend candidate ${suspendTarget.name} (${suspendTarget.email})? The candidate will no longer be able to submit job applications.`}
              confirmLabel="Confirm Suspension"
              confirmVariant="danger"
              onConfirm={handleConfirmSuspend}
              onCancel={() => setSuspendTarget(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
