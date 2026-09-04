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

// ─── 13. SEED HOME PAGE CONTENT ───────────────────────────────────────────
export const DEFAULT_HOME_CONTENT = {
  hero: {
    badge: 'Most Trusted Career & Job Fair Network',
    heading1: 'Find Your Dream Job.',
    heading2: 'Accelerate Your Career.',
    subtext: 'Connect with top verified recruiters, apply for high-impact internships, and register for nationwide Mega Job Melas — all with transparent tracking.',
    searchPlaceholder: 'Search job titles, required skills, keywords, companies...',
    popularSearches: ['React', 'Python', 'Java', 'Data Science', 'Figma', 'Fintech', 'Freshers', 'Remote'],
    heroImage: null,
  },
  stats: [
    { id: 'stat-1', label: 'Active Jobs', value: '52,480+', icon: 'Briefcase' },
    { id: 'stat-2', label: 'Verified Companies', value: '14,200+', icon: 'Building2' },
    { id: 'stat-3', label: 'Registered Candidates', value: '2,80,000+', icon: 'Users' },
    { id: 'stat-4', label: 'Successful Placements', value: '1,95,000+', icon: 'TrendingUp' },
  ],
  whyChoose: {
    heading1: 'Why Choose',
    heading2: 'Our Job Portal?',
    subtitle: 'Everything you need to launch, accelerate, and safeguard your professional career journey in one integrated ecosystem.',
    cards: [
      { id: 'wc-1', title: 'Trusted Opportunities', desc: '100% verified opportunities with strict regulatory compliance and wage transparency.', icon: 'ShieldCheck' },
      { id: 'wc-2', title: 'Skill Development', desc: 'Government-recognized skill certifications, workshops, and industry bootcamps.', icon: 'GraduationCap' },
      { id: 'wc-3', title: 'Job Melas', desc: 'Direct entry to state-wide employment summits and mega walk-in recruitment drives.', icon: 'CalendarDays' },
      { id: 'wc-4', title: 'Easy Applications', desc: 'One-click application process with streamlined digital resume distribution.', icon: 'ArrowUpRight' },
      { id: 'wc-5', title: 'Application Tracking', desc: 'Transparent real-time status updates from submission to interview scheduling.', icon: 'TrendingUp' },
      { id: 'wc-6', title: 'Candidate Support', desc: 'Dedicated helpline, career counselling, and automated grievance redressal.', icon: 'Users' },
    ],
  },
  welcomePopup: {
    enabled: false,
    imageUrl: '',
    redirectUrl: '',
  },
};

// ─── 14. SEED JOBS PAGE CONTENT ───────────────────────────────────────────
export const DEFAULT_JOBS_PAGE_CONTENT = {
  hero: {
    badge: 'Corporate Recruitment Portal',
    heading: 'Find Your Dream Job in Andhra Pradesh & India',
    subtitle: 'Explore 2,450+ verified corporate job openings with zero placement fees',
  },
  search: {
    searchPlaceholder: 'Job title, skills (Python, React...), or company...',
    locationPlaceholder: 'All Locations (All India)',
    popularSearches: ['Python Developer', 'React JS', 'Data Analyst', 'Fresher Jobs', 'Hybrid Work', 'FastAPI'],
  },
};

// ─── 15. SEED JOB MELA PAGE CONTENT ───────────────────────────────────────
export const DEFAULT_JOB_MELA_CONTENT = {
  hero: {
    badge: 'Nationwide Recruitment Drives',
    heading: 'Mega Job Melas & Career Fairs',
    description: 'Attend on-ground walk-in interview sessions with 100+ hiring companies, receive free career guidance, and get spot job offer letters. Free registration for all job seekers.',
  },
};

