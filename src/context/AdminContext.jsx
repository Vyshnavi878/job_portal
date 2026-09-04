import { createContext, useContext, useState, useEffect } from 'react';

// ─── 1. ADMIN SEED USERS ──────────────────────────────────────────────────
const SEED_ADMINS = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin1@ntrvikasa.com',
    password: 'password123',
    role: 'admin',
    title: 'Platform Administrator',
    designation: 'State Operations Lead',
    avatar: 'A',
    permissions: ['ALL'],
  },
  {
    id: 'admin-2',
    name: 'Super Admin',
    email: 'admin2@ntrvikasa.com',
    password: 'password123',
    role: 'admin',
    title: 'Super Administrator',
    designation: 'Director of Employment & Governance',
    avatar: 'S',
    permissions: ['ALL', 'SYSTEM_CONFIG', 'AUDIT_OVERRIDE'],
  }
];

// ─── 2. SEED PLATFORM CANDIDATES ──────────────────────────────────────────
const SEED_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    headline: 'Senior React & Frontend Engineer',
    experience: '4.2 Years',
    skills: ['React.js', 'TypeScript', 'Redux', 'HTML/CSS'],
    education: "B.Tech in Computer Science, VTU",
    registrationDate: '2026-08-01',
    profileStatus: 'COMPLETE',
    accountStatus: 'ACTIVE',
    applicationsCount: 12,
  },
  {
    id: 'cand-2',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    phone: '+91 98123 45678',
    location: 'Hyderabad, Telangana',
    headline: 'Backend & Cloud Python Engineer',
    experience: '3.5 Years',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
    education: "B.Tech in Information Technology, JNTUH",
    registrationDate: '2026-08-05',
    profileStatus: 'COMPLETE',
    accountStatus: 'ACTIVE',
    applicationsCount: 8,
  },
  {
    id: 'cand-3',
    name: 'Vikram Sethi',
    email: 'vikram.sethi@example.com',
    phone: '+91 99887 66554',
    location: 'Remote (India)',
    headline: 'DevOps & Kubernetes SRE Specialist',
    experience: '5.0 Years',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
    education: "B.E. in Electronics, NIT Warangal",
    registrationDate: '2026-08-10',
    profileStatus: 'COMPLETE',
    accountStatus: 'ACTIVE',
    applicationsCount: 5,
  },
  {
    id: 'cand-4',
    name: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 97765 11223',
    location: 'Bengaluru, Karnataka',
    headline: 'AI / Machine Learning Engineer',
    experience: '2.5 Years',
    skills: ['PyTorch', 'Python', 'NLP', 'TensorFlow'],
    education: "M.Tech in Data Science, IISc",
    registrationDate: '2026-08-14',
    profileStatus: 'COMPLETE',
    accountStatus: 'ACTIVE',
    applicationsCount: 7,
  },
  {
    id: 'cand-5',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@example.com',
    phone: '+91 98220 12345',
    location: 'Pune, Maharashtra',
    headline: 'Product UI/UX & Design Systems Lead',
    experience: '4.0 Years',
    skills: ['Figma', 'UI/UX Design', 'Design Systems'],
    education: "B.Des in Visual Communication, NID",
    registrationDate: '2026-08-18',
    profileStatus: 'COMPLETE',
    accountStatus: 'ACTIVE',
    applicationsCount: 14,
  },
  {
    id: 'cand-6',
    name: 'Karthik Varma',
    email: 'karthik.v@example.com',
    phone: '+91 98440 98765',
    location: 'Visakhapatnam, AP',
    headline: 'Associate Full Stack Developer',
    experience: '1.2 Years',
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    education: "B.Tech in CS, Andhra University",
    registrationDate: '2026-08-20',
    profileStatus: 'UNDER_REVIEW',
    accountStatus: 'ACTIVE',
    applicationsCount: 4,
  },
  {
    id: 'cand-7',
    name: 'Bot Automated Submitter',
    email: 'spambot99@temp-mail.org',
    phone: '+91 90000 00000',
    location: 'Unknown',
    headline: 'Automated Scraping Profile',
    experience: '0.0 Years',
    skills: ['Spamming'],
    education: "None",
    registrationDate: '2026-08-22',
    profileStatus: 'FLAGGED',
    accountStatus: 'SUSPENDED',
    applicationsCount: 150,
  }
];

