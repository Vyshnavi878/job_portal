import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CalendarDays, MapPin, Clock, Building2, QrCode, Download,
  CheckCircle2, ArrowRight, Sparkles, ExternalLink, Ticket, Users, X,
  Briefcase, FileText, Check, Send, User, Mail, Phone, ShieldCheck,
  ChevronRight, ArrowLeft, Search, Filter, DollarSign, Award, Layers,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../context/ToastContext';
import { useCandidate } from '../../context/CandidateContext';
import { useNotifications } from '../../context/NotificationContext';
import { dispatchCandidateEvent, NOTIFICATION_EVENTS } from '../../services/notificationEventService';
import { MOCK_JOB_MELAS } from '../../data/mockData';
import ApplicationDetailsModal from '../../components/ui/ApplicationDetailsModal';
import { formatMelaId, formatJobId, formatRegistrationId } from '../../utils/applicationUtils';

export default function CandidateJobMelaPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { candidate, updateCandidate, isLoggedIn } = useCandidate();
  const { addNotification } = useNotifications();

  // Navigation state: null = Browse/Main Listing, object = Specific Job Mela Details
  const [selectedMela, setSelectedMela] = useState(null);

  // Status Filter for Melas Listing: 'ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'
  const [melaStatusFilter, setMelaStatusFilter] = useState('ALL');
  const [melaSearch, setMelaSearch] = useState('');

  // Participating Companies Search & Pagination for Details view
  const [companySearch, setCompanySearch] = useState('');
  const [companySectorFilter, setCompanySectorFilter] = useState('ALL');
  const [companyPage, setCompanyPage] = useState(1);
  const COMPANIES_PER_PAGE = 10;

  // Registered Event Passes
  const [registeredEvents, setRegisteredEvents] = useState([
    {
      ...MOCK_JOB_MELAS[0],
      passId: 'PASS-AP-849201',
      registeredOn: '21 Aug 2026',
      gateNumber: 'Gate 3 (Priority Fast-Track)',
      entryQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=JOBMELA-PASS',
    },
  ]);

  // Track company-specific applications submitted by candidate
  const [appliedCompanyJobs, setAppliedCompanyJobs] = useState([
    {
      melaId: '1',
      companyName: 'TechCorp India',
      role: 'Graduate Trainee Engineer',
      appliedAt: '22 Aug 2026',
      appId: 'NTR-01-02-0024'
    }
  ]);

  // Application Details Modal State
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);
  const [appDetailsModalOpen, setAppDetailsModalOpen] = useState(false);

  // Modals state
  const [selectedPass, setSelectedPass] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);

  // Event Registration Modal
  const [selectedMelaForReg, setSelectedMelaForReg] = useState(null);
  const [eventRegModalOpen, setEventRegModalOpen] = useState(false);
  const [eventRegForm, setEventRegForm] = useState({
    name: candidate.name || 'Vyshnavi Reddy',
    email: candidate.email || 'vyshnavi.reddy@example.com',
    phone: candidate.phone || '+91 98765 43210',
    location: 'Hyderabad / Vijayawada',
    resume: 'Vyshnavi_Reddy_Resume_2026.pdf',
    timeSlot: 'Morning Session (09:00 AM - 01:00 PM)',
  });

  // Company-Specific Application Modal
  const [selectedCompanyJob, setSelectedCompanyJob] = useState(null);
  const [companyApplyModalOpen, setCompanyApplyModalOpen] = useState(false);
  const [companyApplyForm, setCompanyApplyForm] = useState({
    name: candidate.name || 'Vyshnavi Reddy',
    email: candidate.email || 'vyshnavi.reddy@example.com',
    phone: candidate.phone || '+91 98765 43210',
    resume: 'Vyshnavi_Reddy_Resume_2026.pdf',
    skills: 'React, JavaScript, TypeScript, Python, SQL',
    experience: '2+ Years Experience',
    education: 'B.Tech in Computer Science & Engineering',
    coverNote: 'I am excited to apply for this walk-in opportunity and meet your technical team at the Job Mela.',
  });

  // Success Confirmation Modal
  const [submittedAppInfo, setSubmittedAppInfo] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Reset company page when search / filter changes
  useEffect(() => {
    setCompanyPage(1);
  }, [companySearch, companySectorFilter, selectedMela]);

  // Status Tabs Counts
  const melaTabs = useMemo(() => {
    return [
      { key: 'ALL', label: 'All', count: MOCK_JOB_MELAS.length },
      { key: 'UPCOMING', label: 'Upcoming', count: MOCK_JOB_MELAS.filter(m => m.status === 'UPCOMING' || m.status === 'REGISTRATION_OPEN').length },
      { key: 'ONGOING', label: 'Ongoing', count: MOCK_JOB_MELAS.filter(m => m.status === 'ONGOING' || m.status === 'ACTIVE').length },
      { key: 'COMPLETED', label: 'Completed', count: MOCK_JOB_MELAS.filter(m => m.status === 'COMPLETED' || m.status === 'CONCLUDED').length },
    ];
  }, []);

  // Filtered Job Melas for Listing
  const filteredMelas = useMemo(() => {
    return MOCK_JOB_MELAS.filter(m => {
      if (melaSearch.trim()) {
        const q = melaSearch.toLowerCase();
        const matchTitle = m.title?.toLowerCase().includes(q);
        const matchCity = m.city?.toLowerCase().includes(q);
        const matchVenue = m.venue?.toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchVenue) return false;
      }
      if (melaStatusFilter === 'UPCOMING') {
        return m.status === 'UPCOMING' || m.status === 'REGISTRATION_OPEN';
      }
      if (melaStatusFilter === 'ONGOING') {
        return m.status === 'ONGOING' || m.status === 'ACTIVE';
      }
      if (melaStatusFilter === 'COMPLETED') {
        return m.status === 'COMPLETED' || m.status === 'CONCLUDED';
      }
      return true;
    });
  }, [melaSearch, melaStatusFilter]);

  // Browse listing pagination: 9 per page (3 columns × 3 rows)
  const MELAS_PER_PAGE = 9;
  const [melaPage, setMelaPage] = useState(1);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setMelaPage(1);
  }, [melaSearch, melaStatusFilter]);

  const totalMelaPages = Math.max(1, Math.ceil(filteredMelas.length / MELAS_PER_PAGE));
  const paginatedMelas = useMemo(() => {
    const start = (melaPage - 1) * MELAS_PER_PAGE;
    return filteredMelas.slice(start, start + MELAS_PER_PAGE);
  }, [filteredMelas, melaPage]);

  // Derive rich participating companies list for the selected Job Mela
  const selectedMelaCompanies = useMemo(() => {
    if (!selectedMela) return [];
    
    // Check if availableJobs exist
    if (selectedMela.availableJobs && selectedMela.availableJobs.length > 0) {
      return selectedMela.availableJobs.map((j, idx) => ({
        id: `${selectedMela.id}-job-${idx}`,
        company: j.company,
        role: j.title,
        salary: j.salary || '₹4.5 - ₹8.0 LPA',
        location: selectedMela.city,
        vacancies: j.vacancies ? `${j.vacancies} Spots` : 'Multiple Openings',
        type: 'Full-time (Walk-in)',
        sector: idx % 2 === 0 ? 'Information Technology' : 'Engineering & Product',
      }));
    }

    if (selectedMela.participatingCompanies && selectedMela.participatingCompanies.length > 0) {
      return selectedMela.participatingCompanies.flatMap((c, cIdx) => 
        (c.roles || ['Software Engineer', 'Technical Associate']).map((role, rIdx) => ({
          id: `${selectedMela.id}-c-${cIdx}-${rIdx}`,
          company: c.name,
          role: role,
          salary: '₹4.0 - ₹7.5 LPA',
          location: selectedMela.city,
          vacancies: c.openJobs || 'Walk-in Openings',
          type: 'Full-time',
          sector: cIdx % 2 === 0 ? 'Information Technology' : 'Digital Services',
        }))
      );
    }

    // Default structured company jobs for demo presentation
    return [
      { id: `${selectedMela.id}-1`, company: 'TechCorp India', role: 'Graduate Trainee Engineer', salary: '₹5.0 - ₹8.0 LPA', location: selectedMela.city, vacancies: '25 Spots', type: 'Full-time', sector: 'Information Technology' },
      { id: `${selectedMela.id}-2`, company: 'ABC Technologies Pvt Ltd', role: 'Frontend Developer', salary: '₹8 - ₹14 LPA', location: selectedMela.city, vacancies: '15 Spots', type: 'Full-time', sector: 'Information Technology' },
      { id: `${selectedMela.id}-3`, company: 'Infosys Digital', role: 'Data Analyst', salary: '₹6 - ₹10 LPA', location: selectedMela.city, vacancies: '40 Spots', type: 'Full-time', sector: 'Digital Services' },
      { id: `${selectedMela.id}-4`, company: 'Flipkart Logistics', role: 'Catalog Operations Specialist', salary: '₹4.5 - ₹6.5 LPA', location: selectedMela.city, vacancies: '30 Spots', type: 'Full-time', sector: 'E-Commerce' },
      { id: `${selectedMela.id}-5`, company: 'TCS Digital', role: 'Systems Software Engineer', salary: '₹7.0 - ₹9.5 LPA', location: selectedMela.city, vacancies: '50 Spots', type: 'Full-time', sector: 'Information Technology' },
      { id: `${selectedMela.id}-6`, company: 'Razorpay Payments', role: 'Customer Success Specialist', salary: '₹5.0 - ₹7.0 LPA', location: selectedMela.city, vacancies: '20 Spots', type: 'Full-time', sector: 'Fintech' },
      { id: `${selectedMela.id}-7`, company: 'Wipro Cloud Services', role: 'Cloud Infrastructure Associate', salary: '₹5.5 - ₹8.0 LPA', location: selectedMela.city, vacancies: '35 Spots', type: 'Full-time', sector: 'Information Technology' },
      { id: `${selectedMela.id}-8`, company: 'Swiggy Operations', role: 'City Operations Associate', salary: '₹4.0 - ₹5.5 LPA', location: selectedMela.city, vacancies: '25 Spots', type: 'Full-time', sector: 'Operations' },
      { id: `${selectedMela.id}-9`, company: 'L&T Infotech', role: 'Embedded Systems Developer', salary: '₹6.5 - ₹9.0 LPA', location: selectedMela.city, vacancies: '18 Spots', type: 'Full-time', sector: 'Engineering & Product' },
      { id: `${selectedMela.id}-10`, company: 'Cognizant Technology Solutions', role: 'Quality Assurance Tester', salary: '₹4.5 - ₹6.5 LPA', location: selectedMela.city, vacancies: '45 Spots', type: 'Full-time', sector: 'Information Technology' },
      { id: `${selectedMela.id}-11`, company: 'HCL Technologies', role: 'Network Security Associate', salary: '₹5.0 - ₹7.5 LPA', location: selectedMela.city, vacancies: '20 Spots', type: 'Full-time', sector: 'Information Technology' },
      { id: `${selectedMela.id}-12`, company: 'Capgemini India', role: 'Full Stack Java Engineer', salary: '₹7.5 - ₹11.0 LPA', location: selectedMela.city, vacancies: '30 Spots', type: 'Full-time', sector: 'Information Technology' },
    ];
  }, [selectedMela]);

  // Filtered participating companies based on search and sector
  const filteredCompanies = useMemo(() => {
    return selectedMelaCompanies.filter(c => {
      if (companySearch.trim()) {
        const q = companySearch.toLowerCase();
        const matchComp = c.company.toLowerCase().includes(q);
        const matchRole = c.role.toLowerCase().includes(q);
        const matchLoc = c.location?.toLowerCase().includes(q);
        if (!matchComp && !matchRole && !matchLoc) return false;
      }
      if (companySectorFilter !== 'ALL' && c.sector !== companySectorFilter) {
        return false;
      }
      return true;
    });
  }, [selectedMelaCompanies, companySearch, companySectorFilter]);

  // Paginated companies (10 per page)
  const totalCompanyPages = Math.max(1, Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE));
  const paginatedCompanies = useMemo(() => {
    const validPage = Math.min(Math.max(1, companyPage), totalCompanyPages);
    const start = (validPage - 1) * COMPANIES_PER_PAGE;
    return filteredCompanies.slice(start, start + COMPANIES_PER_PAGE);
  }, [filteredCompanies, companyPage, totalCompanyPages]);

  // Digital Pass Handlers
  const handleOpenPass = (event) => {
    setSelectedPass(event);
    setPassModalOpen(true);
  };

  const handleDownloadPass = () => {
    toast({
      type: 'success',
      title: 'Pass Downloaded',
      message: 'Your Digital QR Entry Pass has been downloaded as PDF.',
    });
  };

  // Event Registration Handlers
  const handleOpenEventRegistration = (mela) => {
    if (!isLoggedIn) {
      navigate('/login', {
        state: {
          redirectTo: `/candidate/job-mela?melaId=${mela.id}&register=true`,
          melaId: mela.id,
          jobTitle: `Entry Pass for ${mela.title}`
        }
      });
      return;
    }
    if (registeredEvents.some(e => e.id === mela.id)) {
      toast({ type: 'info', title: 'Already Registered', message: 'You already have an active entry pass for this event.' });
      return;
    }
    setSelectedMelaForReg(mela);
    setEventRegForm({
      name: candidate.name || 'Vyshnavi Reddy',
      email: candidate.email || 'vyshnavi.reddy@example.com',
      phone: candidate.phone || '+91 98765 43210',
      location: mela.city || 'Andhra Pradesh',
      resume: 'Vyshnavi_Reddy_Resume_2026.pdf',
      timeSlot: 'Morning Session (09:00 AM - 01:00 PM)',
    });
    setEventRegModalOpen(true);
  };

  const handleConfirmEventRegistration = (e) => {
    e.preventDefault();
    if (!selectedMelaForReg) return;

    const newPass = {
      ...selectedMelaForReg,
      passId: `PASS-AP-${Math.floor(100000 + Math.random() * 900000)}`,
      registeredOn: 'Today',
      gateNumber: 'Gate 2 (General Fast-Track)',
      entryQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=JOBMELA-PASS',
    };

    setRegisteredEvents([newPass, ...registeredEvents]);
    setEventRegModalOpen(false);
    setSelectedPass(newPass);
    setPassModalOpen(true);

    // Dispatch real-time candidate notification event
    dispatchCandidateEvent({
      eventType: NOTIFICATION_EVENTS.JOB_MELA_REGISTERED,
      candidateEmail: candidate.email,
      recipientName: candidate.name,
      addNotification,
      notification: {
        category: 'JOB_MELA',
        title: `Job Mela Pass Confirmed: ${newPass.passId}`,
        message: `Your Fast-Track QR pass (${newPass.passId}) is confirmed for ${selectedMelaForReg.title}. Event Date: ${selectedMelaForReg.date || '28 Sept 2026'}. Venue: ${selectedMelaForReg.venue || selectedMelaForReg.city}. Gate: ${newPass.gateNumber}.`,
        time: 'Just now',
        link: '/candidate/job-melas',
        meta: {
          passId: newPass.passId,
          melaTitle: selectedMelaForReg.title,
          date: selectedMelaForReg.date,
          venue: selectedMelaForReg.venue || selectedMelaForReg.city,
        }
      },
      meta: {
        passId: newPass.passId,
        melaTitle: selectedMelaForReg.title,
      }
    });

    toast({
      type: 'success',
      title: 'Registration Confirmed! 🎉',
      message: `Your fast-track entry pass for ${selectedMelaForReg.title} is ready.`,
    });
  };

  // Company-Specific Apply Handlers
  const handleOpenCompanyApply = (mela, companyName, role, salary, location) => {
    if (!isLoggedIn) {
      navigate('/login', {
        state: {
          redirectTo: `/candidate/job-melas?melaId=${mela.id}&company=${encodeURIComponent(companyName)}&role=${encodeURIComponent(role || '')}&salary=${encodeURIComponent(salary || '')}&loc=${encodeURIComponent(location || '')}&apply=true`,
          melaId: mela.id,
          companyName,
          role,
          jobTitle: `${role || 'Walk-in Role'} at ${companyName}`
        }
      });
      return;
    }

    const compJob = {
      melaId: mela.id,
      melaTitle: mela.title,
      companyName: companyName,
      role: role || 'Software Developer',
      salary: salary || '₹5.0 - ₹8.0 LPA',
      location: location || mela.city,
    };

    setSelectedCompanyJob(compJob);
    setCompanyApplyForm({
      name: candidate.name || 'Vyshnavi Reddy',
      email: candidate.email || 'vyshnavi.reddy@example.com',
      phone: candidate.phone || '+91 98765 43210',
      resume: 'Vyshnavi_Reddy_Resume_2026.pdf',
      skills: 'React, JavaScript, TypeScript, Python, SQL',
      experience: '2+ Years Experience',
      education: 'B.Tech in Computer Science & Engineering',
      coverNote: `I am interested in interviewing for the ${role} position at ${companyName} during the ${mela.title}.`,
    });
    setCompanyApplyModalOpen(true);
  };

  // If user returned from login with ?apply=true or ?register=true
  useEffect(() => {
    const shouldApply = searchParams.get('apply') === 'true';
    const shouldRegister = searchParams.get('register') === 'true';
    const melaId = searchParams.get('melaId');
    const company = searchParams.get('company');
    const role = searchParams.get('role');
    const salary = searchParams.get('salary');
    const loc = searchParams.get('loc');

    if (shouldApply && melaId && company && isLoggedIn) {
      const targetMela = MOCK_JOB_MELAS.find(m => String(m.id) === String(melaId));
      if (targetMela) {
        setSelectedMela(targetMela);
        handleOpenCompanyApply(targetMela, company, role, salary, loc);
        setSearchParams({}, { replace: true });
      }
    } else if (shouldRegister && melaId && isLoggedIn) {
      const targetMela = MOCK_JOB_MELAS.find(m => String(m.id) === String(melaId));
      if (targetMela) {
        setSelectedMela(targetMela);
        handleOpenEventRegistration(targetMela);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, isLoggedIn]);

  // Generate NTR-{EVENT_NO}-{COMPANY_NO}-{APPLICATION_NO} format
  // EVENT_NO   = 1-based index of mela in MOCK_JOB_MELAS list
  // COMPANY_NO = 1-based index of company in that mela's derived companies list
  // APP_NO     = count of existing applications to same company in same mela + 1
  const generateNtrAppId = (melaId, companyName, currentAppliedCompanyJobs) => {
    // Derive event number from position in MOCK_JOB_MELAS
    const melaIdx = MOCK_JOB_MELAS.findIndex(m => String(m.id) === String(melaId));
    const eventNo = String(Math.max(1, melaIdx + 1)).padStart(2, '0');

    // Derive company number: unique companies for this mela in submission order
    const melaApps = currentAppliedCompanyJobs.filter(a => String(a.melaId) === String(melaId));
    const uniqueCompanies = [];
    melaApps.forEach(a => {
      if (!uniqueCompanies.includes(a.companyName.toLowerCase())) {
        uniqueCompanies.push(a.companyName.toLowerCase());
      }
    });
    const existingIdx = uniqueCompanies.indexOf(companyName.toLowerCase());
    // If company not yet seen, it will be the next slot
    const companyNo = String(existingIdx >= 0 ? existingIdx + 1 : uniqueCompanies.length + 1).padStart(2, '0');

    // Derive application number: how many applications to this company in this mela already exist
    const existingCount = currentAppliedCompanyJobs.filter(
      a => String(a.melaId) === String(melaId) && a.companyName.toLowerCase() === companyName.toLowerCase()
    ).length;
    const appNo = String(existingCount + 1).padStart(4, '0');

    return `NTR-${eventNo}-${companyNo}-${appNo}`;
  };

  const getAppliedCompanyApp = (melaId, companyName, role) => {
    const fromCandidate = candidate.applications?.find(
      a => Boolean(a.melaId) &&
           String(a.melaId) === String(melaId) &&
           a.applicationType === 'Job Mela Application' &&
           a.company?.toLowerCase() === companyName?.toLowerCase() &&
           (!role || a.title?.toLowerCase() === role?.toLowerCase() || (a.role && a.role.toLowerCase() === role?.toLowerCase()))
    );
    if (fromCandidate) return fromCandidate;

    const fromLocal = appliedCompanyJobs.find(
      a => String(a.melaId) === String(melaId) &&
           a.companyName?.toLowerCase() === companyName?.toLowerCase()
    );
    if (fromLocal) {
      const matchingPass = registeredEvents.find(e => String(e.id) === String(melaId));
      return {
        ...fromLocal,
        id: `mela-app-${fromLocal.melaId}-${fromLocal.companyName}`,
        title: fromLocal.role,
        company: fromLocal.companyName,
        appNumber: fromLocal.appId,
        applicationType: 'Job Mela Application',
        appliedDate: fromLocal.appliedAt,
        status: 'SHORTLISTED',
        melaTitle: selectedMela?.title || 'AP Mega IT & ITES Job Mela 2026',
        eventNumber: '01',
        companySequence: '02',
        applicationSequence: '0024',
        melaDate: selectedMela?.date || '28 Sept 2026',
        melaVenue: selectedMela?.venue || 'AU Convention Center, Beach Road, Visakhapatnam',
        passId: matchingPass?.passId || 'PASS-AP-849201',
        passStatus: matchingPass ? 'Confirmed / Active Pass (Gate 3)' : null,
        salary: '₹5.0 - ₹8.0 LPA',
        location: selectedMela?.city || 'Visakhapatnam',
        type: 'Full-time',
        mode: 'On-site',
        timeline: [
          { stage: 'Applied', date: fromLocal.appliedAt, completed: true, current: false },
          { stage: 'Screening', date: 'In Progress', completed: true, current: false },
          { stage: 'Shortlisted', date: 'Shortlisted for Spot Interview', completed: true, current: true },
          { stage: 'Interview', date: 'Spot Interview at Event (28 Sept)', completed: false, current: false },
          { stage: 'Selected', date: 'TBD', completed: false, current: false },
        ]
      };
    }
    return null;
  };

  const handleSubmitCompanyApplication = (e) => {
    e.preventDefault();
    if (!selectedCompanyJob) return;

    const completion = candidate?.profileCompletion ?? 0;
    if (completion < 70) {
      toast({
        type: 'error',
        title: 'Profile Incomplete',
        message: `Your profile is currently ${completion}% complete. Please complete at least 70% of your profile before applying for jobs.`,
      });
      return;
    }

    // Compute NTR app ID using current appliedCompanyJobs state before the update
    const ntrAppId = generateNtrAppId(
      selectedCompanyJob.melaId,
      selectedCompanyJob.companyName,
      appliedCompanyJobs
    );

    const newApplication = {
      melaId: selectedCompanyJob.melaId,
      melaTitle: selectedCompanyJob.melaTitle,
      companyName: selectedCompanyJob.companyName,
      role: selectedCompanyJob.role,
      appliedAt: 'Today',
      appId: ntrAppId
    };

    setAppliedCompanyJobs(prev => [
      ...prev.filter(a => !(a.melaId === newApplication.melaId && a.companyName === newApplication.companyName && a.role === newApplication.role)),
      newApplication
    ]);

    const matchingPass = registeredEvents.find(e => String(e.id) === String(selectedCompanyJob.melaId));
    const parts = ntrAppId.split('-');
    const eventNumber = parts[1] || '01';
    const companySequence = parts[2] || '02';
    const applicationSequence = parts[3] || '0024';

    const candidateApp = {
      id: `app-mela-${Date.now()}`,
      jobId: `mela-${selectedCompanyJob.melaId}-${selectedCompanyJob.companyName}`,
      melaId: selectedCompanyJob.melaId,
      melaTitle: selectedCompanyJob.melaTitle,
      eventNumber,
      companySequence,
      applicationSequence,
      appNumber: ntrAppId,
      applicationType: 'Job Mela Application',
      title: selectedCompanyJob.role,
      company: selectedCompanyJob.companyName,
      companyLogo: null,
      location: selectedCompanyJob.location || selectedMela?.city || 'Andhra Pradesh',
      salary: selectedCompanyJob.salary || '₹5.0 - ₹8.0 LPA',
      type: 'Full-time',
      mode: 'On-site',
      appliedDate: 'Today',
      status: 'APPLIED',
      melaDate: selectedMela?.date || 'Upcoming',
      melaVenue: selectedMela?.venue || 'Event Venue',
      passId: matchingPass?.passId || null,
      passStatus: matchingPass ? 'Confirmed / Active Pass' : null,
      timeline: [
        { stage: 'Applied', date: 'Today (Just now)', completed: true, current: true },
        { stage: 'Screening', date: 'Pending Review', completed: false, current: false },
        { stage: 'Shortlisted', date: 'Pending', completed: false, current: false },
        { stage: 'Interview', date: 'Spot Interview at Event', completed: false, current: false },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    };

    if (updateCandidate) {
      updateCandidate(prev => ({
        ...prev,
        applications: [candidateApp, ...prev.applications.filter(a => a.appNumber !== ntrAppId)]
      }));
    }

    // Dispatch real-time candidate notification event
    dispatchCandidateEvent({
      eventType: NOTIFICATION_EVENTS.JOB_MELA_APP_SUBMITTED,
      candidateEmail: candidate.email,
      recipientName: candidate.name,
      addNotification,
      notification: {
        category: 'JOB_MELA',
        title: `Job Mela Application: ${selectedCompanyJob.role}`,
        message: `Application submitted to ${selectedCompanyJob.companyName} for "${selectedCompanyJob.role}" at ${selectedCompanyJob.melaTitle || 'Job Mela'}. Job Mela Application No: ${ntrAppId}. Status: Applied.`,
        time: 'Just now',
        link: '/candidate/applications',
        meta: {
          appNumber: ntrAppId,
          company: selectedCompanyJob.companyName,
          role: selectedCompanyJob.role,
          melaTitle: selectedCompanyJob.melaTitle,
          status: 'Applied',
          applicationType: 'Job Mela Application',
        }
      },
      meta: {
        appNumber: ntrAppId,
        company: selectedCompanyJob.companyName,
        role: selectedCompanyJob.role,
        status: 'Applied',
      }
    });

    setCompanyApplyModalOpen(false);
    setSubmittedAppInfo(newApplication);
    setSuccessModalOpen(true);

    toast({
      type: 'success',
      title: 'Application Submitted!',
      message: `Submitted application to ${newApplication.companyName} for ${newApplication.role}.`,
    });
  };

  const isCompanyJobApplied = (melaId, companyName, role) => {
    // 1. Check candidate.applications first (primary single source of truth for Job Mela applications)
    const inCandidate = candidate.applications?.some(
      a => Boolean(a.melaId) &&
           String(a.melaId) === String(melaId) &&
           a.applicationType === 'Job Mela Application' &&
           a.company?.toLowerCase() === companyName?.toLowerCase() &&
           (!role || a.title?.toLowerCase() === role?.toLowerCase() || (a.role && a.role.toLowerCase() === role?.toLowerCase()))
    );
    if (inCandidate) return true;

    // 2. Check local state
    return appliedCompanyJobs.some(
      a => Boolean(a.melaId) &&
           String(a.melaId) === String(melaId) &&
           a.companyName?.toLowerCase() === companyName?.toLowerCase() &&
           (!role || a.role?.toLowerCase() === role?.toLowerCase())
    );
  };

  const isEventRegistered = (melaId) => {
    return registeredEvents.some(e => String(e.id) === String(melaId));
  };

  // Scroll to Browse All Job Melas
  const handleScrollToBrowse = () => {
    const el = document.getElementById('browse-job-melas-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="candidate-job-mela-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── TOP HERO / BANNER ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <CalendarDays size={22} style={{ color: '#c7d2fe' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#ffffff' }}>Mega Job Melas & Walk-in Drives</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: '#cbd5e1' }}>
              Free fast-track entry passes, digital QR check-in badges, and direct spot interviews for {candidate.name}
            </p>
          </div>

          {!selectedMela && (
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ArrowRight size={14} />}
              onClick={handleScrollToBrowse}
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Browse All Job Melas
            </Button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          VIEW LEVEL 2: SPECIFIC JOB MELA DETAILS VIEW
         ══════════════════════════════════════════════════════════════ */}
      {selectedMela ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Breadcrumb Back button */}
          <div>
            <button
              type="button"
              onClick={() => {
                setSelectedMela(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-600)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 0'
              }}
            >
              <ArrowLeft size={16} /> Back to All Job Melas
            </button>
          </div>

          {/* Specific Job Mela Header Details Card */}
          <div
            className="card"
            style={{
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '11px',
                    color: '#7c3aed',
                    background: '#f5f3ff',
                    border: '1px solid #ddd6fe',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    {formatMelaId(selectedMela.id)}
                  </span>
                  <span className="badge badge-primary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                    {selectedMela.status || 'Upcoming'}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Location: <strong>{selectedMela.city}, {selectedMela.state || 'Andhra Pradesh'}</strong>
                  </span>
                </div>

                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
                  {selectedMela.title}
                </h2>

                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: 760, lineHeight: 1.5 }}>
                  {selectedMela.description || 'Premier recruitment drive featuring leading IT, Fintech, and product organizations. Candidates can participate in fast-track spot interviews and technical evaluations.'}
                </p>
              </div>

              {/* Event Registration Status / Action */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                {isEventRegistered(selectedMela.id) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span className="badge badge-success" style={{ fontSize: '11px', padding: '6px 12px' }}>
                      <CheckCircle2 size={13} style={{ marginRight: 4 }} /> Registration Confirmed
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Ticket size={14} />}
                      onClick={() => handleOpenPass(registeredEvents.find(e => String(e.id) === String(selectedMela.id)) || selectedMela)}
                    >
                      View Digital QR Pass
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Ticket size={16} />}
                    onClick={() => handleOpenEventRegistration(selectedMela)}
                  >
                    Register for Job Mela
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Metadata Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'var(--space-4)',
              background: 'var(--color-bg)',
              padding: 'var(--space-4) var(--space-5)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Date & Timings</span>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{selectedMela.date}</strong>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{selectedMela.time || '09:00 AM - 05:30 PM'}</p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Venue</span>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{selectedMela.venue}</strong>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{selectedMela.city}</p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Participating Employers</span>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)' }}>{selectedMela.companiesCount || selectedMela.companies || '45+'} Companies</strong>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Multi-sector hiring</p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Opportunities</span>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-600)' }}>{selectedMela.totalOpportunities || '1,200+ Openings'}</strong>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Spot offer letters</p>
              </div>
            </div>
          </div>

          {/* ── Section: Participating Companies & Walk-in Openings ── */}
          <div
            className="card"
            style={{
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-5)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                <Building2 size={20} style={{ color: 'var(--color-primary-600)' }} />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
                  Participating Companies & Walk-in Openings ({filteredCompanies.length})
                </h3>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Event registration grants venue entry. Apply separately to participating companies for available roles.
              </p>
            </div>

            {/* Search & Filter Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div style={{ flex: 1, minWidth: 260, maxWidth: 440 }}>
                <div className="input-wrapper">
                  <span className="input-icon-left"><Search size={15} style={{ color: 'var(--color-primary-600)' }} /></span>
                  <input
                    className="input has-icon-left"
                    placeholder="Search participating companies by name or role..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Sector Filters */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['ALL', 'Information Technology', 'Digital Services', 'Engineering & Product'].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setCompanySectorFilter(sec)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: companySectorFilter === sec ? '1.5px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                      background: companySectorFilter === sec ? 'var(--color-primary-50)' : 'var(--color-surface)',
                      color: companySectorFilter === sec ? 'var(--color-primary-700)' : 'var(--color-text-muted)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {sec === 'ALL' ? 'All Companies' : sec}
                  </button>
                ))}
              </div>
            </div>

            {/* 2-Column Responsive Desktop Grid */}
            {filteredCompanies.length === 0 ? (
              <div style={{ padding: 'var(--space-8)' }}>
                <EmptyState
                  icon="default"
                  title="No Companies Found"
                  description="Try adjusting your search keywords or sector filters to discover open roles."
                />
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: 'var(--space-4)'
                }}>
                  {paginatedCompanies.map((comp) => {
                    const isApplied = isCompanyJobApplied(selectedMela.id, comp.company, comp.role);
                    return (
                      <div
                        key={comp.id}
                        className="card card-hoverable"
                        style={{
                          borderRadius: 'var(--radius-xl)',
                          padding: 'var(--space-5)',
                          border: isApplied ? '1.5px solid var(--color-success-300)' : '1px solid var(--color-border)',
                          background: isApplied ? 'var(--color-success-50-alpha, #f0fdf4)' : 'var(--color-surface)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: 'var(--space-4)'
                        }}
                      >
                        <div>
                          {/* Top: Company Logo Avatar + Name + Sector Badge */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                              <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                                color: '#fff',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {comp.company?.[0] || 'C'}
                              </div>

                              <div>
                                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.2 }}>
                                  {comp.company}
                                </h4>
                                <span style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: 700 }}>
                                  {comp.sector || 'Information Technology'}
                                </span>
                              </div>
                            </div>

                            <span className="badge badge-gray" style={{ fontSize: '10px', flexShrink: 0 }}>
                              {comp.location}
                            </span>
                          </div>

                          {/* Role Details */}
                          <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Walk-in Role:</span>
                            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                              {comp.role}
                            </strong>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 4 }}>
                              <span>{comp.salary}</span>
                              <span>•</span>
                              <span>{comp.vacancies}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Action */}
                        {isApplied ? (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            width: '100%',
                            borderTop: '1px solid var(--color-gray-100)',
                            paddingTop: 'var(--space-3)'
                          }}>
                            {(() => {
                              const appliedApp = getAppliedCompanyApp(selectedMela.id, comp.company, comp.role);
                              return (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                                    <span style={{ fontSize: '11px', color: 'var(--color-success-700)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <CheckCircle2 size={13} /> Applied
                                    </span>
                                    <StatusBadge status={appliedApp?.status || 'SHORTLISTED'} />
                                  </div>

                                  <div style={{
                                    fontSize: '11px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    background: 'var(--color-bg)',
                                    padding: '6px 10px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)'
                                  }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ color: 'var(--color-text-muted)' }}>Application No:</span>
                                      <span style={{ fontFamily: 'monospace, monospace', fontWeight: 800, color: 'var(--color-primary-700)' }}>
                                        {appliedApp?.appNumber || appliedApp?.appId || 'NTR-01-02-0024'}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ color: 'var(--color-text-muted)' }}>Application Type:</span>
                                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Job Mela Application</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ color: 'var(--color-text-muted)' }}>Job ID:</span>
                                      <span style={{ fontFamily: 'monospace, monospace', fontWeight: 700, color: 'var(--color-primary-700)' }}>
                                        {formatJobId(appliedApp?.jobId || `mela-${selectedMela.id}-comp-${comp.id || '01'}`)}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ color: 'var(--color-text-muted)' }}>Job Mela ID:</span>
                                      <span style={{ fontFamily: 'monospace, monospace', fontWeight: 700, color: '#7c3aed' }}>
                                        {formatMelaId(selectedMela.id)}
                                      </span>
                                    </div>
                                    {appliedApp?.appliedDate && (
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Applied Date:</span>
                                        <span style={{ color: 'var(--color-text)' }}>{appliedApp.appliedDate}</span>
                                      </div>
                                    )}
                                    {appliedApp?.passId && (
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Pass Ref / Registration ID:</span>
                                        <span style={{ color: 'var(--color-primary-600)', fontWeight: 600, fontFamily: 'monospace, monospace' }}>
                                          {appliedApp.passId}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedAppForDetails(appliedApp);
                                        setAppDetailsModalOpen(true);
                                      }}
                                    >
                                      View Application
                                    </Button>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid var(--color-gray-100)',
                            paddingTop: 'var(--space-3)'
                          }}>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                              Direct Walk-in Slot Available
                            </span>

                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleOpenCompanyApply(selectedMela, comp.company, comp.role, comp.salary, comp.location)}
                            >
                              Apply
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pagination (10 companies per page) */}
                <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    currentPage={companyPage}
                    totalPages={totalCompanyPages}
                    pageSize={COMPANIES_PER_PAGE}
                    onPageChange={(p) => {
                      setCompanyPage(p);
                    }}
                    itemName="participating companies"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
            VIEW LEVEL 1: MAIN CANDIDATE JOB MELAS LISTING VIEW
           ══════════════════════════════════════════════════════════════ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

          {/* ── Section 1: My Registered Event Passes ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <Ticket size={18} style={{ color: 'var(--color-primary-600)' }} />
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
                My Registered Event Passes ({registeredEvents.length})
              </h2>
            </div>

            {registeredEvents.length === 0 ? (
              <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
                <EmptyState
                  icon="default"
                  title="No Registered Job Melas"
                  description="Register for upcoming career fairs below to book your free digital walk-in pass."
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {registeredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="card"
                    style={{
                      borderRadius: 'var(--radius-2xl)',
                      overflow: 'hidden',
                      border: '1px solid var(--color-primary-200)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Top Pass Banner */}
                    <div style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
                      color: '#fff',
                      padding: 'var(--space-4) var(--space-6)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 'var(--space-3)'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '10px',
                            background: 'rgba(255,255,255,0.2)',
                            border: '1px solid rgba(255,255,255,0.35)',
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}>
                            {formatMelaId(event.id)}
                          </span>
                          <span className="badge badge-success" style={{ fontSize: '10px' }}>
                            <CheckCircle2 size={11} style={{ marginRight: 2 }} /> Registration Confirmed
                          </span>
                          <span style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Registration ID: {event.passId}</span>
                        </div>
                        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: '#ffffff' }}>
                          {event.title}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Ticket size={14} />}
                          onClick={() => handleOpenPass(event)}
                          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                        >
                          View Digital QR Pass
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          rightIcon={<ArrowRight size={13} />}
                          onClick={() => {
                            setSelectedMela(event);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          View Details & Apply
                        </Button>
                      </div>
                    </div>

                    {/* Event Compact Details */}
                    <div className="card-body" style={{ padding: 'var(--space-4) var(--space-6)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Date & Timings</span>
                          <strong style={{ fontSize: 'var(--text-xs)' }}>{event.date}</strong>
                          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{event.time}</p>
                        </div>

                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Venue Location</span>
                          <strong style={{ fontSize: 'var(--text-xs)' }}>{event.venue}</strong>
                          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{event.city}, Andhra Pradesh</p>
                        </div>

                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Allocated Entry Point</span>
                          <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)' }}>{event.gateNumber}</strong>
                          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Priority check-in gate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Section 2: Browse All Job Melas ── */}
          <div id="browse-job-melas-section" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                  <CalendarDays size={18} style={{ color: 'var(--color-primary-600)' }} />
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
                    Browse All Job Melas
                  </h2>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Explore scheduled hiring drives, check participating employers, and reserve your free pass.
                </p>
              </div>

              {/* Search Bar */}
              <div style={{ width: '100%', maxWidth: 360 }}>
                <div className="input-wrapper">
                  <span className="input-icon-left"><Search size={15} style={{ color: 'var(--color-primary-600)' }} /></span>
                  <input
                    className="input has-icon-left"
                    placeholder="Search by title, city, venue..."
                    value={melaSearch}
                    onChange={(e) => setMelaSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 2 }}>
              {melaTabs.map((tab) => {
                const active = melaStatusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setMelaStatusFilter(tab.key)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: active ? '1.5px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                      background: active ? 'var(--color-primary-600)' : 'var(--color-surface)',
                      color: active ? '#fff' : 'var(--color-text-muted)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      whiteSpace: 'nowrap',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {tab.label}
                    <span style={{
                      background: active ? 'rgba(255,255,255,0.25)' : 'var(--color-gray-100)',
                      color: active ? '#fff' : 'var(--color-text-muted)',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '10px'
                    }}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Job Melas Grid — 3 columns × 3 rows = 9 per page */}
            {filteredMelas.length === 0 ? (
              <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
                <EmptyState
                  icon="default"
                  title="No Job Melas Found"
                  description="No job melas match your current search and filter criteria."
                />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
                {paginatedMelas.map((mela) => {
                  const isRegistered = isEventRegistered(mela.id);
                  return (
                    <div
                      key={mela.id}
                      className="card card-hoverable"
                      style={{
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--space-6)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              fontSize: '10px',
                              color: '#7c3aed',
                              background: '#f5f3ff',
                              border: '1px solid #ddd6fe',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>
                              {formatMelaId(mela.id)}
                            </span>
                            <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                              {mela.status || 'Registration Open'}
                            </span>
                          </div>

                          {isRegistered && (
                            <span className="badge badge-success" style={{ fontSize: '10px' }}>
                              <CheckCircle2 size={11} style={{ marginRight: 2 }} /> Pass Registered
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.3 }}>
                          {mela.title}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-3) 0' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CalendarDays size={13} /> {mela.date} ({mela.time})</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {mela.venue}, {mela.city}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={13} /> {mela.companiesCount || mela.companies || '45+'} Participating Employers</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={13} /> {mela.totalOpportunities || mela.seats || '1,200+'} Spot Opportunities</span>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--color-gray-100)',
                        paddingTop: 'var(--space-3)'
                      }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-success-700)', fontWeight: 700 }}>
                          Free Entry Pass
                        </span>

                        <Button
                          size="sm"
                          variant="primary"
                          rightIcon={<ArrowRight size={13} />}
                          onClick={() => {
                            setSelectedMela(mela);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Browse listing pagination */}
            {filteredMelas.length > 0 && (
              <Pagination
                currentPage={melaPage}
                totalPages={totalMelaPages}
                totalItems={filteredMelas.length}
                pageSize={MELAS_PER_PAGE}
                onPageChange={(page) => {
                  setMelaPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                itemName="job melas"
              />
            )}
          </div>
        </div>
      )}

      {/* ── Modal 1: Job Mela Event Registration Modal ── */}
      {eventRegModalOpen && selectedMelaForReg && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)'
          }}
          onClick={() => setEventRegModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl)',
              width: '100%', maxWidth: 540,
              maxHeight: '90vh',
              display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: 'var(--space-5) var(--space-6)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--color-bg)'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary-600)', textTransform: 'uppercase' }}>
                  Job Mela Fast-Track Registration
                </span>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{selectedMelaForReg.title}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {selectedMelaForReg.venue}, {selectedMelaForReg.city} • {selectedMelaForReg.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEventRegModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmEventRegistration} style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
              <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-900)', lineHeight: 1.4 }}>
                    ℹ️ <strong>Event Entry Pass:</strong> This registration issues your official digital entry pass for the venue. You will be able to apply to participating companies and book interview slots separately.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Full Name</label>
                  <input
                    className="input"
                    value={eventRegForm.name}
                    onChange={(e) => setEventRegForm({ ...eventRegForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Email Address</label>
                    <input
                      type="email"
                      className="input"
                      value={eventRegForm.email}
                      onChange={(e) => setEventRegForm({ ...eventRegForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Phone Number</label>
                    <input
                      type="tel"
                      className="input"
                      value={eventRegForm.phone}
                      onChange={(e) => setEventRegForm({ ...eventRegForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Preferred Entry Time Slot</label>
                  <select
                    className="input"
                    value={eventRegForm.timeSlot}
                    onChange={(e) => setEventRegForm({ ...eventRegForm, timeSlot: e.target.value })}
                  >
                    <option>Morning Session (09:00 AM - 01:00 PM)</option>
                    <option>Afternoon Session (01:30 PM - 05:30 PM)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Selected Resume</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'var(--space-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <FileText size={18} style={{ color: 'var(--color-primary-600)' }} />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, flex: 1 }}>{eventRegForm.resume}</span>
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>Active Profile Resume</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', background: 'var(--color-bg)' }}>
                <Button type="button" variant="secondary" onClick={() => setEventRegModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" leftIcon={<Ticket size={15} />}>
                  Register for Job Mela
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 2: Company-Specific Job Application Modal ── */}
      {companyApplyModalOpen && selectedCompanyJob && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)'
          }}
          onClick={() => setCompanyApplyModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl)',
              width: '100%', maxWidth: 580,
              maxHeight: '90vh',
              display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: 'var(--space-5) var(--space-6)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--color-bg)'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary-600)', textTransform: 'uppercase' }}>
                  Company-Specific Application
                </span>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
                  Apply to {selectedCompanyJob.companyName}
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Role: <strong>{selectedCompanyJob.role}</strong> • {selectedCompanyJob.melaTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCompanyApplyModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Completion Gate vs Application Form */}
            {(candidate?.profileCompletion ?? 0) < 70 ? (
              <div style={{ padding: 'var(--space-8) var(--space-6)', textAlign: 'center' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)'
                }}>
                  <AlertCircle size={36} />
                </div>

                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
                  Complete your profile to apply
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: 440, margin: '0 auto var(--space-5)', lineHeight: 'var(--leading-relaxed)' }}>
                  Your profile is currently {candidate?.profileCompletion ?? 0}% complete. Please complete at least 70% of your profile before applying for jobs.
                </p>

                <div style={{
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  marginBottom: 'var(--space-6)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      Profile Completion:
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#d97706' }}>
                      {candidate?.profileCompletion ?? 0}% <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-muted)' }}>/ 70% Required</span>
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(candidate?.profileCompletion ?? 0, 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setCompanyApplyModalOpen(false);
                      navigate('/candidate/profile');
                    }}
                    rightIcon={<ArrowRight size={15} />}
                  >
                    Complete Profile
                  </Button>
                  <Button variant="secondary" onClick={() => setCompanyApplyModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmitCompanyApplication} style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {/* Notice */}
                  <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
                      🎯 <strong>Target Employer:</strong> You are submitting a dedicated job application to <strong>{selectedCompanyJob.companyName}</strong> for the position of <strong>{selectedCompanyJob.role}</strong>.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Full Name</label>
                      <input
                        className="input"
                        value={companyApplyForm.name}
                        onChange={(e) => setCompanyApplyForm({ ...companyApplyForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Email Address</label>
                      <input
                        type="email"
                        className="input"
                        value={companyApplyForm.email}
                        onChange={(e) => setCompanyApplyForm({ ...companyApplyForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Phone Number</label>
                      <input
                        type="tel"
                        className="input"
                        value={companyApplyForm.phone}
                        onChange={(e) => setCompanyApplyForm({ ...companyApplyForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Experience</label>
                      <input
                        className="input"
                        value={companyApplyForm.experience}
                        onChange={(e) => setCompanyApplyForm({ ...companyApplyForm, experience: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Education Qualification</label>
                    <input
                      className="input"
                      value={companyApplyForm.education}
                      onChange={(e) => setCompanyApplyForm({ ...companyApplyForm, education: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Key Technical Skills</label>
                    <input
                      className="input"
                      value={companyApplyForm.skills}
                      onChange={(e) => setCompanyApplyForm({ ...companyApplyForm, skills: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Selected Resume</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'var(--space-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                      <FileText size={18} style={{ color: 'var(--color-primary-600)' }} />
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, flex: 1 }}>{companyApplyForm.resume}</span>
                      <span className="badge badge-success" style={{ fontSize: '10px' }}>Attached</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Cover Note / Message to Recruiter</label>
                    <textarea
                      className="input"
                      rows={3}
                      value={companyApplyForm.coverNote}
                      onChange={(e) => setCompanyApplyForm({ ...companyApplyForm, coverNote: e.target.value })}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', background: 'var(--color-bg)' }}>
                  <Button type="button" variant="secondary" onClick={() => setCompanyApplyModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" leftIcon={<Send size={15} />}>
                    Submit Application
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Modal 3: Application Submission Success Modal ── */}
      {successModalOpen && submittedAppInfo && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1150,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)'
          }}
          onClick={() => setSuccessModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl)',
              width: '100%', maxWidth: 480,
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--color-success-50)', color: 'var(--color-success-600)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-4)',
              border: '2px solid var(--color-success-200)'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: 4 }}>
              Application Submitted! 🎉
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              Your application has been submitted specifically for:
            </p>

            <div style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)',
              textAlign: 'left',
              marginBottom: 'var(--space-4)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Role:</span>
                <strong style={{ fontSize: 'var(--text-xs)' }}>{submittedAppInfo.role}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Company:</span>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)' }}>{submittedAppInfo.companyName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Job Mela:</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text)' }}>{submittedAppInfo.melaTitle}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-border)', paddingTop: 4, marginTop: 4 }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Application No:</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary-700)', fontFamily: 'monospace, monospace' }}>{submittedAppInfo.appId}</span>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)', lineHeight: 1.4 }}>
              💡 <strong>Next Step:</strong> Bring 3 hard copies of your resume along with your Digital QR Pass to the company's designated interview counter at the event.
            </p>

            <Button variant="primary" fullWidth onClick={() => setSuccessModalOpen(false)}>
              Got It / Return to Job Mela
            </Button>
          </div>
        </div>
      )}

      {/* ── Modal 4: Digital QR Pass Modal ── */}
      {selectedPass && passModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)'
          }}
          onClick={() => setPassModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl)',
              width: '100%', maxWidth: 460,
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              background: '#ffffff',
              border: '2px dashed var(--color-primary-400)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-4)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span className="badge badge-success" style={{ marginBottom: 'var(--space-3)' }}>
                Official Fast-Track Entry Pass
              </span>

              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 2 }}>{selectedPass.title}</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Candidate: <strong>{candidate.name}</strong> • Event ID: <strong style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{formatMelaId(selectedPass.id)}</strong> • Registration ID: <strong style={{ fontFamily: 'monospace', color: 'var(--color-primary-600)' }}>{selectedPass.passId}</strong>
              </p>

              {/* QR placeholder */}
              <div style={{
                width: 140, height: 140,
                background: 'var(--color-gray-100)',
                borderRadius: 'var(--radius-xl)',
                margin: '0 auto var(--space-4)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--color-border)'
              }}>
                <QrCode size={80} style={{ color: 'var(--color-primary-900)' }} />
                <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', marginTop: 2 }}>Scan at Entrance</span>
              </div>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <strong>Venue:</strong> {selectedPass.venue}, {selectedPass.city}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 700, marginTop: 2 }}>
                {selectedPass.gateNumber}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button variant="secondary" fullWidth onClick={() => setPassModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" fullWidth leftIcon={<Download size={14} />} onClick={handleDownloadPass}>
                Download PDF Pass
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* ── Modal 5: Shared Application Details Modal ── */}
      <ApplicationDetailsModal
        isOpen={appDetailsModalOpen}
        onClose={() => setAppDetailsModalOpen(false)}
        application={selectedAppForDetails}
        candidate={candidate}
      />
    </div>
  );
}