// ─── 16. SEED SKILL DEVELOPMENT PAGE CONTENT ──────────────────────────────
export const DEFAULT_SKILL_PAGE_CONTENT = {
  hero: {
    badge: 'NTR VIKASA • Skill Development & Employment Generation',
    heading: 'Skill Development & Training Programs',
    description: 'Empowering job seekers with government-recognized, industry-aligned training, practical learning, and placement support.',
    exploreBtnText: 'Explore Programs',
    viewCoursesBtnText: 'View Courses',
  },
  highlights: [
    { id: 'hl-1', icon: 'Award', title: 'Government Recognized', subtitle: 'NSDC / NSQF Certified' },
    { id: 'hl-2', icon: 'TrendingUp', title: 'Placement Support', subtitle: 'Job Mela / Employment Support' },
    { id: 'hl-3', icon: 'BookOpen', title: 'Practical Curriculum', subtitle: 'Hands-on Industry Labs' },
    { id: 'hl-4', icon: 'Users', title: 'Expert Mentors', subtitle: 'Experienced Professionals' },
  ],
  empoweringSkills: {
    badge: 'Institutional Mission',
    heading: 'Empowering Skills. Enabling Careers.',
    description: 'The NTR VIKASA Skill Development initiative bridges the critical divide between academic qualifications and industry hiring standards. By partnering with state government bodies, national sector skill councils, and corporate employers, we deliver employment-focused, hands-on training to youth across Andhra Pradesh.',
    cards: [
      {
        id: 'es-1',
        icon: 'Code2',
        title: 'Industry-Relevant Learning',
        desc: 'Curricula designed directly in consultation with tech leaders, BFSI corporations, and manufacturing employers to teach in-demand workplace tools.'
      },
      {
        id: 'es-2',
        icon: 'Laptop',
        title: 'Practical Training Labs',
        desc: 'Over 70% of course time is dedicated to hands-on lab practicals, simulated industrial environments, and live capstone projects.'
      },
      {
        id: 'es-3',
        icon: 'TrendingUp',
        title: 'Placement Assistance',
        desc: 'Trained candidates receive dedicated interview preparation, resume enhancement, and direct fast-track access to regional Mega Job Melas.'
      }
    ]
  },
  trainingJourney: {
    badge: 'Candidate Pathway',
    heading: 'From Training to Employment',
    description: 'A structured 6-step journey designed to take you from foundational training to confirmed corporate placement.',
    steps: [
      { step: '01', title: 'Choose a Program', desc: 'Browse through high-demand domains like Tech, AI, Cloud, and BFSI to select the right skill track aligned with your career goals.' },
      { step: '02', title: 'Register & Counseling', desc: 'Submit a free online enrollment request. Our skill counselors guide you through batch schedules, prerequisite review, and center allocation.' },
      { step: '03', title: 'Hands-on Training', desc: 'Undergo practical, lab-based learning with experienced industry mentors, real-world capstone assignments, and modern equipment.' },
      { step: '04', title: 'Get Certified', desc: 'Earn government-recognized NSDC, NSQF, and Sector Skill Council certifications validating your industry-ready competencies.' },
      { step: '05', title: 'Placement Preparation', desc: 'Participate in resume enhancement sessions, technical interview simulations, soft skills coaching, and mock tests.' },
      { step: '06', title: 'Employment & Job Melas', desc: 'Receive direct interview access to 14,000+ verified corporate recruiters and fast-track entry to statewide Mega Job Melas.' },
    ]
  },
  programsWeOffer: {
    badge: 'Sector Domains',
    heading: 'Programs We Offer',
    description: 'Specialized training pathways spanning modern tech, finance, core engineering, and administrative sectors.',
    categories: [
      { id: 'it', name: 'Information Technology', icon: 'Code2', desc: 'Web development, cloud computing, and computer fundamentals', count: '3 Courses' },
      { id: 'data-ai', name: 'Data & AI', icon: 'Database', desc: 'Data analytics, Power BI dashboards, and business intelligence', count: '2 Courses' },
      { id: 'ai-tools', name: 'AI & Productivity Tools', icon: 'Sparkles', desc: 'ChatGPT prompt engineering, Gemini AI & office automation', count: '2 Courses' },
      { id: 'banking', name: 'Banking & Finance', icon: 'Landmark', desc: 'BFSI operations, retail banking, credit appraisal & compliance', count: '2 Courses' },
      { id: 'accounting', name: 'Office & Accounting', icon: 'Calculator', desc: 'Tally Prime, GST return filing, MS Office & Advanced Excel', count: '2 Courses' },
      { id: 'core-eng', name: 'Core Engineering', icon: 'Cpu', desc: 'PLC automation, SCADA systems, and industrial electrical wiring', count: '2 Courses' },
      { id: 'healthcare', name: 'Healthcare', icon: 'Activity', desc: 'Hospital administration, patient care, EMR systems & billing', count: '2 Courses' },
      { id: 'marketing', name: 'Marketing & Sales', icon: 'Megaphone', desc: 'Digital marketing, SEO, social media ads & customer support', count: '2 Courses' },
    ]
  },
  whyChoose: {
    badge: 'Institutional Excellence',
    heading: 'Why Choose NTR VIKASA',
    description: 'Outcome-focused advantages designed to give candidates a real competitive edge in modern job markets.',
    cards: [
      { icon: 'Award', title: 'Govt. & NSDC Recognized', desc: 'All programs follow National Skill Qualification Framework (NSQF) standards ensuring nationwide employer recognition.' },
      { icon: 'Laptop', title: '70% Practical Lab Training', desc: 'Emphasis on experiential lab exercises, software simulations, and hardware setups rather than rote memorization.' },
      { icon: 'Users', title: 'Certified Expert Mentors', desc: 'Learn directly from seasoned industry practitioners and certified instructors with extensive domain track records.' },
      { icon: 'TrendingUp', title: '100% Placement Support', desc: 'Direct pipeline to NTR VIKASA verified recruiters, corporate interview drives, and district-wide Mega Job Melas.' },
      { icon: 'ShieldCheck', title: '100% Free / Subsidized', desc: 'State-sponsored skill development initiatives designed to empower aspiring job seekers across all districts of Andhra Pradesh.' },
      { icon: 'Sparkles', title: 'Future-Ready Curriculum', desc: 'Regularly updated course modules integrating modern AI tools, cloud platforms, and modern industrial requirements.' },
    ]
  }
};