// ─── 3. SEED RECRUITERS ────────────────────────────────────────────────────
const SEED_RECRUITERS = [
  {
    id: 'rec-u-1',
    name: 'Arjun Reddy',
    email: 'recruiter1@ntrvikasa.com',
    company: 'ABC Technologies Pvt Ltd',
    designation: 'Director of Talent Acquisition',
    phone: '+91 98765 00112',
    registrationDate: '2026-08-01',
    verificationStatus: 'VERIFIED',
    accountStatus: 'ACTIVE',
    postedJobsCount: 5,
  },
  {
    id: 'rec-u-2',
    name: 'Sneha Rao',
    email: 'recruiter2@ntrvikasa.com',
    company: 'Tech Solutions Global Ltd',
    designation: 'Head of People & University Talent',
    phone: '+91 91234 88776',
    registrationDate: '2026-08-03',
    verificationStatus: 'VERIFIED',
    accountStatus: 'ACTIVE',
    postedJobsCount: 4,
  },
  {
    id: 'rec-u-3',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@fintechcorp.example.com',
    company: 'Fintech Corp India Pvt Ltd',
    designation: 'Lead Technical Recruiter',
    phone: '+91 98111 22334',
    registrationDate: '2026-09-01',
    verificationStatus: 'PENDING',
    accountStatus: 'ACTIVE',
    postedJobsCount: 0,
    documentsSubmitted: ['Certificate of Incorporation', 'Company GSTIN', 'Official Work Email'],
  },
  {
    id: 'rec-u-4',
    name: 'Divya Iyer',
    email: 'divya.iyer@healthplus.example.com',
    company: 'HealthPlus Systems Ltd',
    designation: 'Senior HR Talent Manager',
    phone: '+91 98222 33445',
    registrationDate: '2026-09-02',
    verificationStatus: 'PENDING',
    accountStatus: 'ACTIVE',
    postedJobsCount: 0,
    documentsSubmitted: ['CIN Certificate', 'Official Board ID'],
  },
  {
    id: 'rec-u-5',
    name: 'Manoj Kumar',
    email: 'manoj.k@fraudventures.xyz',
    company: 'Fast Cash Enterprises',
    designation: 'Hiring Agent',
    phone: '+91 99999 00000',
    registrationDate: '2026-08-25',
    verificationStatus: 'REJECTED',
    accountStatus: 'SUSPENDED',
    postedJobsCount: 0,
    rejectionReason: 'Invalid CIN and unverified corporate address.',
  }
];

// ─── 4. SEED COMPANIES ─────────────────────────────────────────────────────
const SEED_COMPANIES = [
  {
    id: 'comp-1',
    name: 'ABC Technologies Pvt Ltd',
    recruiter: 'Arjun Reddy',
    industry: 'Information Technology & Cloud',
    location: 'Bengaluru, Karnataka',
    size: '1000-5000 employees',
    cin: 'U72200KA2015PTC078912',
    gstin: '29ABCDE1234F1Z5',
    verificationStatus: 'VERIFIED',
    registrationDate: '2026-08-01',
    activeJobsCount: 5,
  },
  {
    id: 'comp-2',
    name: 'Tech Solutions Global Ltd',
    recruiter: 'Sneha Rao',
    industry: 'Fintech & Banking Systems',
    location: 'Hyderabad, Telangana',
    size: '500-1000 employees',
    cin: 'U72900TG2018PTC099142',
    gstin: '36ABCDE9876F1Z2',
    verificationStatus: 'VERIFIED',
    registrationDate: '2026-08-03',
    activeJobsCount: 4,
  },
  {
    id: 'comp-3',
    name: 'Fintech Corp India Pvt Ltd',
    recruiter: 'Rahul Mehta',
    industry: 'Digital Payments & Web3',
    location: 'Mumbai, Maharashtra',
    size: '200-500 employees',
    cin: 'U65999MH2020PTC345678',
    gstin: '27ABCDE5678F1Z9',
    verificationStatus: 'PENDING',
    registrationDate: '2026-09-01',
    activeJobsCount: 0,
  },
  {
    id: 'comp-4',
    name: 'HealthPlus Systems Ltd',
    recruiter: 'Divya Iyer',
    industry: 'Healthcare Diagnostics & AI',
    location: 'Bengaluru, Karnataka',
    size: '100-250 employees',
    cin: 'U85110KA2021PTC456789',
    gstin: '29ABCDE4321F1Z8',
    verificationStatus: 'PENDING',
    registrationDate: '2026-09-02',
    activeJobsCount: 0,
  },
  {
    id: 'comp-5',
    name: 'NextGen Autonomous Robotics',
    recruiter: 'Kiran Deshmukh',
    industry: 'Robotics & Hardware',
    location: 'Visakhapatnam, AP',
    size: '50-100 employees',
    cin: 'U29300AP2022PTC112233',
    gstin: '37ABCDE1122F1Z1',
    verificationStatus: 'PENDING',
    registrationDate: '2026-09-03',
    activeJobsCount: 0,
  },
];

