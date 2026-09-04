import { createContext, useContext, useState, useEffect } from 'react';

const CANDIDATE_1_DATA = {
  id: 'cand-1',
  email: 'candidate1@ntrvikasa.com',
  name: 'Priya Sharma',
  role: 'candidate',
  headline: 'Senior React & Frontend Developer | 4+ Years Experience',
  phone: '+91 98765 43210',
  location: 'Visakhapatnam, Andhra Pradesh',
  bio: 'Passionate frontend engineer specializing in performant React architectures, design systems, TypeScript, and micro-frontend state management with 4+ years of industry experience across enterprise web applications.',
  avatar: 'P',
  verified: true,
  profileCompletion: 80,
  linkedin: 'https://linkedin.com/in/priyasharma-dev',
  github: 'https://github.com/priyasharma-frontend',
  portfolio: 'https://priyasharma.dev',

  // Current Resume
  resume: {
    fileName: 'Vyshnavi_Resume.pdf',
    uploadedDate: '2 Sept 2026',
    fileSize: '1.4 MB',
    atsScore: 88,
    fileType: 'PDF Document',
  },

  // Skills & Preferences
  skillsPreferences: {
    skills: ['React.js', 'TypeScript', 'Next.js', 'JavaScript (ES6+)', 'Redux Toolkit', 'Tailwind CSS', 'HTML5/CSS3', 'Jest & Testing Library', 'Webpack/Vite', 'REST APIs & GraphQL'],
    preferredRoles: ['Senior Frontend Developer', 'React Specialist', 'UI Engineer', 'Fullstack UI Lead'],
    preferredLocations: ['Visakhapatnam', 'Vijayawada', 'Hyderabad', 'Bengaluru'],
    expectedSalary: '₹18,00,000 - ₹24,00,000 / year',
    currentSalary: '₹14,50,000 / year',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    industries: ['Information Technology', 'E-Commerce & Retail', 'Fintech & Banking'],
    experience: '4.2 Years',
    educationLevel: "Bachelor's Degree (B.Tech - CSE)"
  },

  // Experience & Education for Profile
  experienceList: [
    {
      id: 'exp-1',
      role: 'Senior Frontend Engineer',
      company: 'Infosys Digital',
      location: 'Hyderabad (Hybrid)',
      duration: 'June 2023 - Present (1 yr 3 mos)',
      description: 'Architected responsive portal components for banking clients. Reduced initial bundle size by 35% using code-splitting and dynamic imports.'
    },
    {
      id: 'exp-2',
      role: 'Frontend Developer',
      company: 'TCS Innovation Labs',
      location: 'Visakhapatnam',
      duration: 'Aug 2021 - May 2023 (1 yr 10 mos)',
      description: 'Developed scalable single-page applications using React, Redux, and RESTful APIs for telecom enterprise solutions.'
    }
  ],

  educationList: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Andhra University College of Engineering, Visakhapatnam',
      duration: '2017 - 2021',
      score: '8.7 CGPA'
    },
    {
      id: 'edu-2',
      degree: 'Intermediate (MPC)',
      institution: 'Sri Chaitanya Junior College, Vijayawada',
      duration: '2015 - 2017',
      score: '96.2%'
    }
  ],

  certificationsList: [
    { id: 'cert-1', name: 'Meta Certified Frontend Developer', issuer: 'Meta / Coursera', year: '2024' },
    { id: 'cert-2', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023' }
  ],

  projectsList: [
    { id: 'proj-1', title: 'NTR Vikasa Candidate Portal', tech: 'React, Vite, CSS Modules', description: 'Interactive job portal frontend with responsive candidate dashboard, multi-step filter search, and applicant tracking.' },
    { id: 'proj-2', title: 'Enterprise Design System UI Kit', tech: 'TypeScript, Storybook, Tailwind', description: 'Comprehensive component library with 45+ accessible UI components used across 6 product teams.' }
  ],

  languages: ['English (Fluent)', 'Telugu (Native)', 'Hindi (Conversational)'],

  // Applications
  applications: [
    {
      id: 'app-1',
      jobId: '1',
      title: 'Senior Python Developer',
      company: 'TechCorp India',
      companyLogo: null,
      location: 'Hyderabad',
      salary: '₹12,00,000 - ₹18,00,000',
      type: 'Full-time',
      mode: 'Hybrid',
      appliedDate: '02 Sept 2026',
      status: 'SHORTLISTED',
      timeline: [
        { stage: 'Applied', date: '02 Sept 2026', completed: true, current: false },
        { stage: 'Screening', date: '03 Sept 2026', completed: true, current: false },
        { stage: 'Shortlisted', date: '04 Sept 2026', completed: true, current: true },
        { stage: 'Interview', date: 'Pending Schedule', completed: false, current: false },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    },
    {
      id: 'app-2',
      jobId: '2',
      title: 'Senior React Developer',
      company: 'Infosys Digital',
      companyLogo: null,
      location: 'Visakhapatnam',
      salary: '₹15,00,000 - ₹22,00,000',
      type: 'Full-time',
      mode: 'Remote',
      appliedDate: '30 Aug 2026',
      status: 'INTERVIEW',
      timeline: [
        { stage: 'Applied', date: '30 Aug 2026', completed: true, current: false },
        { stage: 'Screening', date: '31 Aug 2026', completed: true, current: false },
        { stage: 'Shortlisted', date: '01 Sept 2026', completed: true, current: false },
        { stage: 'Interview', date: '10 Sept 2026 (11:00 AM)', completed: true, current: true },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    },
    {
      id: 'app-3',
      jobId: '3',
      title: 'Frontend UI Architect',
      company: 'Wipro Cloud Services',
      companyLogo: null,
      location: 'Bengaluru',
      salary: '₹18,00,000 - ₹25,00,000',
      type: 'Full-time',
      mode: 'Hybrid',
      appliedDate: '26 Aug 2026',
      status: 'SCREENING',
      timeline: [
        { stage: 'Applied', date: '26 Aug 2026', completed: true, current: false },
        { stage: 'Screening', date: '28 Aug 2026', completed: true, current: true },
        { stage: 'Shortlisted', date: 'Pending Review', completed: false, current: false },
        { stage: 'Interview', date: 'TBD', completed: false, current: false },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    },
    {
      id: 'app-4',
      jobId: '4',
      title: 'Design Systems Engineer',
      company: 'Flipkart AP Tech Hub',
      companyLogo: null,
      location: 'Vijayawada',
      salary: '₹14,00,000 - ₹20,00,000',
      type: 'Full-time',
      mode: 'On-site',
      appliedDate: '01 Sept 2026',
      status: 'APPLIED',
      timeline: [
        { stage: 'Applied', date: '01 Sept 2026', completed: true, current: true },
        { stage: 'Screening', date: 'Pending Review', completed: false, current: false },
        { stage: 'Shortlisted', date: 'Pending', completed: false, current: false },
        { stage: 'Interview', date: 'Pending', completed: false, current: false },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    },
    {
      id: 'app-5',
      jobId: '5',
      title: 'Frontend Developer (React)',
      company: 'TCS Innovation',
      companyLogo: null,
      location: 'Visakhapatnam',
      salary: '₹12,00,000 - ₹16,00,000',
      type: 'Full-time',
      mode: 'Hybrid',
      appliedDate: '15 Aug 2026',
      status: 'SELECTED',
      timeline: [
        { stage: 'Applied', date: '15 Aug 2026', completed: true, current: false },
        { stage: 'Screening', date: '17 Aug 2026', completed: true, current: false },
        { stage: 'Shortlisted', date: '19 Aug 2026', completed: true, current: false },
        { stage: 'Interview', date: '20 Aug 2026', completed: true, current: false },
        { stage: 'Selected', date: '24 Aug 2026', completed: true, current: true },
      ]
    },
    {
      id: 'app-6',
      jobId: '6',
      title: 'Senior JavaScript Engineer',
      company: 'Capgemini India',
      companyLogo: null,
      location: 'Hyderabad',
      salary: '₹13,00,000 - ₹17,00,000',
      type: 'Full-time',
      mode: 'Hybrid',
      appliedDate: '05 Aug 2026',
      status: 'REJECTED',
      timeline: [
        { stage: 'Applied', date: '05 Aug 2026', completed: true, current: false },
        { stage: 'Screening', date: '08 Aug 2026', completed: true, current: false },
        { stage: 'Shortlisted', date: 'Not Progressed', completed: false, current: false },
        { stage: 'Interview', date: 'N/A', completed: false, current: false },
        { stage: 'Rejected', date: '10 Aug 2026', completed: true, current: true },
      ]
    }
  ],

  // Saved Jobs
  savedJobIds: ['1', '2', '3', '7', '8', '11'],

  // Interviews
  interviews: [
    {
      id: 'int-1',
      title: 'Technical Round 1: React & Architecture',
      role: 'Senior React Developer',
      company: 'Infosys Digital',
      date: '10 Sept 2026',
      time: '11:00 AM - 12:00 PM',
      mode: 'Online Interview',
      meetingPlatform: 'Google Meet',
      meetingUrl: 'https://meet.google.com/ntr-vikasa-interview',
      status: 'UPCOMING',
      panel: 'Deepak Verma (Principal Architect)',
      instructions: 'Please be ready with your code IDE and a working camera/microphone 10 minutes prior.'
    },
    {
      id: 'int-2',
      title: 'System Design & State Management Discussion',
      role: 'Frontend UI Architect',
      company: 'TechCorp India',
      date: '14 Sept 2026',
      time: '03:00 PM - 04:00 PM',
      mode: 'Online Interview',
      meetingPlatform: 'Microsoft Teams',
      meetingUrl: 'https://teams.microsoft.com/l/meetup-join/techcorp-priya',
      status: 'UPCOMING',
      panel: 'Ananya Roy (Director of Engineering)',
      instructions: 'Focus on performance optimization, design system architecture, and real-time state synchronization.'
    },
    {
      id: 'int-3',
      title: 'Final Technical & Culture Fit Round',
      role: 'Frontend Developer (React)',
      company: 'TCS Innovation',
      date: '20 Aug 2026',
      time: '10:30 AM - 11:30 AM',
      mode: 'Online Interview',
      status: 'COMPLETED',
      result: 'Selected / Offer Released',
      panel: 'Raghavan Iyer (VP of Talent)'
    }
  ],

  // Notifications
  notifications: [
    {
      id: 'n-1',
      title: 'Interview Scheduled for Senior React Developer',
      message: 'Infosys Digital scheduled your Technical Round 1 on 10 Sept 2026 at 11:00 AM IST.',
      category: 'INTERVIEW',
      read: false,
      time: '10 mins ago',
      link: '/candidate/interviews'
    },
    {
      id: 'n-2',
      title: 'Application Shortlisted by TechCorp India',
      message: 'Great news! Your profile for Senior Python Developer was shortlisted by the hiring manager.',
      category: 'APPLICATION',
      read: false,
      time: '2 hours ago',
      link: '/candidate/applications'
    },
    {
      id: 'n-3',
      title: 'New High-Match Job in Visakhapatnam',
      message: 'Swiggy AP Tech Hub posted "Lead UI Developer" matching 95% of your React & TypeScript skills.',
      category: 'SYSTEM',
      read: false,
      time: '5 hours ago',
      link: '/candidate/jobs'
    },
    {
      id: 'n-4',
      title: 'Job Mela Gate Entry Pass Ready',
      message: 'Your Digital QR Pass for AP Mega IT Job Mela 2026 has been generated. Entry Gate: 3.',
      category: 'JOB_MELA',
      read: true,
      time: '1 day ago',
      link: '/candidate/job-melas'
    },
    {
      id: 'n-5',
      title: 'Profile Strength: 80% Complete',
      message: 'Add your latest project repository links to reach 100% profile strength and get 2x recruiter visibility.',
      category: 'ACCOUNT',
      read: true,
      time: '3 days ago',
      link: '/candidate/profile'
    }
  ]
};

const CANDIDATE_2_DATA = {
  id: 'cand-2',
  email: 'candidate2@ntrvikasa.com',
  name: 'Rahul Kumar',
  role: 'candidate',
  headline: 'Senior Python & Cloud Backend Developer | 3.5 Years Experience',
  phone: '+91 91234 56789',
  location: 'Vijayawada, Andhra Pradesh',
  bio: 'Backend engineer specialized in Python, FastAPI, Django, PostgreSQL, and AWS microservice architectures. Experienced in building high-throughput RESTful services, async task pipelines, and distributed databases.',
  avatar: 'R',
  verified: true,
  profileCompletion: 85,
  linkedin: 'https://linkedin.com/in/rahulkumar-python',
  github: 'https://github.com/rahulkumar-backend',
  portfolio: 'https://rahulkumar.dev',

  // Current Resume
  resume: {
    fileName: 'Rahul_Kumar_Python_Backend.pdf',
    uploadedDate: '28 Aug 2026',
    fileSize: '1.2 MB',
    atsScore: 92,
    fileType: 'PDF Document',
  },

  // Skills & Preferences
  skillsPreferences: {
    skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Redis', 'Microservices', 'SQLAlchemy', 'Git & CI/CD'],
    preferredRoles: ['Python Developer', 'Backend Engineer', 'Cloud API Developer', 'FastAPI Specialist'],
    preferredLocations: ['Vijayawada', 'Visakhapatnam', 'Hyderabad', 'Pune'],
    expectedSalary: '₹14,00,000 - ₹20,00,000 / year',
    currentSalary: '₹11,00,000 / year',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    industries: ['Information Technology', 'Fintech & Banking', 'Logistics & Supply Chain'],
    experience: '3.5 Years',
    educationLevel: "Bachelor's Degree (B.Tech - IT)"
  },

  experienceList: [
    {
      id: 'exp-1',
      role: 'Backend Python Engineer',
      company: 'TechCorp India',
      location: 'Hyderabad (Hybrid)',
      duration: 'Jan 2023 - Present (1 yr 8 mos)',
      description: 'Built high-concurrency microservices using FastAPI, Redis, and PostgreSQL. Improved async worker processing latency by 40%.'
    },
    {
      id: 'exp-2',
      role: 'Junior Python Developer',
      company: 'HCL Technologies',
      location: 'Vijayawada',
      duration: 'July 2021 - Dec 2022 (1 yr 6 mos)',
      description: 'Developed REST APIs in Django REST Framework, implemented database indexing, and integrated payment gateways.'
    }
  ],

  educationList: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Information Technology',
      institution: 'VR Siddhartha Engineering College, Vijayawada',
      duration: '2017 - 2021',
      score: '8.4 CGPA'
    }
  ],

  certificationsList: [
    { id: 'cert-1', name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', year: '2024' },
    { id: 'cert-2', name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF / Linux Foundation', year: '2023' }
  ],

  projectsList: [
    { id: 'proj-1', title: 'High-Throughput API Gateway', tech: 'FastAPI, Redis, Docker', description: 'Built reverse-proxy API rate-limiting middleware capable of handling 20,000 requests/sec with low latency.' },
    { id: 'proj-2', title: 'Distributed Event Pipeline', tech: 'Python, Kafka, PostgreSQL', description: 'Real-time telemetry event streaming pipeline processing sensor data from 100+ IoT edge nodes.' }
  ],

  languages: ['English (Fluent)', 'Telugu (Native)', 'Hindi (Fluent)'],

  // Applications
  applications: [
    {
      id: 'app-101',
      jobId: '1',
      title: 'Senior Python Developer',
      company: 'TechCorp India',
      companyLogo: null,
      location: 'Hyderabad',
      salary: '₹12,00,000 - ₹18,00,000',
      type: 'Full-time',
      mode: 'Hybrid',
      appliedDate: '01 Sept 2026',
      status: 'INTERVIEW',
      timeline: [
        { stage: 'Applied', date: '01 Sept 2026', completed: true, current: false },
        { stage: 'Screening', date: '02 Sept 2026', completed: true, current: false },
        { stage: 'Shortlisted', date: '03 Sept 2026', completed: true, current: false },
        { stage: 'Interview', date: '12 Sept 2026 (02:00 PM)', completed: true, current: true },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    },
    {
      id: 'app-102',
      jobId: '7',
      title: 'Backend API Specialist (Python / FastAPI)',
      company: 'Swiggy AP Labs',
      companyLogo: null,
      location: 'Vijayawada',
      salary: '₹14,00,000 - ₹20,00,000',
      type: 'Full-time',
      mode: 'Hybrid',
      appliedDate: '29 Aug 2026',
      status: 'SHORTLISTED',
      timeline: [
        { stage: 'Applied', date: '29 Aug 2026', completed: true, current: false },
        { stage: 'Screening', date: '31 Aug 2026', completed: true, current: false },
        { stage: 'Shortlisted', date: '02 Sept 2026', completed: true, current: true },
        { stage: 'Interview', date: 'Pending', completed: false, current: false },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    },
    {
      id: 'app-103',
      jobId: '8',
      title: 'Django & Cloud Backend Developer',
      company: 'Zoho Corporation',
      companyLogo: null,
      location: 'Tirupati',
      salary: '₹10,00,000 - ₹15,00,000',
      type: 'Full-time',
      mode: 'On-site',
      appliedDate: '22 Aug 2026',
      status: 'SCREENING',
      timeline: [
        { stage: 'Applied', date: '22 Aug 2026', completed: true, current: false },
        { stage: 'Screening', date: '25 Aug 2026', completed: true, current: true },
        { stage: 'Shortlisted', date: 'Pending', completed: false, current: false },
        { stage: 'Interview', date: 'TBD', completed: false, current: false },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    },
    {
      id: 'app-104',
      jobId: '9',
      title: 'Cloud Backend Engineer',
      company: 'HCL Technologies',
      companyLogo: null,
      location: 'Visakhapatnam',
      salary: '₹11,00,000 - ₹16,00,000',
      type: 'Full-time',
      mode: 'Remote',
      appliedDate: '31 Aug 2026',
      status: 'APPLIED',
      timeline: [
        { stage: 'Applied', date: '31 Aug 2026', completed: true, current: true },
        { stage: 'Screening', date: 'Pending', completed: false, current: false },
        { stage: 'Shortlisted', date: 'Pending', completed: false, current: false },
        { stage: 'Interview', date: 'Pending', completed: false, current: false },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    },
    {
      id: 'app-105',
      jobId: '10',
      title: 'Python Data Engineer',
      company: 'Cognizant Technology Solutions',
      companyLogo: null,
      location: 'Hyderabad',
      salary: '₹9,00,000 - ₹13,00,000',
      type: 'Full-time',
      mode: 'Hybrid',
      appliedDate: '10 Aug 2026',
      status: 'REJECTED',
      timeline: [
        { stage: 'Applied', date: '10 Aug 2026', completed: true, current: false },
        { stage: 'Screening', date: '12 Aug 2026', completed: true, current: false },
        { stage: 'Interview', date: '15 Aug 2026', completed: true, current: false },
        { stage: 'Rejected', date: '18 Aug 2026', completed: true, current: true },
      ]
    }
  ],

  // Saved Jobs
  savedJobIds: ['1', '7', '8', '12'],

  // Interviews
  interviews: [
    {
      id: 'int-101',
      title: 'Technical Round: Python, FastAPI & Concurrency',
      role: 'Senior Python Developer',
      company: 'TechCorp India',
      date: '12 Sept 2026',
      time: '02:00 PM - 03:00 PM',
      mode: 'Online Interview',
      meetingPlatform: 'Google Meet',
      meetingUrl: 'https://meet.google.com/ntr-python-rahul',
      status: 'UPCOMING',
      panel: 'Vikram Sethi (Engineering Manager)',
      instructions: 'Live coding on Python async programming, database optimization, and caching strategies.'
    },
    {
      id: 'int-102',
      title: 'Data Pipelines & Algorithms',
      role: 'Python Data Engineer',
      company: 'Cognizant',
      date: '15 Aug 2026',
      time: '11:00 AM - 12:00 PM',
      mode: 'Online Interview',
      status: 'COMPLETED',
      result: 'Not Selected',
      panel: 'Kavita Rao (Lead Architect)'
    }
  ],

  // Notifications
  notifications: [
    {
      id: 'n-101',
      title: 'Interview Scheduled for Senior Python Developer',
      message: 'TechCorp India scheduled your Technical Round on 12 Sept 2026 at 02:00 PM IST.',
      category: 'INTERVIEW',
      read: false,
      time: '30 mins ago',
      link: '/candidate/interviews'
    },
    {
      id: 'n-102',
      title: 'Application Shortlisted by Swiggy AP Labs',
      message: 'Your profile for Backend API Specialist was shortlisted for technical review.',
      category: 'APPLICATION',
      read: false,
      time: '3 hours ago',
      link: '/candidate/applications'
    },
    {
      id: 'n-103',
      title: 'New High-Match Job in Vijayawada',
      message: 'Zoho Corporation posted "Senior Backend Engineer" matching 92% of your Python & PostgreSQL skills.',
      category: 'SYSTEM',
      read: true,
      time: '1 day ago',
      link: '/candidate/jobs'
    }
  ]
};

const CandidateContext = createContext(null);

export function CandidateProvider({ children }) {
  // Store both candidate datasets
  const [candidatesData, setCandidatesData] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_candidate_users_v2');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return {
      'cand-1': CANDIDATE_1_DATA,
      'cand-2': CANDIDATE_2_DATA,
    };
  });

  // Current active candidate ID (default 'cand-1' -> Priya Sharma)
  const [activeCandidateId, setActiveCandidateId] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_active_candidate_id');
      if (stored && (stored === 'cand-1' || stored === 'cand-2')) return stored;
    } catch (e) {
      // ignore
    }
    return 'cand-1';
  });

  // Is candidate logged in?
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_candidate_logged_in');
      return stored !== 'false'; // default logged in for seamless demo
    } catch (e) {
      return true;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ntr_candidate_users_v2', JSON.stringify(candidatesData));
      localStorage.setItem('ntr_active_candidate_id', activeCandidateId);
      localStorage.setItem('ntr_candidate_logged_in', String(isLoggedIn));
    } catch (e) {
      // ignore
    }
  }, [candidatesData, activeCandidateId, isLoggedIn]);

  const candidate = candidatesData[activeCandidateId] || CANDIDATE_1_DATA;

  // Helper to update active candidate state
  const updateCandidate = (updater) => {
    setCandidatesData((prev) => {
      const current = prev[activeCandidateId] || CANDIDATE_1_DATA;
      const updated = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      return {
        ...prev,
        [activeCandidateId]: updated
      };
    });
  };

  // Login handler
  const login = (email) => {
    if (email?.toLowerCase().includes('candidate2') || email?.toLowerCase().includes('rahul')) {
      setActiveCandidateId('cand-2');
    } else {
      setActiveCandidateId('cand-1');
    }
    setIsLoggedIn(true);
  };

  // Logout handler
  const logout = () => {
    setIsLoggedIn(false);
  };

  // Switch Candidate (convenient for testing Candidate 1 vs Candidate 2)
  const switchCandidate = (candidateId) => {
    if (candidateId === 'cand-1' || candidateId === 'cand-2') {
      setActiveCandidateId(candidateId);
      setIsLoggedIn(true);
    }
  };

  // Apply for Job
  const applyJob = (job, applicationDetails = {}) => {
    const newApp = {
      id: `app-${Date.now()}`,
      jobId: String(job.id),
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo || null,
      location: job.location,
      salary: job.salary,
      type: job.type || 'Full-time',
      mode: job.mode || 'Hybrid',
      appliedDate: 'Just now (Today)',
      status: 'APPLIED',
      coverLetter: applicationDetails.coverLetter || '',
      additionalInfo: applicationDetails.additionalInfo || '',
      resumeName: applicationDetails.resumeName || candidate.resume.fileName,
      timeline: [
        { stage: 'Applied', date: 'Today (Just now)', completed: true, current: true },
        { stage: 'Screening', date: 'Pending Review', completed: false, current: false },
        { stage: 'Shortlisted', date: 'Pending', completed: false, current: false },
        { stage: 'Interview', date: 'Pending Schedule', completed: false, current: false },
        { stage: 'Selected', date: 'TBD', completed: false, current: false },
      ]
    };

    updateCandidate((prev) => ({
      ...prev,
      applications: [newApp, ...prev.applications.filter(a => String(a.jobId) !== String(job.id))],
      notifications: [
        {
          id: `n-${Date.now()}`,
          title: `Application Submitted: ${job.title}`,
          message: `Your application has been successfully submitted to ${job.company}. Track your progress in My Applications.`,
          category: 'APPLICATION',
          read: false,
          time: 'Just now',
          link: '/candidate/applications'
        },
        ...prev.notifications
      ]
    }));

    return newApp;
  };

  // Save / Unsave Job
  const saveJob = (jobId) => {
    updateCandidate((prev) => {
      const idStr = String(jobId);
      if (prev.savedJobIds.includes(idStr)) return prev;
      return {
        ...prev,
        savedJobIds: [...prev.savedJobIds, idStr]
      };
    });
  };

  const unsaveJob = (jobId) => {
    updateCandidate((prev) => {
      const idStr = String(jobId);
      return {
        ...prev,
        savedJobIds: prev.savedJobIds.filter(id => id !== idStr)
      };
    });
  };

  const isJobSaved = (jobId) => {
    return candidate.savedJobIds.includes(String(jobId));
  };

  // Update Resume
  const updateResume = (resumeData) => {
    updateCandidate((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        ...resumeData,
        uploadedDate: 'Just now (Today)'
      },
      notifications: [
        {
          id: `n-${Date.now()}`,
          title: 'Resume Updated Successfully',
          message: `Your active resume ${resumeData.fileName || prev.resume.fileName} has been updated. Recruiters will now receive your newest version.`,
          category: 'ACCOUNT',
          read: false,
          time: 'Just now',
          link: '/candidate/resume'
        },
        ...prev.notifications
      ]
    }));
  };

  // Update Profile
  const updateProfile = (profileData) => {
    updateCandidate((prev) => ({
      ...prev,
      ...profileData
    }));
  };

  // Update Skills & Preferences
  const updateSkillsPreferences = (prefData) => {
    updateCandidate((prev) => ({
      ...prev,
      skillsPreferences: {
        ...prev.skillsPreferences,
        ...prefData
      }
    }));
  };

  // Mark notification read
  const markNotificationRead = (notifId) => {
    updateCandidate((prev) => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === notifId ? { ...n, read: true } : n)
    }));
  };

  const markAllNotificationsRead = () => {
    updateCandidate((prev) => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  // Derived metrics for current candidate
  const stats = {
    applied: candidate.applications.length,
    shortlisted: candidate.applications.filter(a => a.status === 'SHORTLISTED').length,
    interviews: candidate.interviews.filter(i => i.status === 'UPCOMING').length,
    savedJobs: candidate.savedJobIds.length,
  };

  return (
    <CandidateContext.Provider
      value={{
        candidate,
        activeCandidateId,
        isLoggedIn,
        stats,
        login,
        logout,
        switchCandidate,
        updateCandidate,
        applyJob,
        saveJob,
        unsaveJob,
        isJobSaved,
        updateResume,
        updateProfile,
        updateSkillsPreferences,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidate() {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidate must be used within a CandidateProvider');
  }
  return context;
}