// ─── 17. SEED ABOUT US PAGE CONTENT ───────────────────────────────────────
export const DEFAULT_ABOUT_CONTENT = {
  hero: {
    badge: 'Our Mission & Impact',
    heading: 'Bridging Talent with Opportunity Across India',
    description: 'NTR VIKASA Job Portal was founded on a simple principle: every candidate deserves fair, direct access to employment opportunities without scam fees, opaque processes, or dead ends.',
  },
  stats: [
    { id: 'ab-stat-1', label: 'Registered Job Seekers', value: '2,80,000+', color: 'var(--color-primary-600)' },
    { id: 'ab-stat-2', label: 'Confirmed Placements', value: '1,95,000+', color: 'var(--color-success-600)' },
    { id: 'ab-stat-3', label: 'Verified Hiring Employers', value: '14,200+', color: 'var(--color-warning-600)' },
    { id: 'ab-stat-4', label: 'State-Wide Job Melas Held', value: '24+', color: 'var(--color-info-600)' },
  ],
  whatWeStandFor: {
    heading: 'What We Stand For',
    description: 'Guiding principles that power our candidate-first architecture and employer verification policies.',
    cards: [
      {
        id: 'wwsf-1',
        icon: 'ShieldCheck',
        title: '100% Verified Quality',
        desc: 'Every single recruiter profile and job listing is reviewed to eliminate illegitimate recruiters and recruitment charges.',
        color: 'primary'
      },
      {
        id: 'wwsf-2',
        icon: 'Target',
        title: 'Transparent Application Lifecycle',
        desc: 'Candidates receive live feedback across all 20 standard recruitment milestones from applied to interview to offer letters.',
        color: 'success'
      },
      {
        id: 'wwsf-3',
        icon: 'Users',
        title: 'Inclusive Mega Job Melas',
        desc: 'Bringing top corporate opportunities directly to Tier-2, Tier-3 and rural graduate communities through walk-in physical fairs.',
        color: 'warning'
      }
    ]
  },
  team: {
    badge: 'Our Leadership & Team',
    heading: 'Our Team',
    description: 'Experienced leaders with backgrounds across technology, public policy, and corporate recruitment.',
    members: [
      {
        id: 'team-1',
        name: 'Dr. Ramesh Sundaram',
        role: 'Founder & Managing Director',
        organization: 'NTR Vikasa',
        bio: 'Former National Employment Council advisor with 20+ years driving talent mobility initiatives.',
        image: null
      },
      {
        id: 'team-2',
        name: 'Ananya Deshmukh',
        role: 'Chief Technology Officer',
        organization: 'NTR Vikasa',
        bio: 'Ex-Google & Flipkart engineering leader passionate about AI-driven career matching.',
        image: null
      },
      {
        id: 'team-3',
        name: 'Siddharth Nair',
        role: 'Head of Employer Partnerships',
        organization: 'NTR Vikasa',
        bio: 'Built recruitment pipelines across 500+ Indian corporate enterprises and SME networks.',
        image: null
      },
      {
        id: 'team-4',
        name: 'Meera Sengupta',
        role: 'Director of Diversity & Job Melas',
        organization: 'NTR Vikasa',
        bio: 'Pioneered inclusive job fairs for women, PwD, and tier-2/3 college graduates across India.',
        image: null
      },
    ]
  },
  leadershipMessages: {
    badge: 'LEADERSHIP',
    heading: 'Leadership Messages',
    description: 'Words from our esteemed leaders who guide our mission',
    messages: [
      {
        id: 'msg-1',
        name: 'K Lacha Rao',
        designation: 'Chairperson',
        organization: 'NTR Vikasa Jobs',
        image: null,
        initials: 'VIKASA',
        headerBg: '#0f2a59',
        message: 'Our mission is to bridge the gap between academia and industry by providing industry-aligned curriculum to ICT faculty and students, offering the finest skill, career connect, and mentorship guidance.',
        fullMessage: 'Our mission is to bridge the gap between academia and industry by providing industry-aligned curriculum to ICT faculty and students, offering the finest skill, career connect, and mentorship guidance. Through deep collaboration with industry leaders and government stakeholders, we are dedicated to providing transformational employment avenues for all aspiring youth across the state.',
        hasViewAction: false
      },
      {
        id: 'msg-2',
        name: 'K. Lacha Rao',
        designation: 'Project Director',
        organization: 'Vikasa Jobs',
        image: null,
        initials: 'KLR',
        headerBg: '#047857',
        message: 'At NTR Vikasa, our mission is to empower youth by creating meaningful employment opportunities and building a skilled workforce for the future. We believe that every individual deserves the right guidance, training, and platform to achieve their career aspirations. Through our initiatives such as Job Melas, skill development programs, and industry partnerships,...',
        fullMessage: 'At NTR Vikasa, our mission is to empower youth by creating meaningful employment opportunities and building a skilled workforce for the future. We believe that every individual deserves the right guidance, training, and platform to achieve their career aspirations. Through our initiatives such as Job Melas, skill development programs, and industry partnerships, we strive to build sustainable bridges between talent and industry requirements across the state.',
        hasViewAction: true
      }
    ]
  },
  partners: {
    heading: 'OUR INDUSTRY & ACADEMIC TRAINING PARTNERS',
    description: 'Empowering future-ready talent in collaboration with leading corporate and educational organizations.',
    list: [
      { id: 'p-1', name: 'Hyundai MOBIS', logoText: 'HYUNDAI MOBIS', active: true, order: 1 },
      { id: 'p-2', name: 'ISUZU', logoText: 'ISUZU', active: true, order: 2 },
      { id: 'p-3', name: 'MedPlus+', logoText: 'MedPlus+', active: true, order: 3 },
      { id: 'p-4', name: 'Apollo Pharmacy', logoText: 'Apollo Pharmacy', active: true, order: 4 },
      { id: 'p-5', name: 'IndiGo', logoText: 'IndiGo', active: true, order: 5 },
      { id: 'p-6', name: 'INZI Controls', logoText: 'INZI CONTROLS', active: true, order: 6 },
      { id: 'p-7', name: 'Dixon', logoText: 'Dixon', active: true, order: 7 },
      { id: 'p-8', name: 'COGENT', logoText: 'COGENT', active: true, order: 8 },
      { id: 'p-9', name: 'Indus', logoText: 'Indus', active: true, order: 9 },
      { id: 'p-10', name: 'NIIT', logoText: 'NIIT', active: true, order: 10 },
      { id: 'p-11', name: 'iSON', logoText: 'iSON', active: true, order: 11 },
      { id: 'p-12', name: 'Deccan', logoText: 'deccan', active: true, order: 12 },
      { id: 'p-13', name: 'ICICI Bank', logoText: 'ICICI Bank', active: true, order: 13 },
    ]
  }
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

  const [homeContent, setHomeContent] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_home_content_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          hero: { ...DEFAULT_HOME_CONTENT.hero, ...(parsed.hero || {}) },
          stats: parsed.stats?.length ? parsed.stats : DEFAULT_HOME_CONTENT.stats,
          whyChoose: {
            ...DEFAULT_HOME_CONTENT.whyChoose,
            ...(parsed.whyChoose || {}),
            cards: parsed.whyChoose?.cards?.length ? parsed.whyChoose.cards : DEFAULT_HOME_CONTENT.whyChoose.cards,
          },
          welcomePopup: {
            ...DEFAULT_HOME_CONTENT.welcomePopup,
            ...(parsed.welcomePopup || {}),
          },
        };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_HOME_CONTENT;
  });

  const [jobsPageContent, setJobsPageContent] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_jobs_page_content_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          hero: { ...DEFAULT_JOBS_PAGE_CONTENT.hero, ...(parsed.hero || {}) },
          search: {
            ...DEFAULT_JOBS_PAGE_CONTENT.search,
            ...(parsed.search || {}),
            popularSearches: parsed.search?.popularSearches?.length ? parsed.search.popularSearches : DEFAULT_JOBS_PAGE_CONTENT.search.popularSearches,
          },
        };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_JOBS_PAGE_CONTENT;
  });

  const [jobMelaContent, setJobMelaContent] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_job_mela_content_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          hero: { ...DEFAULT_JOB_MELA_CONTENT.hero, ...(parsed.hero || {}) },
        };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_JOB_MELA_CONTENT;
  });

  const [skillPageContent, setSkillPageContent] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_skill_page_content_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          hero: { ...DEFAULT_SKILL_PAGE_CONTENT.hero, ...(parsed.hero || {}) },
          highlights: parsed.highlights?.length ? parsed.highlights : DEFAULT_SKILL_PAGE_CONTENT.highlights,
          empoweringSkills: {
            ...DEFAULT_SKILL_PAGE_CONTENT.empoweringSkills,
            ...(parsed.empoweringSkills || {}),
            cards: parsed.empoweringSkills?.cards?.length ? parsed.empoweringSkills.cards : DEFAULT_SKILL_PAGE_CONTENT.empoweringSkills.cards,
          },
          trainingJourney: {
            ...DEFAULT_SKILL_PAGE_CONTENT.trainingJourney,
            ...(parsed.trainingJourney || {}),
            steps: parsed.trainingJourney?.steps?.length ? parsed.trainingJourney.steps : DEFAULT_SKILL_PAGE_CONTENT.trainingJourney.steps,
          },
          programsWeOffer: {
            ...DEFAULT_SKILL_PAGE_CONTENT.programsWeOffer,
            ...(parsed.programsWeOffer || {}),
            categories: parsed.programsWeOffer?.categories?.length ? parsed.programsWeOffer.categories : DEFAULT_SKILL_PAGE_CONTENT.programsWeOffer.categories,
          },
          whyChoose: {
            ...DEFAULT_SKILL_PAGE_CONTENT.whyChoose,
            ...(parsed.whyChoose || {}),
            cards: parsed.whyChoose?.cards?.length ? parsed.whyChoose.cards : DEFAULT_SKILL_PAGE_CONTENT.whyChoose.cards,
          },
        };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_SKILL_PAGE_CONTENT;
  });

  const [aboutContent, setAboutContent] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_about_content_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          hero: {
            ...DEFAULT_ABOUT_CONTENT.hero,
            ...(parsed.hero || {}),
          },
          stats: parsed.stats?.length ? parsed.stats : DEFAULT_ABOUT_CONTENT.stats,
          whatWeStandFor: {
            ...DEFAULT_ABOUT_CONTENT.whatWeStandFor,
            ...(parsed.whatWeStandFor || {}),
            cards: parsed.whatWeStandFor?.cards?.length ? parsed.whatWeStandFor.cards : DEFAULT_ABOUT_CONTENT.whatWeStandFor.cards,
          },
          team: {
            ...DEFAULT_ABOUT_CONTENT.team,
            ...(parsed.team || {}),
            members: parsed.team?.members?.length ? parsed.team.members : DEFAULT_ABOUT_CONTENT.team.members,
          },
          leadershipMessages: {
            ...DEFAULT_ABOUT_CONTENT.leadershipMessages,
            ...(parsed.leadershipMessages || {}),
            messages: parsed.leadershipMessages?.messages?.length ? parsed.leadershipMessages.messages : DEFAULT_ABOUT_CONTENT.leadershipMessages.messages,
          },
          partners: {
            ...DEFAULT_ABOUT_CONTENT.partners,
            ...(parsed.partners || {}),
            list: parsed.partners?.list?.length ? parsed.partners.list : DEFAULT_ABOUT_CONTENT.partners.list,
          },
        };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_ABOUT_CONTENT;
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
      localStorage.setItem('ntr_admin_home_content_v1', JSON.stringify(homeContent));
      localStorage.setItem('ntr_admin_jobs_page_content_v1', JSON.stringify(jobsPageContent));
      localStorage.setItem('ntr_admin_job_mela_content_v1', JSON.stringify(jobMelaContent));
      localStorage.setItem('ntr_admin_skill_page_content_v1', JSON.stringify(skillPageContent));
      localStorage.setItem('ntr_admin_about_content_v1', JSON.stringify(aboutContent));
    } catch (e) {
      // ignore
    }
  }, [
    activeAdminId, isAdminLoggedIn, candidates, recruiters, companies,
    jobs, internships, applications, jobMelas, registrations,
    reports, auditLogs, notifications, settings, homeContent,
    jobsPageContent, jobMelaContent, skillPageContent, aboutContent
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
  const createJobMela = (melaData) => {
    const newMela = {
      id: `mela-${Date.now()}`,
      event: melaData.title || melaData.event || 'Mega Job Mela Event',
      title: melaData.title || melaData.event || 'Mega Job Mela Event',
      date: melaData.date || '2026-11-15',
      time: `${melaData.startTime || '09:00 AM'} - ${melaData.endTime || '06:00 PM'}`,
      location: melaData.city && melaData.state ? `${melaData.city}, ${melaData.state}` : (melaData.location || 'Andhra Pradesh'),
      venue: melaData.venue || melaData.address || 'State Convention Center',
      organizer: 'NTR Vikasa State Employment Authority (Admin)',
      createdByAdmin: true,
      companiesCount: 0,
      vacanciesCount: Number(melaData.maxCapacity) || 1000,
      registeredCandidatesCount: 0,
      status: 'APPROVED',
      ...melaData
    };
    setJobMelas(prev => [newMela, ...prev]);
    addAuditLog('Job Mela Event Created', newMela.event, 'JOB_MELA');
    return newMela;
  };

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

  // Home Page Content CMS update
  const updateHomeContent = (newContent) => {
    setHomeContent(prev => {
      const updated = {
        ...prev,
        ...newContent,
        hero: { ...prev.hero, ...(newContent.hero || {}) },
        stats: newContent.stats || prev.stats,
        whyChoose: {
          ...prev.whyChoose,
          ...(newContent.whyChoose || {}),
          cards: newContent.whyChoose?.cards || prev.whyChoose.cards,
        },
        welcomePopup: {
          ...(prev.welcomePopup || DEFAULT_HOME_CONTENT.welcomePopup),
          ...(newContent.welcomePopup || {}),
        },
      };
      return updated;
    });
    addAuditLog('Home Page Content Updated', 'Public Home Page Content CMS', 'SETTINGS');
  };

  const resetHomeContent = () => {
    setHomeContent(DEFAULT_HOME_CONTENT);
    addAuditLog('Home Page Content Reset to Defaults', 'Public Home Page Content CMS', 'SETTINGS');
  };

  // Jobs Page Hero & Search Content CMS update
  const updateJobsPageContent = (newContent) => {
    setJobsPageContent(prev => {
      const updated = {
        ...prev,
        ...newContent,
        hero: { ...prev.hero, ...(newContent.hero || {}) },
        search: {
          ...prev.search,
          ...(newContent.search || {}),
          popularSearches: newContent.search?.popularSearches || prev.search.popularSearches,
        },
      };
      return updated;
    });
    addAuditLog('Jobs Page Content Updated', 'Public Jobs Page Hero & Search CMS', 'SETTINGS');
  };

  const resetJobsPageContent = () => {
    setJobsPageContent(DEFAULT_JOBS_PAGE_CONTENT);
    addAuditLog('Jobs Page Content Reset to Defaults', 'Public Jobs Page Hero & Search CMS', 'SETTINGS');
  };

  // Job Mela Page Hero Content CMS update
  const updateJobMelaContent = (newContent) => {
    setJobMelaContent(prev => {
      const updated = {
        ...prev,
        ...newContent,
        hero: { ...prev.hero, ...(newContent.hero || {}) },
      };
      return updated;
    });
    addAuditLog('Job Mela Page Content Updated', 'Public Job Mela Hero CMS', 'SETTINGS');
  };

  const resetJobMelaContent = () => {
    setJobMelaContent(DEFAULT_JOB_MELA_CONTENT);
    addAuditLog('Job Mela Page Content Reset to Defaults', 'Public Job Mela Hero CMS', 'SETTINGS');
  };

  // Skill Development Page Content CMS update
  const updateSkillPageContent = (newContent) => {
    setSkillPageContent(prev => {
      const updated = {
        ...prev,
        ...newContent,
        hero: { ...prev.hero, ...(newContent.hero || {}) },
        highlights: newContent.highlights || prev.highlights,
        empoweringSkills: {
          ...prev.empoweringSkills,
          ...(newContent.empoweringSkills || {}),
          cards: newContent.empoweringSkills?.cards || prev.empoweringSkills.cards,
        },
        trainingJourney: {
          ...prev.trainingJourney,
          ...(newContent.trainingJourney || {}),
          steps: newContent.trainingJourney?.steps || prev.trainingJourney.steps,
        },
        programsWeOffer: {
          ...prev.programsWeOffer,
          ...(newContent.programsWeOffer || {}),
          categories: newContent.programsWeOffer?.categories || prev.programsWeOffer.categories,
        },
        whyChoose: {
          ...prev.whyChoose,
          ...(newContent.whyChoose || {}),
          cards: newContent.whyChoose?.cards || prev.whyChoose.cards,
        },
      };
      return updated;
    });
    addAuditLog('Skill Development Page Content Updated', 'Public Skill Development CMS', 'SETTINGS');
  };

  const resetSkillPageContent = () => {
    setSkillPageContent(DEFAULT_SKILL_PAGE_CONTENT);
    addAuditLog('Skill Development Page Content Reset to Defaults', 'Public Skill Development CMS', 'SETTINGS');
  };

  // About Us Page Content CMS update
  const updateAboutContent = (newContent) => {
    setAboutContent(prev => {
      const updated = {
        ...prev,
        ...newContent,
        hero: {
          ...prev.hero,
          ...(newContent.hero || {}),
        },
        stats: newContent.stats || prev.stats,
        whatWeStandFor: {
          ...prev.whatWeStandFor,
          ...(newContent.whatWeStandFor || {}),
          cards: newContent.whatWeStandFor?.cards || prev.whatWeStandFor.cards,
        },
        team: {
          ...prev.team,
          ...(newContent.team || {}),
          members: newContent.team?.members || prev.team.members,
        },
        leadershipMessages: {
          ...prev.leadershipMessages,
          ...(newContent.leadershipMessages || {}),
          messages: newContent.leadershipMessages?.messages || prev.leadershipMessages.messages,
        },
        partners: {
          ...prev.partners,
          ...(newContent.partners || {}),
          list: newContent.partners?.list || prev.partners.list,
        },
      };
      return updated;
    });
    addAuditLog('About Us Page Content Updated', 'Public About Us Page CMS', 'SETTINGS');
  };

  const resetAboutContent = () => {
    setAboutContent(DEFAULT_ABOUT_CONTENT);
    addAuditLog('About Us Page Content Reset to Defaults', 'Public About Us Page CMS', 'SETTINGS');
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
        homeContent,
        jobsPageContent,
        jobMelaContent,
        skillPageContent,
        aboutContent,
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
        createJobMela,
        resolveReport,
        rejectReport,
        updateAdminSettings,
        updateHomeContent,
        resetHomeContent,
        updateJobsPageContent,
        resetJobsPageContent,
        updateJobMelaContent,
        resetJobMelaContent,
        updateSkillPageContent,
        resetSkillPageContent,
        updateAboutContent,
        resetAboutContent,
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