// ─── 5. SEED JOBS ──────────────────────────────────────────────────────────
const SEED_JOBS = [
  {
    id: 'job-101',
    title: 'Senior Frontend Engineer (React / TypeScript)',
    company: 'ABC Technologies Pvt Ltd',
    location: 'Bengaluru, Karnataka',
    experience: '3-5 years',
    salary: '₹16,00,000 - ₹24,00,000 / year',
    recruiter: 'Arjun Reddy',
    postedDate: '2026-08-15',
    status: 'ACTIVE',
    applicantsCount: 78,
    type: 'Full-time',
  },
  {
    id: 'job-102',
    title: 'Senior Python & Cloud Backend Developer',
    company: 'ABC Technologies Pvt Ltd',
    location: 'Hyderabad, Telangana',
    experience: '3-6 years',
    salary: '₹14,00,000 - ₹22,00,000 / year',
    recruiter: 'Arjun Reddy',
    postedDate: '2026-08-18',
    status: 'ACTIVE',
    applicantsCount: 45,
    type: 'Full-time',
  },
  {
    id: 'job-103',
    title: 'DevOps & Cloud Infrastructure Specialist',
    company: 'ABC Technologies Pvt Ltd',
    location: 'Remote (India)',
    experience: '4-7 years',
    salary: '₹20,00,000 - ₹30,00,000 / year',
    recruiter: 'Arjun Reddy',
    postedDate: '2026-08-20',
    status: 'ACTIVE',
    applicantsCount: 32,
    type: 'Full-time',
  },
  {
    id: 'job-104',
    title: 'AI / ML Engineer — Computer Vision & NLP',
    company: 'ABC Technologies Pvt Ltd',
    location: 'Bengaluru, Karnataka',
    experience: '2-4 years',
    salary: '₹18,00,000 - ₹26,00,000 / year',
    recruiter: 'Arjun Reddy',
    postedDate: '2026-08-24',
    status: 'PENDING',
    applicantsCount: 12,
    type: 'Full-time',
  },
  {
    id: 'job-201',
    title: 'Full Stack UI Architect (React / Node.js)',
    company: 'Tech Solutions Global Ltd',
    location: 'Hyderabad, Telangana',
    experience: '4-8 years',
    salary: '₹18,00,000 - ₹28,00,000 / year',
    recruiter: 'Sneha Rao',
    postedDate: '2026-08-10',
    status: 'ACTIVE',
    applicantsCount: 64,
    type: 'Full-time',
  },
  {
    id: 'job-202',
    title: 'Cloud Data Platform Engineer (Snowflake/PySpark)',
    company: 'Tech Solutions Global Ltd',
    location: 'Visakhapatnam, AP',
    experience: '3-5 years',
    salary: '₹15,00,000 - ₹22,00,000 / year',
    recruiter: 'Sneha Rao',
    postedDate: '2026-08-16',
    status: 'ACTIVE',
    applicantsCount: 38,
    type: 'Full-time',
  },
  {
    id: 'job-301',
    title: 'Senior Blockchain & Solidity Engineer',
    company: 'Fintech Corp India Pvt Ltd',
    location: 'Mumbai, Maharashtra',
    experience: '3-6 years',
    salary: '₹22,00,000 - ₹35,00,000 / year',
    recruiter: 'Rahul Mehta',
    postedDate: '2026-09-02',
    status: 'PENDING',
    applicantsCount: 0,
    type: 'Full-time',
  },
  {
    id: 'job-302',
    title: 'Clinical Data Pipeline Lead',
    company: 'HealthPlus Systems Ltd',
    location: 'Bengaluru, Karnataka',
    experience: '4-7 years',
    salary: '₹18,00,000 - ₹25,00,000 / year',
    recruiter: 'Divya Iyer',
    postedDate: '2026-09-03',
    status: 'PENDING',
    applicantsCount: 0,
    type: 'Full-time',
  }
];

