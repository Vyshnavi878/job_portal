import { useState, useMemo, useEffect } from 'react';
import {
  FileText, Search, Filter, Eye, Building2, User,
  Calendar, CheckCircle2, Clock, XCircle, Briefcase, DollarSign,
  Mail, Phone, MapPin, GraduationCap, Download, FileSpreadsheet,
  ShieldCheck, Info, ExternalLink, Sparkles, Ticket
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
import { useCandidate } from '../../context/CandidateContext';
import {
  isJobMelaApplication,
  getApplicationNumber,
  getApplicationType,
  getJobMelaDetails,
  normalizeApplication,
  formatJobId,
  formatInternshipId,
  formatMelaId,
  formatRegistrationId
} from '../../utils/applicationUtils';

export default function AdminApplicationsPage() {
  const { addToast } = useToast();
  const { applications, candidates = [], jobs = [], recruiters = [] } = useAdmin();
  const { allCandidateApplications = [] } = useCandidate();

  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Selected Application for Audit Dossier
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Candidate Profile Modal view
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [activeCandProfile, setActiveCandProfile] = useState(null);

  // Merge admin applications with candidate applications to guarantee consistent Application No and Job Mela details
  const allApplications = useMemo(() => {
    const list = [];
    const seenIds = new Set();
    const seenAppNumbers = new Set();

    // 1. Process admin applications, enriched with candidate application numbers and details
    (applications || []).forEach((adminApp) => {
      const matchedCandApp = allCandidateApplications.find((ca) =>
        ca.id === adminApp.id ||
        (ca.candidateEmail?.toLowerCase() === (adminApp.candidateEmail || '').toLowerCase() &&
         (ca.jobId === adminApp.jobId || ca.title?.toLowerCase() === (adminApp.job || adminApp.jobTitle || '').toLowerCase()))
      );

      const isMela = matchedCandApp ? isJobMelaApplication(matchedCandApp) : isJobMelaApplication(adminApp);
      const melaDetails = matchedCandApp ? getJobMelaDetails(matchedCandApp) : getJobMelaDetails(adminApp);
      const normCand = matchedCandApp ? normalizeApplication(matchedCandApp) : null;
      const normAdmin = normalizeApplication(adminApp);

      const merged = matchedCandApp
        ? {
            ...adminApp,
            ...normCand,
            appNumber: matchedCandApp.appNumber || getApplicationNumber(matchedCandApp),
            applicationType: matchedCandApp.applicationType || getApplicationType(matchedCandApp),
            isMela,
            melaDetails,
            melaTitle: matchedCandApp.melaTitle || melaDetails?.melaTitle || adminApp.melaTitle,
            passId: matchedCandApp.passId || melaDetails?.passId || adminApp.passId || normCand.passId,
            melaIdFormatted: normCand.melaIdFormatted || (isMela ? formatMelaId(melaDetails?.melaId || adminApp.melaId || 1) : null),
            jobIdFormatted: normCand.jobIdFormatted || (adminApp.isIntern || adminApp.type === 'Internship' ? formatInternshipId(adminApp.jobId || adminApp.id) : formatJobId(adminApp.jobId || adminApp.id)),
            company: matchedCandApp.company || adminApp.company,
            candidate: adminApp.candidate || adminApp.candidateName || normCand.candidateName || 'Candidate',
            job: adminApp.job || adminApp.jobTitle || normCand.jobTitle || 'Position',
          }
        : {
            ...normAdmin,
            candidate: adminApp.candidate || adminApp.candidateName || 'Candidate',
            job: adminApp.job || adminApp.jobTitle || 'Position',
            company: adminApp.company,
            jobIdFormatted: normAdmin.jobIdFormatted || (adminApp.isIntern || adminApp.type === 'Internship' ? formatInternshipId(adminApp.jobId || adminApp.id) : formatJobId(adminApp.jobId || adminApp.id)),
            melaIdFormatted: normAdmin.melaIdFormatted || (isMela ? formatMelaId(melaDetails?.melaId || adminApp.melaId || 1) : null),
          };

      list.push(merged);
      seenIds.add(merged.id);
      if (merged.appNumber) seenAppNumbers.add(merged.appNumber);
    });

    // 2. Include candidate applications (such as Job Mela applications NTR-01-04-0001, NTR-01-02-0024)
    allCandidateApplications.forEach((candApp) => {
      const norm = normalizeApplication(candApp);
      if (!seenIds.has(norm.id) && !seenAppNumbers.has(norm.appNumber)) {
        list.push({
          ...candApp,
          ...norm,
          candidate: candApp.candidateName || candApp.candidate || 'Candidate',
          job: candApp.jobTitle || candApp.title || 'Position',
          jobIdFormatted: norm.jobIdFormatted || (candApp.type === 'Internship' ? formatInternshipId(candApp.jobId || candApp.id) : formatJobId(candApp.jobId || candApp.id)),
          melaIdFormatted: norm.melaIdFormatted || (norm.isMela ? formatMelaId(candApp.melaId || norm.melaDetails?.melaId || 1) : null),
          passId: norm.passId || candApp.passId || norm.melaDetails?.passId,
        });
        seenIds.add(norm.id);
        if (norm.appNumber) seenAppNumbers.add(norm.appNumber);
      }
    });

    return list;
  }, [applications, allCandidateApplications]);

  const filterTabs = [
    { key: 'ALL', label: 'All Applications' },
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'SELECTED', label: 'Selected / Hired' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  const filtered = useMemo(() => {
    return allApplications.filter((app) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesCand = app.candidate?.toLowerCase().includes(q) || app.candidateName?.toLowerCase().includes(q);
        const matchesJob = app.job?.toLowerCase().includes(q) || app.jobTitle?.toLowerCase().includes(q);
        const matchesJobId = (app.jobIdFormatted || app.jobId)?.toLowerCase().includes(q);
        const matchesCompany = app.company?.toLowerCase().includes(q);
        const matchesAppNo = app.appNumber?.toLowerCase().includes(q);
        const matchesType = app.applicationType?.toLowerCase().includes(q);
        const matchesMela = (app.melaTitle || app.melaDetails?.melaTitle)?.toLowerCase().includes(q);
        const matchesMelaId = (app.melaIdFormatted)?.toLowerCase().includes(q);
        const matchesPass = (app.passId || app.melaDetails?.passId)?.toLowerCase().includes(q);
        if (!matchesCand && !matchesJob && !matchesJobId && !matchesCompany && !matchesAppNo && !matchesType && !matchesMela && !matchesMelaId && !matchesPass) return false;
      }
      if (statusFilter !== 'ALL') {
        if (app.status !== statusFilter) return false;
      }
      return true;
    });
  }, [allApplications, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  // Matched candidate & job for selected application
  const matchedCand = useMemo(() => {
    if (!selectedApp) return null;
    return candidates.find((c) =>
      (selectedApp.candidateId && c.id === selectedApp.candidateId) ||
      (selectedApp.candidateEmail && c.email?.toLowerCase() === selectedApp.candidateEmail?.toLowerCase()) ||
      (c.name?.toLowerCase() === (selectedApp.candidate || selectedApp.candidateName)?.toLowerCase())
    );
  }, [selectedApp, candidates]);

  const matchedJob = useMemo(() => {
    if (!selectedApp) return null;
    return jobs.find((j) =>
      (selectedApp.jobId && j.id === selectedApp.jobId) ||
      (j.title?.toLowerCase() === (selectedApp.job || selectedApp.jobTitle)?.toLowerCase() &&
       j.company?.toLowerCase() === selectedApp.company?.toLowerCase())
    );
  }, [selectedApp, jobs]);

  const handleOpenCandidateProfile = () => {
    if (!selectedApp) return;
    const profileData = matchedCand || {
      id: selectedApp.candidateId || 'cand-ext',
      name: selectedApp.candidate || selectedApp.candidateName || 'Candidate',
      email: selectedApp.candidateEmail || 'candidate@example.com',
      phone: selectedApp.candidatePhone || '+91 98765 43210',
      headline: selectedApp.job || selectedApp.jobTitle || 'Job Seeker',
      location: selectedApp.candidateLocation || 'India',
      experience: selectedApp.experience || '3.5 Years',
      education: selectedApp.education || 'B.Tech Computer Science',
      skills: selectedApp.skills || ['JavaScript', 'React', 'Problem Solving'],
      registrationDate: selectedApp.appliedDate || '2026-08-01',
      profileStatus: 'COMPLETE',
      accountStatus: 'ACTIVE',
      applicationsCount: 1,
      resumeName: selectedApp.resumeName || `${(selectedApp.candidate || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`
    };
    setActiveCandProfile(profileData);
    setCandidateModalOpen(true);
  };

  // ── Single Application Resume Actions ──
  const candResumeName = selectedApp?.resumeName || matchedCand?.resumeName || (selectedApp?.candidate ? `${selectedApp.candidate.replace(/\s+/g, '_')}_Resume.pdf` : (matchedCand?.name ? `${matchedCand.name.replace(/\s+/g, '_')}_Resume.pdf` : null));

  const handleViewResume = () => {
    if (!selectedApp) return;
    if (selectedApp.resumeUrl || matchedCand?.resumeUrl) {
      window.open(selectedApp.resumeUrl || matchedCand.resumeUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const candName = selectedApp.candidate || selectedApp.candidateName || matchedCand?.name || 'Candidate';
    const resumeFileName = candResumeName || `${candName.replace(/\s+/g, '_')}_Resume.pdf`;
    const headers = ['Resume Section', 'Candidate Details'];
    const rows = [
      ['Candidate Name', candName],
      ['Applied Position', selectedApp.job || selectedApp.jobTitle || matchedJob?.title || 'Job Seeker'],
      ['Target Company', selectedApp.company || matchedJob?.company || 'NTR Vikasa Partner Employer'],
      ['Email Address', selectedApp.candidateEmail || matchedCand?.email || 'N/A'],
      ['Phone Number', selectedApp.candidatePhone || matchedCand?.phone || '+91 98765 43210'],
      ['Location', matchedCand?.location || selectedApp.candidateLocation || matchedJob?.location || 'India'],
      ['Experience', matchedCand?.experience || selectedApp.experience || 'N/A'],
      ['Education', matchedCand?.education || selectedApp.education || 'Graduate'],
      ['Skills', Array.isArray(matchedCand?.skills || selectedApp.skills) ? (matchedCand?.skills || selectedApp.skills).join(', ') : (matchedCand?.skills || selectedApp.skills || 'N/A')],
      ['Application ID & Date', `${selectedApp.id || 'APP'} • Applied ${selectedApp.appliedDate || 'Aug 2026'}`],
      ['Application Status', selectedApp.status || 'UNDER_REVIEW']
    ];

    const blob = generatePDFBlob({
      filename: resumeFileName,
      title: `Candidate Resume: ${candName}`,
      subtitle: `Application Dossier — ${selectedApp.job || selectedApp.jobTitle || 'Job Application'} at ${selectedApp.company || matchedJob?.company || 'NTR Vikasa'}`,
      metadata: {
        'Candidate Name': candName,
        'Application ID': selectedApp.id || 'N/A',
        'Position': selectedApp.job || selectedApp.jobTitle || 'N/A',
        'Status': selectedApp.status || 'UNDER_REVIEW'
      },
      headers,
      rows
    });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  };

  const handleDownloadResume = () => {
    if (!selectedApp) return;
    const candName = selectedApp.candidate || selectedApp.candidateName || matchedCand?.name || 'Candidate';
    const resumeFileName = candResumeName || `${candName.replace(/\s+/g, '_')}_Resume.pdf`;
    if (selectedApp.resumeUrl || matchedCand?.resumeUrl) {
      const a = document.createElement('a');
      a.href = selectedApp.resumeUrl || matchedCand.resumeUrl;
      a.download = resumeFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const headers = ['Resume Section', 'Candidate Details'];
    const rows = [
      ['Candidate Name', candName],
      ['Applied Position', selectedApp.job || selectedApp.jobTitle || matchedJob?.title || 'Job Seeker'],
      ['Target Company', selectedApp.company || matchedJob?.company || 'NTR Vikasa Partner Employer'],
      ['Email Address', selectedApp.candidateEmail || matchedCand?.email || 'N/A'],
      ['Phone Number', selectedApp.candidatePhone || matchedCand?.phone || '+91 98765 43210'],
      ['Location', matchedCand?.location || selectedApp.candidateLocation || matchedJob?.location || 'India'],
      ['Experience', matchedCand?.experience || selectedApp.experience || 'N/A'],
      ['Education', matchedCand?.education || selectedApp.education || 'Graduate'],
      ['Skills', Array.isArray(matchedCand?.skills || selectedApp.skills) ? (matchedCand?.skills || selectedApp.skills).join(', ') : (matchedCand?.skills || selectedApp.skills || 'N/A')],
      ['Application ID & Date', `${selectedApp.id || 'APP'} • Applied ${selectedApp.appliedDate || 'Aug 2026'}`],
      ['Application Status', selectedApp.status || 'UNDER_REVIEW']
    ];

    exportToPDF({
      filename: resumeFileName,
      title: `Candidate Resume: ${candName}`,
      subtitle: `Application Dossier — ${selectedApp.job || selectedApp.jobTitle || 'Job Application'} at ${selectedApp.company || matchedJob?.company || 'NTR Vikasa'}`,
      metadata: {
        'Candidate Name': candName,
        'Application ID': selectedApp.id || 'N/A',
        'Position': selectedApp.job || selectedApp.jobTitle || 'N/A',
        'Status': selectedApp.status || 'UNDER_REVIEW'
      },
      headers,
      rows
    });
    addToast(`Downloading candidate resume: ${resumeFileName}`, 'success');
  };

  // ── Single Application Export Actions ──
  const handleExportSingleAppExcel = () => {
    if (!selectedApp) return;
    addToast(`Exporting Application ${selectedApp.id} to Excel...`, 'info');
    const candName = selectedApp.candidate || selectedApp.candidateName || matchedCand?.name || 'N/A';
    const candEmail = selectedApp.candidateEmail || matchedCand?.email || 'N/A';
    const candPhone = selectedApp.candidatePhone || matchedCand?.phone || '+91 98765 43210';
    const jobTitle = selectedApp.job || selectedApp.jobTitle || matchedJob?.title || 'N/A';
    const recruiterLead = selectedApp.recruiter || matchedJob?.recruiter || 'Talent Acquisition Team';
    const location = matchedJob?.location || matchedCand?.location || 'India';
    const experience = matchedCand?.experience || selectedApp.experience || matchedJob?.experience || 'N/A';
    const education = matchedCand?.education || selectedApp.education || 'Graduate';
    const skills = Array.isArray(matchedCand?.skills) ? matchedCand.skills.join(', ') : (Array.isArray(selectedApp.skills) ? selectedApp.skills.join(', ') : 'N/A');
    const salary = selectedApp.salary || matchedJob?.salary || 'Market Standards';

    const headers = [
      'Application No',
      'Application Type',
      'Application ID',
      'Candidate Name',
      'Candidate Email',
      'Candidate Phone',
      'Job Title',
      'Company',
      'Job Mela Event',
      'Registration Pass ID',
      'Recruiter Lead',
      'Date Applied',
      'Current Stage',
      'Location',
      'Experience',
      'Education',
      'Skills',
      'Offered / Budget Compensation'
    ];

    const rows = [
      [
        selectedApp.appNumber || getApplicationNumber(selectedApp),
        selectedApp.applicationType || (selectedApp.isMela ? 'Job Mela Application' : 'Direct Job Application'),
        selectedApp.id,
        candName,
        candEmail,
        candPhone,
        jobTitle,
        selectedApp.company || 'N/A',
        selectedApp.isMela ? (selectedApp.melaTitle || selectedApp.melaDetails?.melaTitle || 'AP Mega IT & ITES Job Mela 2026') : 'N/A',
        selectedApp.isMela ? (selectedApp.passId || selectedApp.melaDetails?.passId || 'N/A') : 'N/A',
        recruiterLead,
        selectedApp.appliedDate ? new Date(selectedApp.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '20 Aug 2026',
        selectedApp.status || 'APPLIED',
        location,
        experience,
        education,
        skills,
        salary
      ]
    ];

    exportToExcel({
      filename: `application_${selectedApp.appNumber || selectedApp.id}_audit_record.xlsx`,
      sheetName: 'Application Audit',
      headers,
      rows
    });
    addToast('Application Excel export downloaded successfully!', 'success');
  };

  const handleExportSingleAppCsv = () => {
    if (!selectedApp) return;
    addToast(`Exporting Application ${selectedApp.appNumber || selectedApp.id} to CSV...`, 'info');
    const candName = selectedApp.candidate || selectedApp.candidateName || matchedCand?.name || 'N/A';
    const candEmail = selectedApp.candidateEmail || matchedCand?.email || 'N/A';
    const candPhone = selectedApp.candidatePhone || matchedCand?.phone || '+91 98765 43210';
    const jobTitle = selectedApp.job || selectedApp.jobTitle || matchedJob?.title || 'N/A';
    const recruiterLead = selectedApp.recruiter || matchedJob?.recruiter || 'Talent Acquisition Team';
    const location = matchedJob?.location || matchedCand?.location || 'India';
    const experience = matchedCand?.experience || selectedApp.experience || matchedJob?.experience || 'N/A';
    const education = matchedCand?.education || selectedApp.education || 'Graduate';
    const skills = Array.isArray(matchedCand?.skills) ? matchedCand.skills.join(', ') : (Array.isArray(selectedApp.skills) ? selectedApp.skills.join(', ') : 'N/A');
    const salary = selectedApp.salary || matchedJob?.salary || 'Market Standards';

    const headers = [
      'Application No',
      'Application Type',
      'Application ID',
      'Candidate Name',
      'Candidate Email',
      'Candidate Phone',
      'Job Title',
      'Company',
      'Job Mela Event',
      'Registration Pass ID',
      'Recruiter Lead',
      'Date Applied',
      'Current Stage',
      'Location',
      'Experience',
      'Education',
      'Skills',
      'Offered / Budget Compensation'
    ];

    const rows = [
      [
        selectedApp.appNumber || getApplicationNumber(selectedApp),
        selectedApp.applicationType || (selectedApp.isMela ? 'Job Mela Application' : 'Direct Job Application'),
        selectedApp.id,
        candName,
        candEmail,
        candPhone,
        jobTitle,
        selectedApp.company || 'N/A',
        selectedApp.isMela ? (selectedApp.melaTitle || selectedApp.melaDetails?.melaTitle || 'AP Mega IT & ITES Job Mela 2026') : 'N/A',
        selectedApp.isMela ? (selectedApp.passId || selectedApp.melaDetails?.passId || 'N/A') : 'N/A',
        recruiterLead,
        selectedApp.appliedDate ? new Date(selectedApp.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '20 Aug 2026',
        selectedApp.status || 'APPLIED',
        location,
        experience,
        education,
        skills,
        salary
      ]
    ];

    exportToCSV({
      filename: `application_${selectedApp.appNumber || selectedApp.id}_audit_record.csv`,
      headers,
      rows
    });
    addToast('Application CSV export downloaded successfully!', 'success');
  };

  const handleExportSingleAppPdf = () => {
    if (!selectedApp) return;
    addToast(`Exporting Application ${selectedApp.appNumber || selectedApp.id} to PDF...`, 'info');
    const candName = selectedApp.candidate || selectedApp.candidateName || matchedCand?.name || 'N/A';
    const jobTitle = selectedApp.job || selectedApp.jobTitle || matchedJob?.title || 'N/A';
    const recruiterLead = selectedApp.recruiter || matchedJob?.recruiter || 'Talent Acquisition Team';
    const location = matchedJob?.location || matchedCand?.location || 'India';
    const experience = matchedCand?.experience || selectedApp.experience || matchedJob?.experience || 'N/A';
    const education = matchedCand?.education || selectedApp.education || 'Graduate';
    const skills = Array.isArray(matchedCand?.skills) ? matchedCand.skills.join(', ') : (Array.isArray(selectedApp.skills) ? selectedApp.skills.join(', ') : 'N/A');
    const salary = selectedApp.salary || matchedJob?.salary || 'Market Standards';

    const headers = ['Audit Field', 'Details'];
    const rows = [
      ['Application No', selectedApp.appNumber || getApplicationNumber(selectedApp)],
      ['Application Type', selectedApp.applicationType || (selectedApp.isMela ? 'Job Mela Application' : 'Direct Job Application')],
      ['Application ID', selectedApp.id],
      ['Candidate Name', candName],
      ['Candidate Email', selectedApp.candidateEmail || matchedCand?.email || 'N/A'],
      ['Candidate Phone', selectedApp.candidatePhone || matchedCand?.phone || '+91 98765 43210'],
      ['Applying For Position', jobTitle],
      ['Hiring Enterprise / Company', selectedApp.company || 'N/A'],
      ...(selectedApp.isMela ? [
        ['Job Mela Event', selectedApp.melaTitle || selectedApp.melaDetails?.melaTitle || 'AP Mega IT & ITES Job Mela 2026'],
        ['Registration ID / Pass ID', selectedApp.passId || selectedApp.melaDetails?.passId || 'N/A']
      ] : []),
      ['Recruiter Lead', recruiterLead],
      ['Date Applied', selectedApp.appliedDate ? new Date(selectedApp.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '20 Aug 2026'],
      ['Current Application Stage', selectedApp.status || 'APPLIED'],
      ['Location', location],
      ['Candidate Experience', experience],
      ['Candidate Education', education],
      ['Skills & Competencies', skills],
      ['Compensation / Salary', salary],
      ['System Audit Status', 'Verified Application Record']
    ];

    exportToPDF({
      filename: `application_${selectedApp.appNumber || selectedApp.id}_audit_record.pdf`,
      title: `Application Record Audit Dossier - ${selectedApp.appNumber || selectedApp.id}`,
      subtitle: `${candName}  |  ${jobTitle} at ${selectedApp.company}`,
      metadata: {
        'Application No': selectedApp.appNumber || getApplicationNumber(selectedApp),
        'Application Type': selectedApp.applicationType || (selectedApp.isMela ? 'Job Mela' : 'Direct'),
        'Candidate': candName,
        'Company': selectedApp.company,
        'Current Stage': selectedApp.status || 'APPLIED',
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      },
      headers,
      rows
    });
    addToast('Application PDF export downloaded successfully!', 'success');
  };

  // ── List Level Export Handlers ──
  const handleExportExcel = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting applications list to Excel...', 'info');
    const headers = [
      'Application No',
      'Application Type',
      'Job / Internship ID',
      'Candidate Name',
      'Candidate Email',
      'Job Title',
      'Company',
      'Job Mela ID',
      'Job Mela Event',
      'Registration Pass ID',
      'Applied Date',
      'Application Status'
    ];
    const rows = filtered.map((app) => [
      app.appNumber || getApplicationNumber(app),
      app.applicationType || (app.isMela ? 'Job Mela Application' : 'Direct Job Application'),
      app.jobIdFormatted || (app.applicationType === 'Internship' ? formatInternshipId(app.jobId || app.id) : formatJobId(app.jobId || app.id)) || 'N/A',
      app.candidate || app.candidateName || 'N/A',
      app.candidateEmail || 'N/A',
      app.job || app.jobTitle || 'Role',
      app.company || 'N/A',
      app.isMela ? (app.melaIdFormatted || formatMelaId(app.melaId || app.melaDetails?.melaId || 1)) : 'N/A',
      app.isMela ? (app.melaTitle || app.melaDetails?.melaTitle || 'AP Mega IT & ITES Job Mela 2026') : 'N/A',
      app.isMela ? (app.passId || app.melaDetails?.passId || 'N/A') : 'N/A',
      app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026',
      app.status || 'APPLIED'
    ]);
    const statusLabel = statusFilter === 'ALL' ? 'all' : statusFilter.toLowerCase();
    exportToExcel({
      filename: getExportFilename('applications', statusLabel, 'xlsx'),
      sheetName: 'Applications',
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
    addToast('Exporting applications list to PDF...', 'info');
    const headers = ['App No', 'Type', 'Job ID', 'Candidate Name', 'Job Title', 'Company', 'Applied Date', 'Status'];
    const rows = filtered.map((app) => [
      app.appNumber || getApplicationNumber(app),
      app.isMela ? 'Job Mela' : 'Direct',
      app.jobIdFormatted || (app.applicationType === 'Internship' ? formatInternshipId(app.jobId || app.id) : formatJobId(app.jobId || app.id)) || 'N/A',
      app.candidate || app.candidateName || 'N/A',
      app.job || app.jobTitle || 'Role',
      app.company || 'N/A',
      app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026',
      app.status || 'APPLIED'
    ]);
    const tabObj = filterTabs.find((t) => t.key === statusFilter);
    const statusLabel = tabObj ? tabObj.label : statusFilter;

    exportToPDF({
      filename: getExportFilename('applications', statusFilter.toLowerCase(), 'pdf'),
      title: 'Platform Applications Activity Report',
      subtitle: `NTR Vikasa Admin Audit Report - Filter: ${statusLabel}`,
      metadata: {
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Status Filter': statusLabel,
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
      key: 'appNumber',
      label: 'Application No',
      sortable: true,
      render: (_, row) => (
        <div>
          <span style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 'var(--text-xs)',
            background: row.isMela ? '#f5f3ff' : '#eff6ff',
            color: row.isMela ? '#6d28d9' : '#1d4ed8',
            border: `1px solid ${row.isMela ? '#ddd6fe' : '#bfdbfe'}`,
            padding: '2px 7px',
            borderRadius: '4px',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            letterSpacing: '0.03em'
          }}>
            {row.appNumber || getApplicationNumber(row)}
          </span>
          <span style={{
            display: 'block',
            fontSize: '10px',
            marginTop: '3px',
            color: row.isMela ? '#047857' : 'var(--color-text-muted)',
            fontWeight: 600
          }}>
            {row.applicationType || (row.isMela ? 'Job Mela Application' : 'Direct Job Application')}
          </span>
        </div>
      )
    },
    {
      key: 'candidate',
      label: 'Candidate',
      sortable: true,
      render: (_, row) => {
        const candName = row.candidate || row.candidateName || 'Candidate';
        const candEmail = row.candidateEmail || 'candidate@example.com';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #4338ca, #6366f1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 'var(--text-sm)'
            }}>
              {candName[0]}
            </div>
            <div>
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{candName}</strong>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{candEmail}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'job',
      label: 'Job Title',
      sortable: true,
      render: (_, row) => {
        const title = row.job || row.jobTitle || 'Role';
        const formattedJobId = row.jobIdFormatted || (row.applicationType === 'Internship' ? formatInternshipId(row.jobId || row.id) : formatJobId(row.jobId || row.id));
        const formattedMelaId = row.melaIdFormatted || (row.isMela ? formatMelaId(row.melaId || row.melaDetails?.melaId || 1) : null);
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{title}</strong>
              {formattedJobId && (
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  padding: '1px 5px',
                  borderRadius: '3px'
                }}>
                  {formattedJobId}
                </span>
              )}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--color-primary-600)', display: 'block', fontWeight: 600 }}>{row.company}</span>
            {row.isMela && (
              <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '9.5px',
                  background: '#fdf4ff',
                  color: '#7c3aed',
                  border: '1px solid #f0abfc',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  {formattedMelaId && <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{formattedMelaId}</span>}
                  <span>🎪 {row.melaTitle || row.melaDetails?.melaTitle || 'Job Mela'}</span>
                </span>
                {(row.passId || row.melaDetails?.passId) && (
                  <span style={{ fontSize: '9.5px', color: '#047857', fontWeight: 600, fontFamily: 'monospace' }}>
                    Pass: {row.passId || row.melaDetails?.passId}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (v) => <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v}</strong>
    },
    {
      key: 'appliedDate',
      label: 'Applied Date',
      sortable: true,
      render: (v) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
          {v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={v} />
    },
    {
      key: 'actions',
      label: 'Audit View',
      render: (_, row) => (
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Eye size={12} />}
          onClick={() => {
            setSelectedApp(row);
            setModalOpen(true);
          }}
        >
          View Record
        </Button>
      )
    }
  ];

  // Stage Progression Configuration
  const isRejected = selectedApp?.status === 'REJECTED';
  const defaultStages = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'SELECTED', label: 'Selected / Hired' },
  ];
  const rejectedStages = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'REJECTED', label: 'Application Rejected' },
  ];
  const timelineStages = isRejected ? rejectedStages : defaultStages;
  const currentStatusKey = selectedApp?.status || 'APPLIED';
  const stageIndex = timelineStages.findIndex((s) => s.key === currentStatusKey);

  return (
    <div className="admin-applications-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <FileText size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Applications Activity Monitoring</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Live audit monitor of all job seeker applications across public vacancies and recruitment drives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <span style={{
              background: '#f8fafc',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '6px 12px',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700
            }}>
              {applications.length + 48900} Total Applications Tracked
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
              placeholder="Search candidate name, job title, company..."
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
            icon={<FileText size={40} />}
            title="No Applications Found"
            description="No application logs match your current search and filter criteria."
          />
        ) : (
          <>
            <Table columns={columns} data={paginatedApplications} />
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

      {/* ── 1. Application Detail Modal (Audit Dossier View) ── */}
      {modalOpen && selectedApp && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Application Record Audit Dossier"
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

            {/* ── Section 1: Application Summary (Header Gradient) ── */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#fff',
                    background: 'rgba(255,255,255,0.2)',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-md)',
                    letterSpacing: '0.04em'
                  }}>
                    Application No: {selectedApp.appNumber || getApplicationNumber(selectedApp)}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    background: selectedApp.isMela ? '#10b981' : 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700
                  }}>
                    {selectedApp.applicationType || (selectedApp.isMela ? 'Job Mela Application' : 'Direct Job Application')}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#c7d2fe',
                    fontWeight: 700
                  }}>
                    ID: {selectedApp.id}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700
                  }}>
                    Official Audit Dossier
                  </span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: '6px 0 0 0', color: '#fff' }}>
                  {selectedApp.candidate || selectedApp.candidateName || matchedCand?.name || 'Candidate'}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: '#c7d2fe', margin: '4px 0 0 0' }}>
                  <strong>Applying for:</strong> {selectedApp.job || selectedApp.jobTitle || matchedJob?.title || 'Position'}
                  {(selectedApp.jobIdFormatted || selectedApp.jobId) && (
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '11px',
                      background: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginLeft: '6px'
                    }}>
                      {selectedApp.jobIdFormatted || (selectedApp.applicationType === 'Internship' ? formatInternshipId(selectedApp.jobId || selectedApp.id) : formatJobId(selectedApp.jobId || selectedApp.id))}
                    </span>
                  )}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: '#e0e7ff', margin: '2px 0 0 0' }}>
                  <strong>Company:</strong> {selectedApp.company}
                </p>
              </div>
            </div>

            {/* Job Mela Event Identification (if applicable) */}
            {selectedApp.isMela && (
              <div style={{
                background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                border: '1px solid #d8b4fe',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b21a8' }}>
                    <Sparkles size={16} />
                    <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Job Mela Application Identification
                    </h4>
                  </div>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: '#6b21a8',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {selectedApp.melaIdFormatted || formatMelaId(selectedApp.melaId || selectedApp.melaDetails?.melaId || 1)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#7e22ce', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Job Mela Event</span>
                    <strong style={{ color: '#581c87', fontSize: 'var(--text-sm)' }}>{selectedApp.melaTitle || selectedApp.melaDetails?.melaTitle || 'AP Mega IT & ITES Job Mela 2026'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#7e22ce', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Participating Company</span>
                    <strong style={{ color: '#581c87', fontSize: 'var(--text-sm)' }}>{selectedApp.company}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#7e22ce', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Applied Position</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: 2 }}>
                      <strong style={{ color: '#581c87', fontSize: 'var(--text-sm)' }}>{selectedApp.job || selectedApp.jobTitle}</strong>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        {selectedApp.jobIdFormatted || (selectedApp.applicationType === 'Internship' ? formatInternshipId(selectedApp.jobId || selectedApp.id) : formatJobId(selectedApp.jobId || selectedApp.id))}
                      </span>
                    </div>
                  </div>
                  {(selectedApp.passId || selectedApp.melaDetails?.passId) && (
                    <div>
                      <span style={{ fontSize: '10px', color: '#047857', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Registration ID / Pass ID</span>
                      <strong style={{ color: '#065f46', fontSize: 'var(--text-sm)', fontFamily: 'monospace' }}>{selectedApp.passId || selectedApp.melaDetails?.passId}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Section 2: Application Status Summary ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'var(--space-3)'
            }}>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>
                  RECRUITER LEAD
                </span>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', display: 'block', marginTop: 3 }}>
                  {selectedApp.recruiter || matchedJob?.recruiter || 'Talent Acquisition Team'}
                </strong>
              </div>

              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>
                  DATE APPLIED
                </span>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', display: 'block', marginTop: 3 }}>
                  {selectedApp.appliedDate ? new Date(selectedApp.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '20 Aug 2026'}
                </strong>
              </div>

              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>
                  CURRENT STAGE
                </span>
                <StatusBadge status={selectedApp.status || 'APPLIED'} />
              </div>

              {(selectedApp.salary || matchedJob?.salary) && (
                <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>
                    OFFERED / BUDGET COMPENSATION
                  </span>
                  <strong style={{ fontSize: 'var(--text-xs)', color: '#047857', display: 'block', marginTop: 3 }}>
                    {selectedApp.salary || matchedJob?.salary || 'Market Standards'}
                  </strong>
                </div>
              )}

              {selectedApp.source && (
                <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>
                    APPLICATION SOURCE
                  </span>
                  <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', display: 'block', marginTop: 3 }}>
                    {selectedApp.source}
                  </strong>
                </div>
              )}

              {selectedApp.lastUpdated && (
                <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>
                    LAST UPDATED
                  </span>
                  <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', display: 'block', marginTop: 3 }}>
                    {selectedApp.lastUpdated}
                  </strong>
                </div>
              )}
            </div>

            {/* ── Section 3: Candidate Snapshot & Section 4: Job Details (2-Column Grid) ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>

              {/* Candidate Snapshot */}
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0, letterSpacing: '0.05em' }}>
                    Candidate Snapshot
                  </h4>
                  <Button
                    size="xs"
                    variant="ghost"
                    leftIcon={<ExternalLink size={12} />}
                    onClick={handleOpenCandidateProfile}
                    style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px' }}
                  >
                    View Full Profile
                  </Button>
                </div>

                <div style={{ fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>
                    <strong style={{ color: 'var(--color-text)', fontSize: 'var(--text-sm)', display: 'block' }}>
                      {selectedApp.candidate || selectedApp.candidateName || matchedCand?.name || 'Candidate'}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                      {matchedCand?.headline || selectedApp.job || 'Job Seeker'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <Mail size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span>{selectedApp.candidateEmail || matchedCand?.email || 'N/A'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <Phone size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span>{selectedApp.candidatePhone || matchedCand?.phone || '+91 98765 43210'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <MapPin size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span>{matchedCand?.location || selectedApp.candidateLocation || 'India'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <Briefcase size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Experience:</strong> {matchedCand?.experience || selectedApp.experience || '3.5 Years'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <GraduationCap size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Education:</strong> {matchedCand?.education || selectedApp.education || 'B.Tech Computer Science'}</span>
                  </div>

                  {/* Candidate Skills */}
                  {(matchedCand?.skills || selectedApp.skills) && (
                    <div style={{ marginTop: 4 }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>
                        SKILLS:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {(matchedCand?.skills || selectedApp.skills || []).map((sk) => (
                          <span key={sk} style={{
                            background: 'var(--color-primary-50)',
                            color: 'var(--color-primary-700)',
                            border: '1px solid var(--color-primary-200)',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '10px',
                            fontWeight: 600
                          }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Details Snapshot */}
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
                  Job Details
                </h4>

                <div style={{ fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>
                    <strong style={{ color: 'var(--color-text)', fontSize: 'var(--text-sm)', display: 'block' }}>
                      {selectedApp.job || selectedApp.jobTitle || matchedJob?.title || 'Job Position'}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                      {selectedApp.company}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <Building2 size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Recruiter Lead:</strong> {selectedApp.recruiter || matchedJob?.recruiter || 'Talent Acquisition Team'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <MapPin size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Job Location:</strong> {matchedJob?.location || selectedApp.location || 'Bengaluru, Karnataka'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <Briefcase size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Employment Type:</strong> {matchedJob?.type || matchedJob?.employmentType || selectedApp.type || 'Full-time'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <Clock size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Experience Req:</strong> {matchedJob?.experience || '3-5 years'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
                    <DollarSign size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <span><strong>Salary Range:</strong> {matchedJob?.salary || selectedApp.salary || '₹16,00,000 - ₹24,00,000 / year'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Job Status:</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: '#ecfdf5',
                      color: '#047857',
                      border: '1px solid #a7f3d0'
                    }}>
                      {matchedJob?.status || 'ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 5: Application Timeline ── */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)'
            }}>
              <h4 style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.05em',
                marginBottom: 'var(--space-3)'
              }}>
                Application Stage Progression Timeline
              </h4>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-2)',
                overflowX: 'auto',
                padding: 'var(--space-2) 0'
              }}>
                {timelineStages.map((stage, idx) => {
                  const isCurrent = stage.key === currentStatusKey;
                  const isPassed = !isRejected && stageIndex > idx;

                  return (
                    <div key={stage.key} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: '1 1 0',
                      minWidth: 90,
                      position: 'relative'
                    }}>
                      {/* Node Dot */}
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '12px',
                        background: isCurrent
                          ? (isRejected ? '#ef4444' : 'var(--color-primary-600)')
                          : isPassed
                            ? '#10b981'
                            : 'var(--color-gray-100)',
                        color: (isCurrent || isPassed) ? '#fff' : 'var(--color-text-muted)',
                        border: isCurrent
                          ? `3px solid ${isRejected ? '#fee2e2' : '#e0e7ff'}`
                          : isPassed
                            ? '2px solid #a7f3d0'
                            : '1px solid var(--color-border)',
                        boxShadow: isCurrent ? '0 0 0 2px var(--color-primary-600)' : 'none',
                        zIndex: 2,
                        transition: 'all 150ms ease'
                      }}>
                        {isPassed ? <CheckCircle2 size={16} /> : (idx + 1)}
                      </div>

                      {/* Stage Label */}
                      <span style={{
                        fontSize: '11px',
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? 'var(--color-text)' : 'var(--color-text-muted)',
                        marginTop: 6,
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                      }}>
                        {stage.label}
                      </span>

                      {/* Current Stage Tag */}
                      {isCurrent && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-full)',
                          background: isRejected ? '#fef2f2' : '#eef2ff',
                          color: isRejected ? '#b91c1c' : '#4338ca',
                          border: isRejected ? '1px solid #fecaca' : '1px solid #c7d2fe',
                          marginTop: 3,
                          whiteSpace: 'nowrap'
                        }}>
                          Current Stage
                        </span>
                      )}

                      {stage.key === 'APPLIED' && selectedApp.appliedDate && !isCurrent && (
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {new Date(selectedApp.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Section 6: Resume / Documents ── */}
            <div style={{
              background: 'var(--color-gray-50)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)'
            }}>
              <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                Resume / Documents
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
                  <span>No resume document attached to this application record.</span>
                </div>
              )}
            </div>

            {/* ── Section 7: Application Notes (Only if notes data exists) ── */}
            {(selectedApp.notes || selectedApp.recruiterNotes || selectedApp.adminNotes || selectedApp.coverNote) && (
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
                  Application Notes & Cover Remarks
                </h4>

                {(selectedApp.coverNote || selectedApp.notes) && (
                  <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary-700)', display: 'block', textTransform: 'uppercase' }}>
                      Candidate / Recruiter Visible Note
                    </span>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                      {selectedApp.coverNote || selectedApp.notes}
                    </p>
                  </div>
                )}

                {selectedApp.adminNotes && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#b45309', display: 'block', textTransform: 'uppercase' }}>
                      Admin / Internal Audit Note
                    </span>
                    <p style={{ fontSize: 'var(--text-xs)', color: '#92400e', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                      {selectedApp.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Section 8: Audit Information ── */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
              fontSize: '11px',
              color: 'var(--color-text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} style={{ color: '#047857' }} />
                <span><strong>Audit ID:</strong> {selectedApp.id}</span>
                <span>•</span>
                <span><strong>Logged:</strong> {selectedApp.appliedDate || '20 Aug 2026'}</span>
                <span>•</span>
                <span><strong>Status:</strong> {selectedApp.status || 'APPLIED'}</span>
              </div>
              <div>
                <span><strong>Authority:</strong> {selectedApp.recruiter || matchedJob?.recruiter || 'HR Lead'} • {selectedApp.company}</span>
              </div>
            </div>

            {/* ── Section 9 & 10: Actions & Export Application Record ── */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              borderTop: '1px solid var(--color-border)',
              paddingTop: 'var(--space-4)',
              marginTop: 'var(--space-2)'
            }}>
              {/* Left: Export Application Record */}
              <div>
                <ExportDropdown
                  label="Export Application Record"
                  size="sm"
                  align="left"
                  items={[
                    {
                      label: 'Export PDF',
                      icon: <FileText size={15} style={{ color: '#dc2626' }} />,
                      onClick: handleExportSingleAppPdf
                    },
                    {
                      label: 'Export CSV',
                      icon: <FileSpreadsheet size={15} style={{ color: '#0284c7' }} />,
                      onClick: handleExportSingleAppCsv
                    },
                    {
                      label: 'Export Excel',
                      icon: <FileSpreadsheet size={15} style={{ color: '#16a34a' }} />,
                      onClick: handleExportSingleAppExcel
                    }
                  ]}
                />
              </div>

              {/* Right: View Profile & Close */}
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
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
                  onClick={() => setModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── 2. Candidate Full Profile Modal (Launched from Application Audit) ── */}
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
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Education:</strong> {activeCandProfile.education || 'B.Tech Computer Science'}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Experience:</strong> {activeCandProfile.experience}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Applications:</strong> {activeCandProfile.applicationsCount || 1} Submitted</p>
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