// ─── 6. SEED INTERNSHIPS ───────────────────────────────────────────────────
const SEED_INTERNSHIPS = [
  {
    id: 'int-101',
    title: 'Frontend React Development Intern',
    company: 'ABC Technologies Pvt Ltd',
    duration: '6 Months',
    stipend: '₹25,000 / month',
    location: 'Bengaluru, Karnataka',
    submittedDate: '2026-08-16',
    status: 'ACTIVE',
    openings: 4,
    applicantsCount: 42,
  },
  {
    id: 'int-102',
    title: 'Cloud Infrastructure & DevOps Intern',
    company: 'ABC Technologies Pvt Ltd',
    duration: '6 Months',
    stipend: '₹30,000 / month',
    location: 'Hyderabad, Telangana',
    submittedDate: '2026-08-19',
    status: 'ACTIVE',
    openings: 2,
    applicantsCount: 28,
  },
  {
    id: 'int-103',
    title: 'AI & Data Science Engineering Intern',
    company: 'ABC Technologies Pvt Ltd',
    duration: '6 Months',
    stipend: '₹28,000 / month',
    location: 'Remote (India)',
    submittedDate: '2026-08-25',
    status: 'PENDING',
    openings: 2,
    applicantsCount: 19,
  },
  {
    id: 'int-201',
    title: 'Fintech Microservices & Backend Intern',
    company: 'Tech Solutions Global Ltd',
    duration: '6 Months',
    stipend: '₹22,000 / month',
    location: 'Hyderabad, Telangana',
    submittedDate: '2026-08-18',
    status: 'ACTIVE',
    openings: 3,
    applicantsCount: 35,
  },
  {
    id: 'int-301',
    title: 'Smart Medical Devices Firmware Intern',
    company: 'HealthPlus Systems Ltd',
    duration: '3 Months',
    stipend: '₹20,000 / month',
    location: 'Bengaluru, Karnataka',
    submittedDate: '2026-09-02',
    status: 'PENDING',
    openings: 2,
    applicantsCount: 0,
  }
];

// ─── 7. SEED APPLICATIONS MONITORING ──────────────────────────────────────
const SEED_APPLICATIONS = [
  {
    id: 'app-1',
    candidate: 'Priya Sharma',
    candidateEmail: 'priya.sharma@example.com',
    job: 'Senior Frontend Engineer (React / TypeScript)',
    company: 'ABC Technologies Pvt Ltd',
    appliedDate: '2026-08-20',
    status: 'SHORTLISTED',
  },
  {
    id: 'app-2',
    candidate: 'Rahul Kumar',
    candidateEmail: 'rahul.kumar@example.com',
    job: 'Senior Python & Cloud Backend Developer',
    company: 'ABC Technologies Pvt Ltd',
    appliedDate: '2026-08-21',
    status: 'INTERVIEW',
  },
  {
    id: 'app-3',
    candidate: 'Vikram Sethi',
    candidateEmail: 'vikram.sethi@example.com',
    job: 'DevOps & Cloud Infrastructure Specialist',
    company: 'ABC Technologies Pvt Ltd',
    appliedDate: '2026-08-22',
    status: 'SELECTED',
  },
  {
    id: 'app-4',
    candidate: 'Ananya Roy',
    candidateEmail: 'ananya.roy@example.com',
    job: 'AI / ML Engineer — Computer Vision & NLP',
    company: 'ABC Technologies Pvt Ltd',
    appliedDate: '2026-08-24',
    status: 'APPLIED',
  },
  {
    id: 'app-5',
    candidate: 'Sneha Kulkarni',
    candidateEmail: 'sneha.kulkarni@example.com',
    job: 'Full Stack UI Architect (React / Node.js)',
    company: 'Tech Solutions Global Ltd',
    appliedDate: '2026-08-25',
    status: 'SHORTLISTED',
  },
  {
    id: 'app-6',
    candidate: 'Karthik Varma',
    candidateEmail: 'karthik.v@example.com',
    job: 'Cloud Data Platform Engineer',
    company: 'Tech Solutions Global Ltd',
    appliedDate: '2026-08-26',
    status: 'APPLIED',
  },
];

// ─── 8. SEED JOB MELAS & REGISTRATIONS ────────────────────────────────────
const SEED_JOB_MELAS = [
  {
    id: 'mela-1',
    event: 'Bengaluru Mega IT & Cloud Career Expo 2026',
    date: '2026-09-18',
    location: 'BIEC Exhibition Grounds, Tumkur Road, Bengaluru',
    organizer: 'NTR Vikasa State Employment Authority',
    companiesCount: 84,
    vacanciesCount: 2400,
    status: 'APPROVED',
    registeredCandidatesCount: 1420,
  },
  {
    id: 'mela-2',
    event: 'AP Mega IT & Engineering Job Mela 2026',
    date: '2026-10-05',
    location: 'AU Convention Center, Beach Road, Visakhapatnam',
    organizer: 'Andhra Pradesh Skill Development Corp',
    companiesCount: 65,
    vacanciesCount: 1800,
    status: 'APPROVED',
    registeredCandidatesCount: 950,
  },
  {
    id: 'mela-3',
    event: 'Hyderabad Healthcare & Biotech Hiring Summit',
    date: '2026-10-20',
    location: 'HITEX Exhibition Center, Hitec City, Hyderabad',
    organizer: 'Telangana Life Sciences Board',
    companiesCount: 42,
    vacanciesCount: 800,
    status: 'PENDING',
    registeredCandidatesCount: 320,
  }
];

const SEED_REGISTRATIONS = [
  {
    id: 'reg-1',
    candidate: 'Priya Sharma',
    candidateEmail: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    event: 'Bengaluru Mega IT & Cloud Career Expo 2026',
    registrationDate: '2026-08-28',
    status: 'CONFIRMED',
    entryToken: 'TKN-BLR-0042',
  },
  {
    id: 'reg-2',
    candidate: 'Rahul Kumar',
    candidateEmail: 'rahul.kumar@example.com',
    phone: '+91 98123 45678',
    event: 'Bengaluru Mega IT & Cloud Career Expo 2026',
    registrationDate: '2026-08-29',
    status: 'CONFIRMED',
    entryToken: 'TKN-BLR-0043',
  },
  {
    id: 'reg-3',
    candidate: 'Karthik Varma',
    candidateEmail: 'karthik.v@example.com',
    phone: '+91 98440 98765',
    event: 'AP Mega IT & Engineering Job Mela 2026',
    registrationDate: '2026-09-01',
    status: 'CONFIRMED',
    entryToken: 'TKN-VIZ-0012',
  },
  {
    id: 'reg-4',
    candidate: 'Ananya Roy',
    candidateEmail: 'ananya.roy@example.com',
    phone: '+91 97765 11223',
    event: 'Hyderabad Healthcare & Biotech Hiring Summit',
    registrationDate: '2026-09-02',
    status: 'WAITLISTED',
    entryToken: 'TKN-HYD-0008',
  }
];

// ─── 9. SEED REPORTS / COMPLAINTS ─────────────────────────────────────────
const SEED_REPORTS = [
  {
    id: 'rep-1',
    reportType: 'Job Scam / Fee Request',
    reportedEntity: 'Fast Cash Enterprises (Manoj Kumar)',
    reporter: 'Candidate User (Anonymous)',
    reporterEmail: 'cand.verify@example.com',
    date: '2026-08-26',
    status: 'RESOLVED',
    details: 'Recruiter asked for ₹500 registration fee before releasing interview schedule.',
    actionTaken: 'Recruiter account suspended and company blacklisted from platform.',
  },
  {
    id: 'rep-2',
    reportType: 'Misleading Job Description',
    reportedEntity: 'AI Model Trainer (TechGlobal)',
    reporter: 'Sneha Kulkarni',
    reporterEmail: 'sneha.kulkarni@example.com',
    date: '2026-09-01',
    status: 'PENDING',
    details: 'Listed as hybrid engineering job, but actually required door-to-door direct sales.',
    actionTaken: 'Under active moderator review.',
  },
  {
    id: 'rep-3',
    reportType: 'Profile Harassment in Messages',
    reportedEntity: 'Unverified Candidate ID #409',
    reporter: 'ABC Technologies HR Team',
    reporterEmail: 'careers@abctechnologies.example.com',
    date: '2026-09-03',
    status: 'PENDING',
    details: 'Repeated offensive spam submissions through application portal.',
    actionTaken: 'Awaiting admin disciplinary review.',
  }
];

// ─── 10. SEED AUDIT LOGS ──────────────────────────────────────────────────
const SEED_AUDIT_LOGS = [
  {
    id: 'log-1',
    action: 'Job Approved',
    adminUser: 'Admin User',
    target: 'Senior Frontend Engineer (React / TypeScript)',
    entityType: 'JOB',
    date: '2026-09-04',
    time: '10:32 AM IST',
    result: 'SUCCESS',
    ip: '10.200.45.12',
  },
  {
    id: 'log-2',
    action: 'Company Verified',
    adminUser: 'Admin User',
    target: 'ABC Technologies Pvt Ltd (U72200KA2015PTC078912)',
    entityType: 'COMPANY',
    date: '2026-09-04',
    time: '09:15 AM IST',
    result: 'SUCCESS',
    ip: '10.200.45.12',
  },
  {
    id: 'log-3',
    action: 'Recruiter Suspended',
    adminUser: 'Super Admin',
    target: 'Manoj Kumar (Fast Cash Enterprises)',
    entityType: 'RECRUITER',
    date: '2026-09-03',
    time: '04:45 PM IST',
    result: 'SUCCESS',
    ip: '10.200.45.1',
  },
  {
    id: 'log-4',
    action: 'Job Mela Approved',
    adminUser: 'Super Admin',
    target: 'AP Mega IT & Engineering Job Mela 2026',
    entityType: 'JOB_MELA',
    date: '2026-09-02',
    time: '02:20 PM IST',
    result: 'SUCCESS',
    ip: '10.200.45.1',
  },
  {
    id: 'log-5',
    action: 'Admin System Login',
    adminUser: 'Admin User',
    target: 'Admin Control Panel Dashboard',
    entityType: 'AUTH',
    date: '2026-09-04',
    time: '08:00 AM IST',
    result: 'SUCCESS',
    ip: '10.200.45.12',
  }
];

// ─── 11. SEED NOTIFICATIONS ───────────────────────────────────────────────
const SEED_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Recruiter Verification Request',
    message: 'Rahul Mehta (Fintech Corp India Pvt Ltd) submitted verification documents.',
    time: '15 mins ago',
    unread: true,
    link: '/admin/recruiter-verification',
    category: 'APPROVAL',
  },
  {
    id: 'notif-2',
    title: 'Pending Job Posting Review',
    message: 'Clinical Data Pipeline Lead by HealthPlus Systems Ltd requires approval.',
    time: '1 hour ago',
    unread: true,
    link: '/admin/job-approvals',
    category: 'APPROVAL',
  },
  {
    id: 'notif-3',
    title: 'Urgent Moderation Report Filed',
    message: 'A candidate submitted a complaint regarding misleading job description.',
    time: '3 hours ago',
    unread: true,
    link: '/admin/reports',
    category: 'MODERATION',
  },
  {
    id: 'notif-4',
    title: 'Job Mela Registration Milestone',
    message: 'Bengaluru Mega IT Career Expo has crossed 1,400 registered candidates.',
    time: '1 day ago',
    unread: false,
    link: '/admin/job-melas',
    category: 'EVENT',
  }
];

// ─── 12. SEED SYSTEM SETTINGS ─────────────────────────────────────────────
const SEED_SETTINGS = {
  platformName: 'NTR VIKASA State Job Portal Administration',
  autoApproveVerifiedRecruiters: false,
  requireCompanyGSTIN: true,
  enableInstantEmailAlerts: true,
  dailyAuditLogSummary: true,
  candidateProfileVerification: true,
  maintenanceMode: false,
};

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // 1. Admin Users & Auth Session
  const [adminUsers] = useState(SEED_ADMINS);
  const [activeAdminId, setActiveAdminId] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_active_id');
      if (stored && (stored === 'admin-1' || stored === 'admin-2')) return stored;
    } catch (e) {
      // ignore
    }
    return 'admin-1';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_logged_in');
      return stored === 'true';
    } catch (e) {
      return false;
    }
  });

  // 2. Platform Core Datasets
  const [candidates, setCandidates] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_candidates_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_CANDIDATES;
  });

  const [recruiters, setRecruiters] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_recruiters_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_RECRUITERS;
  });

  const [companies, setCompanies] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_companies_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_COMPANIES;
  });

  const [jobs, setJobs] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_jobs_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_JOBS;
  });

  const [internships, setInternships] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_internships_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_INTERNSHIPS;
  });

  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_applications_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_APPLICATIONS;
  });

  const [jobMelas, setJobMelas] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_job_melas_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_JOB_MELAS;
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_registrations_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_REGISTRATIONS;
  });

  const [reports, setReports] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_reports_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_REPORTS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_audit_logs_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_notifications_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_settings_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_SETTINGS;
  });

  // Persist State to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ntr_admin_active_id', activeAdminId);
      localStorage.setItem('ntr_admin_logged_in', String(isAdminLoggedIn));
      localStorage.setItem('ntr_admin_candidates_v1', JSON.stringify(candidates));
      localStorage.setItem('ntr_admin_recruiters_v1', JSON.stringify(recruiters));
      localStorage.setItem('ntr_admin_companies_v1', JSON.stringify(companies));
      localStorage.setItem('ntr_admin_jobs_v1', JSON.stringify(jobs));
      localStorage.setItem('ntr_admin_internships_v1', JSON.stringify(internships));
      localStorage.setItem('ntr_admin_applications_v1', JSON.stringify(applications));
      localStorage.setItem('ntr_admin_job_melas_v1', JSON.stringify(jobMelas));
      localStorage.setItem('ntr_admin_registrations_v1', JSON.stringify(registrations));
      localStorage.setItem('ntr_admin_reports_v1', JSON.stringify(reports));
      localStorage.setItem('ntr_admin_audit_logs_v1', JSON.stringify(auditLogs));
      localStorage.setItem('ntr_admin_notifications_v1', JSON.stringify(notifications));
      localStorage.setItem('ntr_admin_settings_v1', JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  }, [
    activeAdminId, isAdminLoggedIn, candidates, recruiters, companies,
    jobs, internships, applications, jobMelas, registrations,
    reports, auditLogs, notifications, settings
  ]);

  const currentAdmin = adminUsers.find(a => a.id === activeAdminId) || adminUsers[0];

  // Helper to add audit log entry
  const addAuditLog = (action, target, entityType, result = 'SUCCESS') => {
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      adminUser: currentAdmin.name,
      target,
      entityType,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      result,
      ip: '10.200.45.12',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // ── AUTH HANDLERS ────────────────────────────────────────────────────────
  const loginAdmin = (email, password) => {
    const cleanEmail = email?.trim().toLowerCase();
    if (cleanEmail?.includes('admin2') || cleanEmail?.includes('super')) {
      setActiveAdminId('admin-2');
    } else {
      setActiveAdminId('admin-1');
    }
    setIsAdminLoggedIn(true);
    addAuditLog('Admin System Login', 'Admin Control Panel', 'AUTH');
    return { success: true, admin: currentAdmin };
  };

  const logoutAdmin = () => {
    addAuditLog('Admin Logout', 'Admin Session Terminated', 'AUTH');
    setIsAdminLoggedIn(false);
  };

  const switchAdmin = (adminId) => {
    if (adminId === 'admin-1' || adminId === 'admin-2') {
      setActiveAdminId(adminId);
      setIsAdminLoggedIn(true);
    }
  };

  // ── ACTION DISPATCHERS ───────────────────────────────────────────────────

  // Recruiter actions
  const verifyRecruiter = (recruiterId, status = 'VERIFIED', notes = '') => {
    setRecruiters(prev =>
      prev.map(r => (r.id === recruiterId ? { ...r, verificationStatus: status } : r))
    );
    const rec = recruiters.find(r => r.id === recruiterId);
    addAuditLog(`Recruiter ${status === 'VERIFIED' ? 'Verified' : 'Rejected'}`, rec?.name || recruiterId, 'RECRUITER');
  };

  const suspendRecruiter = (recruiterId) => {
    setRecruiters(prev =>
      prev.map(r => (r.id === recruiterId ? { ...r, accountStatus: 'SUSPENDED' } : r))
    );
    const rec = recruiters.find(r => r.id === recruiterId);
    addAuditLog('Recruiter Suspended', rec?.name || recruiterId, 'RECRUITER');
  };

  const activateRecruiter = (recruiterId) => {
    setRecruiters(prev =>
      prev.map(r => (r.id === recruiterId ? { ...r, accountStatus: 'ACTIVE' } : r))
    );
    const rec = recruiters.find(r => r.id === recruiterId);
    addAuditLog('Recruiter Activated', rec?.name || recruiterId, 'RECRUITER');
  };

  // Candidate actions
  const suspendCandidate = (candidateId) => {
    setCandidates(prev =>
      prev.map(c => (c.id === candidateId ? { ...c, accountStatus: 'SUSPENDED' } : c))
    );
    const cand = candidates.find(c => c.id === candidateId);
    addAuditLog('Candidate Suspended', cand?.name || candidateId, 'CANDIDATE');
  };

  const activateCandidate = (candidateId) => {
    setCandidates(prev =>
      prev.map(c => (c.id === candidateId ? { ...c, accountStatus: 'ACTIVE' } : c))
    );
    const cand = candidates.find(c => c.id === candidateId);
    addAuditLog('Candidate Activated', cand?.name || candidateId, 'CANDIDATE');
  };

  // Company actions
  const approveCompany = (companyId) => {
    setCompanies(prev =>
      prev.map(c => (c.id === companyId ? { ...c, verificationStatus: 'VERIFIED' } : c))
    );
    const comp = companies.find(c => c.id === companyId);
    addAuditLog('Company Verified & Approved', comp?.name || companyId, 'COMPANY');
  };

  const rejectCompany = (companyId, reason = '') => {
    setCompanies(prev =>
      prev.map(c => (c.id === companyId ? { ...c, verificationStatus: 'REJECTED', rejectionReason: reason } : c))
    );
    const comp = companies.find(c => c.id === companyId);
    addAuditLog('Company Verification Rejected', comp?.name || companyId, 'COMPANY');
  };

  // Job actions
  const approveJob = (jobId) => {
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'ACTIVE' } : j))
    );
    const job = jobs.find(j => j.id === jobId);
    addAuditLog('Job Approved & Published', job?.title || jobId, 'JOB');
  };

  const rejectJob = (jobId, reason = '') => {
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'REJECTED', rejectionReason: reason } : j))
    );
    const job = jobs.find(j => j.id === jobId);
    addAuditLog('Job Posting Rejected', job?.title || jobId, 'JOB');
  };

  const requestJobChanges = (jobId, feedback = '') => {
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'PENDING', changeRequest: feedback } : j))
    );
    const job = jobs.find(j => j.id === jobId);
    addAuditLog('Job Changes Requested', job?.title || jobId, 'JOB');
  };

  // Internship actions
  const approveInternship = (internshipId) => {
    setInternships(prev =>
      prev.map(i => (i.id === internshipId ? { ...i, status: 'ACTIVE' } : i))
    );
    const intern = internships.find(i => i.id === internshipId);
    addAuditLog('Internship Approved', intern?.title || internshipId, 'INTERNSHIP');
  };

  const rejectInternship = (internshipId, reason = '') => {
    setInternships(prev =>
      prev.map(i => (i.id === internshipId ? { ...i, status: 'REJECTED', rejectionReason: reason } : i))
    );
    const intern = internships.find(i => i.id === internshipId);
    addAuditLog('Internship Rejected', intern?.title || internshipId, 'INTERNSHIP');
  };

  // Job Mela actions
  const approveJobMela = (melaId) => {
    setJobMelas(prev =>
      prev.map(m => (m.id === melaId ? { ...m, status: 'APPROVED' } : m))
    );
    const mela = jobMelas.find(m => m.id === melaId);
    addAuditLog('Job Mela Event Approved', mela?.event || melaId, 'JOB_MELA');
  };

  const rejectJobMela = (melaId) => {
    setJobMelas(prev =>
      prev.map(m => (m.id === melaId ? { ...m, status: 'REJECTED' } : m))
    );
    const mela = jobMelas.find(m => m.id === melaId);
    addAuditLog('Job Mela Event Rejected', mela?.event || melaId, 'JOB_MELA');
  };

  // Report actions
  const resolveReport = (reportId, resolutionNotes = '') => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'RESOLVED', actionTaken: resolutionNotes || 'Resolved by administrator.' } : r))
    );
    const rep = reports.find(r => r.id === reportId);
    addAuditLog('Report Complaint Resolved', rep?.reportedEntity || reportId, 'REPORT');
  };

  const rejectReport = (reportId) => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'DISMISSED', actionTaken: 'Dismissed as non-actionable.' } : r))
    );
    const rep = reports.find(r => r.id === reportId);
    addAuditLog('Report Complaint Dismissed', rep?.reportedEntity || reportId, 'REPORT');
  };

  // Settings update
  const updateAdminSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('Admin System Settings Updated', 'System Configuration', 'SETTINGS');
  };

  // Summary counts for badges
  const pendingCounts = {
    recruiterVerifications: recruiters.filter(r => r.verificationStatus === 'PENDING').length,
    companyVerifications: companies.filter(c => c.verificationStatus === 'PENDING').length,
    jobApprovals: jobs.filter(j => j.status === 'PENDING').length,
    internshipApprovals: internships.filter(i => i.status === 'PENDING').length,
    jobMelaApprovals: jobMelas.filter(m => m.status === 'PENDING').length,
    openReports: reports.filter(r => r.status === 'PENDING').length,
    unreadNotifications: notifications.filter(n => n.unread).length,
  };

  return (
    <AdminContext.Provider
      value={{
        adminUsers,
        currentAdmin,
        activeAdminId,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        switchAdmin,
        candidates,
        recruiters,
        companies,
        jobs,
        internships,
        applications,
        jobMelas,
        registrations,
        reports,
        auditLogs,
        notifications,
        settings,
        pendingCounts,
        verifyRecruiter,
        suspendRecruiter,
        activateRecruiter,
        suspendCandidate,
        activateCandidate,
        approveCompany,
        rejectCompany,
        approveJob,
        rejectJob,
        requestJobChanges,
        approveInternship,
        rejectInternship,
        approveJobMela,
        rejectJobMela,
        resolveReport,
        rejectReport,
        updateAdminSettings,
        addAuditLog,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
