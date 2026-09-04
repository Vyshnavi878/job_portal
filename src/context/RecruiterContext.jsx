import { createContext, useContext, useState, useEffect } from 'react';

// ─── RECRUITER 1 SEED DATA: Arjun Reddy (ABC Technologies) ─────────────────
const RECRUITER_1_DATA = {
  id: 'rec-1',
  email: 'recruiter1@ntrvikasa.com',
  name: 'Arjun Reddy',
  role: 'recruiter',
  designation: 'Director of Talent Acquisition',
  phone: '+91 98765 00112',
  avatar: 'A',

  // Company details
  company: {
    name: 'ABC Technologies Pvt Ltd',
    tagline: 'Leading enterprise cloud modernization, DevOps & digital transformation engineering.',
    description: 'ABC Technologies is a premier enterprise IT software solutions provider. With global delivery centers across Bengaluru, Hyderabad, and Vijayawada, ABC Technologies powers digital platforms for Fortune 500 enterprises across Fintech, E-Commerce, and Supply Chain.',
    industry: 'Information Technology',
    size: '1000-5000 employees',
    employeesCount: '2,400+',
    foundedYear: '2015',
    website: 'https://abctechnologies.example.com',
    email: 'careers@abctechnologies.example.com',
    phone: '+91 80 4920 1000',
    location: 'Bengaluru, Karnataka (Offices in Hyderabad & Vijayawada)',
    address: 'Block B, RMZ Ecospace, Outer Ring Road, Bellandur, Bengaluru 560103',
    cinNumber: 'U72200KA2015PTC078912',
    gstNumber: '29ABCDE1234F1Z5',
    verified: true,
    activeJobsCount: 5,
    internshipsCount: 3,
  },

  // Posted Jobs
  jobs: [
    {
      id: 'job-101',
      title: 'Senior Frontend Engineer (React / TypeScript)',
      department: 'Core Engineering',
      type: 'Full-time',
      workMode: 'Hybrid',
      location: 'Bengaluru, Karnataka',
      experience: '3-5 years',
      salary: '₹16,00,000 - ₹24,00,000 / year',
      applicantsCount: 78,
      shortlistedCount: 14,
      interviewsCount: 5,
      hiredCount: 2,
      status: 'PUBLISHED',
      createdAt: '2026-08-15',
      deadline: '2026-09-30',
      openings: 3,
      description: 'We are seeking an experienced Senior Frontend Engineer to build high-scale, accessible web applications using React, TypeScript, and modern state architectures.',
      responsibilities: '• Architect and implement performant React UI components.\n• Collaborate with product designers and backend API engineers.\n• Mentor junior frontend developers and uphold testing standards.',
      requirements: '• 4+ years of hands-on React & TypeScript development.\n• Deep knowledge of state management, bundling, and browser rendering optimization.\n• Strong testing practices with Jest & React Testing Library.',
      qualifications: "Bachelor's Degree in Computer Science or equivalent practical experience.",
      skills: ['React.js', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'REST APIs', 'Jest']
    },
    {
      id: 'job-102',
      title: 'Senior Python & Cloud Backend Developer',
      department: 'Platform Core',
      type: 'Full-time',
      workMode: 'Hybrid',
      location: 'Hyderabad, Telangana',
      experience: '3-6 years',
      salary: '₹14,00,000 - ₹22,00,000 / year',
      applicantsCount: 45,
      shortlistedCount: 9,
      interviewsCount: 4,
      hiredCount: 1,
      status: 'PUBLISHED',
      createdAt: '2026-08-18',
      deadline: '2026-09-25',
      openings: 2,
      description: 'Design and scale asynchronous microservices, REST/GraphQL APIs, and distributed event pipelines using Python, FastAPI, and PostgreSQL.',
      responsibilities: '• Build scalable API gateways and asynchronous task workers.\n• Optimize database queries and caching layers in Redis.\n• Deploy containerized services on AWS ECS & Kubernetes.',
      requirements: '• 3+ years experience with Python, FastAPI or Django.\n• Strong database schema design skills in PostgreSQL.\n• Experience with Docker, CI/CD pipelines, and AWS services.',
      qualifications: "Bachelor's Degree in IT / Computer Science.",
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Microservices']
    },
    {
      id: 'job-103',
      title: 'DevOps & Cloud Infrastructure Specialist',
      department: 'Infra & SecOps',
      type: 'Full-time',
      workMode: 'Remote',
      location: 'Remote (India)',
      experience: '4-7 years',
      salary: '₹20,00,000 - ₹30,00,000 / year',
      applicantsCount: 32,
      shortlistedCount: 6,
      interviewsCount: 2,
      hiredCount: 1,
      status: 'PUBLISHED',
      createdAt: '2026-08-20',
      deadline: '2026-10-10',
      openings: 2,
      description: 'Lead automated multi-cloud provisioning, Kubernetes cluster management, and SOC-2 compliance automation.',
      responsibilities: '• Manage Terraform modules and GitOps pipelines in ArgoCD.\n• Monitor telemetry across Prometheus, Grafana, and Datadog.\n• Automate zero-downtime deployment pipelines.',
      requirements: '• Strong experience with AWS, Kubernetes, Terraform, and Docker.',
      qualifications: "Bachelor's Degree in Engineering.",
      skills: ['Kubernetes', 'AWS', 'Terraform', 'Docker', 'CI/CD', 'Prometheus']
    },
    {
      id: 'job-104',
      title: 'AI / ML Engineer — Computer Vision & NLP',
      department: 'AI Innovation Lab',
      type: 'Full-time',
      workMode: 'Hybrid',
      location: 'Bengaluru, Karnataka',
      experience: '2-4 years',
      salary: '₹18,00,000 - ₹26,00,000 / year',
      applicantsCount: 12,
      shortlistedCount: 3,
      interviewsCount: 1,
      hiredCount: 0,
      status: 'PENDING',
      createdAt: '2026-08-24',
      deadline: '2026-10-15',
      openings: 2,
      description: 'Build predictive AI models, multimodal pipelines, and production LLM integrations.',
      responsibilities: '• Train, fine-tune, and deploy transformer models.\n• Optimize model inference latency for edge devices.',
      requirements: '• PyTorch, TensorFlow, Hugging Face, Python, Vector DBs.',
      qualifications: "Master's or Bachelor's in CS / AI.",
      skills: ['PyTorch', 'Python', 'Machine Learning', 'NLP', 'TensorFlow', 'LLMs']
    },
    {
      id: 'job-105',
      title: 'Associate Product Marketing Lead',
      department: 'Marketing & Growth',
      type: 'Full-time',
      workMode: 'On-site',
      location: 'Bengaluru, Karnataka',
      experience: '1-3 years',
      salary: '₹8,00,000 - ₹12,00,000 / year',
      applicantsCount: 0,
      shortlistedCount: 0,
      interviewsCount: 0,
      hiredCount: 0,
      status: 'DRAFT',
      createdAt: '2026-08-26',
      deadline: '2026-10-01',
      openings: 1,
      description: 'Draft position for B2B product marketing and campaign analytics.',
      responsibilities: '• Create collateral, case studies, and product release notes.',
      requirements: '• 2+ years B2B product marketing experience.',
      qualifications: 'MBA or Bachelor in Marketing/Communications.',
      skills: ['Product Marketing', 'Content Strategy', 'B2B Marketing', 'Analytics']
    },
  ],

  // Candidates talent pool
  candidates: [
    {
      id: 'cand-1',
      name: 'Priya Sharma',
      role: 'Senior React & Frontend Developer',
      headline: 'Senior React & Frontend Developer | 4+ Years Experience | Visakhapatnam & Bengaluru',
      experience: '4.2 Years',
      location: 'Visakhapatnam, Andhra Pradesh',
      skills: ['React.js', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Jest', 'REST APIs'],
      matchScore: 95,
      resumeName: 'Priya_Sharma_Resume.pdf',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      education: 'B.Tech in Computer Science, Andhra University (8.7 CGPA)',
      currentSalary: '₹14,50,000 / year',
      expectedSalary: '₹20,00,000 - ₹24,00,000 / year',
      workMode: 'Hybrid / Remote',
      availability: 'Immediate (15 days notice)',
      summary: 'Passionate frontend engineer specialized in performant React architectures, design systems, TypeScript, and micro-frontend state management with 4+ years of enterprise experience.',
      projects: ['NTR Vikasa Candidate Portal (React, Vite)', 'Enterprise Design System UI Kit (Storybook, TypeScript)'],
      certifications: ['Meta Certified Frontend Developer', 'AWS Cloud Practitioner'],
      shortlisted: true,
      status: 'SHORTLISTED',
    },
    {
      id: 'cand-2',
      name: 'Rahul Kumar',
      role: 'Senior Python & Cloud Backend Engineer',
      headline: 'Senior Python & Cloud Backend Developer | 3.5 Years Experience | Vijayawada & Hyderabad',
      experience: '3.5 Years',
      location: 'Vijayawada, Andhra Pradesh',
      skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Microservices'],
      matchScore: 92,
      resumeName: 'Rahul_Kumar_Python_Backend.pdf',
      email: 'rahul.kumar@example.com',
      phone: '+91 91234 56789',
      education: 'B.Tech in IT, VR Siddhartha Engineering College (8.4 CGPA)',
      currentSalary: '₹11,00,000 / year',
      expectedSalary: '₹16,00,000 - ₹20,00,000 / year',
      workMode: 'Hybrid / Remote',
      availability: '30 Days Notice',
      summary: 'Backend engineer specialized in Python, FastAPI, Django, PostgreSQL, and AWS microservices. Experienced in building high-throughput RESTful services and async pipelines.',
      projects: ['High-Throughput API Rate Limiter (FastAPI, Redis)', 'Distributed Telemetry Pipeline (Kafka, Python)'],
      certifications: ['AWS Certified Solutions Architect – Associate', 'CKA (Certified Kubernetes Administrator)'],
      shortlisted: true,
      status: 'SHORTLISTED',
    },
    {
      id: 'cand-3',
      name: 'Kavita Reddy',
      role: 'Full Stack Java & Cloud Engineer',
      headline: 'Full Stack Java Developer | Spring Boot, React & Microservices | 5 Years Experience',
      experience: '5.0 Years',
      location: 'Hyderabad, Telangana',
      skills: ['Java', 'Spring Boot', 'React.js', 'PostgreSQL', 'Kafka', 'Docker', 'AWS'],
      matchScore: 88,
      resumeName: 'Kavita_Reddy_FullStack.pdf',
      email: 'kavita.reddy@example.com',
      phone: '+91 98451 23456',
      education: 'B.Tech in CSE, JNTU Hyderabad (8.9 CGPA)',
      currentSalary: '₹16,00,000 / year',
      expectedSalary: '₹22,00,000 - ₹26,00,000 / year',
      workMode: 'Hybrid',
      availability: 'Immediate',
      summary: 'Full stack Java & React developer experienced in high-concurrency banking workflows and microservices.',
      projects: ['Omnichannel Payment Gateway', 'Core Banking Microservices Engine'],
      certifications: ['Oracle Certified Professional Java SE 11', 'AWS Developer Associate'],
      shortlisted: false,
      status: 'ACTIVE',
    },
    {
      id: 'cand-4',
      name: 'Vikram Sethi',
      role: 'DevOps & SRE Specialist',
      headline: 'Senior Cloud DevOps Engineer | Kubernetes, Terraform & AWS | 6 Years Experience',
      experience: '6.0 Years',
      location: 'Bengaluru, Karnataka',
      skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'CI/CD', 'Prometheus', 'Linux'],
      matchScore: 94,
      resumeName: 'Vikram_Sethi_DevOps.pdf',
      email: 'vikram.sethi@example.com',
      phone: '+91 97112 34567',
      education: 'B.E. in Electronics & Communication, RVCE Bengaluru (8.6 CGPA)',
      currentSalary: '₹19,00,000 / year',
      expectedSalary: '₹28,00,000 - ₹34,00,000 / year',
      workMode: 'Remote',
      availability: '30 Days Notice',
      summary: 'Infrastructure architect focused on automated multi-region deployments, security hardening, and zero-downtime upgrades.',
      projects: ['Automated GitOps Platform (ArgoCD)', 'Multi-Region Kubernetes Disaster Recovery'],
      certifications: ['AWS Certified DevOps Engineer – Professional', 'Certified Kubernetes Security Specialist (CKS)'],
      shortlisted: true,
      status: 'SHORTLISTED',
    },
    {
      id: 'cand-5',
      name: 'Sneha Kulkarni',
      role: 'UI/UX Product Designer & Design Systems Lead',
      headline: 'Senior Product Designer | Figma, Design Systems & Frontend UX | 4 Years Experience',
      experience: '4.0 Years',
      location: 'Pune, Maharashtra (Open to Bengaluru/Hyderabad)',
      skills: ['Figma', 'Design Systems', 'UI/UX Design', 'User Research', 'Prototyping', 'HTML/CSS'],
      matchScore: 89,
      resumeName: 'Sneha_Kulkarni_Design_Portfolio.pdf',
      email: 'sneha.kulkarni@example.com',
      phone: '+91 98220 12345',
      education: 'B.Des in Product Design, NID Ahmedabad',
      currentSalary: '₹15,00,000 / year',
      expectedSalary: '₹22,00,000 / year',
      workMode: 'Hybrid',
      availability: '15 Days',
      summary: 'Product designer specialized in B2B SaaS interfaces, accessible token design systems, and rapid prototyping.',
      projects: ['Enterprise Analytics Dashboard Design', 'Mobile POS Design System'],
      certifications: ['NN/g UX Master Certified', 'Interaction Design Foundation Lead'],
      shortlisted: false,
      status: 'ACTIVE',
    },
  ],

  // Applications received
  applications: [
    {
      id: 'app-501',
      candidateId: 'cand-1',
      candidateName: 'Priya Sharma',
      candidateEmail: 'priya.sharma@example.com',
      candidatePhone: '+91 98765 43210',
      jobId: 'job-101',
      jobTitle: 'Senior Frontend Engineer (React / TypeScript)',
      experience: '4.2 Years',
      location: 'Visakhapatnam, AP',
      skills: ['React.js', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Tailwind CSS'],
      matchScore: 95,
      appliedDate: '02 Sept 2026',
      status: 'SHORTLISTED',
      resumeName: 'Priya_Sharma_Resume.pdf',
      coverNote: 'I have 4+ years of hands-on experience building performant frontend architectures at scale. I led the micro-frontend migration and would love to contribute to ABC Technologies.',
      currentSalary: '₹14.5 LPA',
      expectedSalary: '₹22.0 LPA',
      noticePeriod: '15 Days',
      timeline: [
        { stage: 'Applied', date: '02 Sept 2026', completed: true },
        { stage: 'Screening', date: '03 Sept 2026', completed: true },
        { stage: 'Shortlisted', date: '04 Sept 2026', completed: true, current: true },
        { stage: 'Interview', date: '10 Sept 2026 (11:00 AM)', completed: false },
        { stage: 'Selected', date: 'Pending', completed: false },
      ]
    },
    {
      id: 'app-502',
      candidateId: 'cand-2',
      candidateName: 'Rahul Kumar',
      candidateEmail: 'rahul.kumar@example.com',
      candidatePhone: '+91 91234 56789',
      jobId: 'job-102',
      jobTitle: 'Senior Python & Cloud Backend Developer',
      experience: '3.5 Years',
      location: 'Vijayawada, AP',
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Redis'],
      matchScore: 92,
      appliedDate: '01 Sept 2026',
      status: 'INTERVIEW',
      resumeName: 'Rahul_Kumar_Python_Backend.pdf',
      coverNote: 'Experienced in high-throughput API architectures, asynchronous processing, and database optimization.',
      currentSalary: '₹11.0 LPA',
      expectedSalary: '₹18.0 LPA',
      noticePeriod: '30 Days',
      timeline: [
        { stage: 'Applied', date: '01 Sept 2026', completed: true },
        { stage: 'Screening', date: '02 Sept 2026', completed: true },
        { stage: 'Shortlisted', date: '03 Sept 2026', completed: true },
        { stage: 'Interview', date: '12 Sept 2026 (02:00 PM)', completed: true, current: true },
        { stage: 'Selected', date: 'Pending', completed: false },
      ]
    },
    {
      id: 'app-503',
      candidateId: 'cand-4',
      candidateName: 'Vikram Sethi',
      candidateEmail: 'vikram.sethi@example.com',
      candidatePhone: '+91 97112 34567',
      jobId: 'job-103',
      jobTitle: 'DevOps & Cloud Infrastructure Specialist',
      experience: '6.0 Years',
      location: 'Bengaluru, KA',
      skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'CI/CD'],
      matchScore: 94,
      appliedDate: '28 Aug 2026',
      status: 'SHORTLISTED',
      resumeName: 'Vikram_Sethi_DevOps.pdf',
      coverNote: 'Extensive background in multi-region Kubernetes clusters and automated CI/CD pipelines.',
      currentSalary: '₹19.0 LPA',
      expectedSalary: '₹30.0 LPA',
      noticePeriod: '30 Days',
      timeline: [
        { stage: 'Applied', date: '28 Aug 2026', completed: true },
        { stage: 'Screening', date: '30 Aug 2026', completed: true },
        { stage: 'Shortlisted', date: '01 Sept 2026', completed: true, current: true },
        { stage: 'Interview', date: 'Pending Schedule', completed: false },
        { stage: 'Selected', date: 'Pending', completed: false },
      ]
    },
    {
      id: 'app-504',
      candidateId: 'cand-3',
      candidateName: 'Kavita Reddy',
      candidateEmail: 'kavita.reddy@example.com',
      candidatePhone: '+91 98451 23456',
      jobId: 'job-101',
      jobTitle: 'Senior Frontend Engineer (React / TypeScript)',
      experience: '5.0 Years',
      location: 'Hyderabad, TS',
      skills: ['Java', 'Spring Boot', 'React.js', 'PostgreSQL'],
      matchScore: 88,
      appliedDate: '26 Aug 2026',
      status: 'SCREENING',
      resumeName: 'Kavita_Reddy_FullStack.pdf',
      coverNote: 'Full stack engineer with solid React and Java backend foundations.',
      currentSalary: '₹16.0 LPA',
      expectedSalary: '₹24.0 LPA',
      noticePeriod: 'Immediate',
      timeline: [
        { stage: 'Applied', date: '26 Aug 2026', completed: true },
        { stage: 'Screening', date: '29 Aug 2026', completed: true, current: true },
        { stage: 'Shortlisted', date: 'Pending', completed: false },
        { stage: 'Interview', date: 'Pending', completed: false },
        { stage: 'Selected', date: 'Pending', completed: false },
      ]
    },
    {
      id: 'app-505',
      candidateId: 'cand-5',
      candidateName: 'Sneha Kulkarni',
      candidateEmail: 'sneha.kulkarni@example.com',
      candidatePhone: '+91 98220 12345',
      jobId: 'job-101',
      jobTitle: 'Senior Frontend Engineer (React / TypeScript)',
      experience: '4.0 Years',
      location: 'Pune, MH',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'HTML/CSS'],
      matchScore: 78,
      appliedDate: '20 Aug 2026',
      status: 'REJECTED',
      resumeName: 'Sneha_Kulkarni_Design_Portfolio.pdf',
      coverNote: 'Specialist in Design Systems and UI Engineering.',
      currentSalary: '₹15.0 LPA',
      expectedSalary: '₹22.0 LPA',
      noticePeriod: '15 Days',
      timeline: [
        { stage: 'Applied', date: '20 Aug 2026', completed: true },
        { stage: 'Screening', date: '22 Aug 2026', completed: true },
        { stage: 'Rejected', date: '24 Aug 2026', completed: true, current: true },
      ]
    },
  ],

  // Interviews
  interviews: [
    {
      id: 'int-1',
      candidateName: 'Priya Sharma',
      candidateEmail: 'priya.sharma@example.com',
      jobTitle: 'Senior Frontend Engineer (React / TypeScript)',
      date: '2026-09-10',
      time: '11:00 AM - 12:00 PM IST',
      mode: 'Online (Google Meet)',
      meetingLink: 'https://meet.google.com/abc-priya-fe',
      interviewer: 'Arjun Reddy & Deepak Verma (Architect)',
      status: 'SCHEDULED',
      notes: 'Round 1: Component design system, React 19 features, state management, and code challenge.'
    },
    {
      id: 'int-2',
      candidateName: 'Rahul Kumar',
      candidateEmail: 'rahul.kumar@example.com',
      jobTitle: 'Senior Python & Cloud Backend Developer',
      date: '2026-09-12',
      time: '02:00 PM - 03:00 PM IST',
      mode: 'Online (Google Meet)',
      meetingLink: 'https://meet.google.com/abc-rahul-py',
      interviewer: 'Arjun Reddy & Vikram Seth (VP Eng)',
      status: 'SCHEDULED',
      notes: 'Round 1: FastAPI async workers, database indexing, caching strategies, and concurrency.'
    },
    {
      id: 'int-3',
      candidateName: 'Vikram Sethi',
      candidateEmail: 'vikram.sethi@example.com',
      jobTitle: 'DevOps & Cloud Infrastructure Specialist',
      date: '2026-08-25',
      time: '04:00 PM - 05:00 PM IST',
      mode: 'Online (MS Teams)',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/abc-vikram',
      interviewer: 'Arjun Reddy',
      status: 'COMPLETED',
      notes: 'Cleared technical screening with 9.2/10. Recommended for Senior Director offer stage.'
    }
  ],

  // Internships
  internships: [
    {
      id: 'intern-1',
      title: 'Frontend React Development Intern',
      stipend: '₹25,000 / month',
      duration: '6 Months',
      workMode: 'Hybrid',
      location: 'Bengaluru, Karnataka',
      applicantsCount: 42,
      openings: 4,
      status: 'PUBLISHED',
      postedOn: '2026-08-16',
      description: 'Hands-on frontend development internship working on React, TypeScript, and modern UI components.'
    },
    {
      id: 'intern-2',
      title: 'Cloud Infrastructure & DevOps Intern',
      stipend: '₹30,000 / month',
      duration: '6 Months',
      workMode: 'On-site',
      location: 'Hyderabad, Telangana',
      applicantsCount: 28,
      openings: 2,
      status: 'PUBLISHED',
      postedOn: '2026-08-19',
      description: 'Learn Terraform, Docker, Kubernetes, and AWS automation alongside senior DevOps engineers.'
    },
    {
      id: 'intern-3',
      title: 'AI & Data Science Engineering Intern',
      stipend: '₹28,000 / month',
      duration: '6 Months',
      workMode: 'Remote',
      location: 'Remote (India)',
      applicantsCount: 19,
      openings: 2,
      status: 'PENDING',
      postedOn: '2026-08-25',
      description: 'Train and fine-tune transformer models and build automated Python evaluation pipelines.'
    }
  ],

  // Job Melas
  jobMelas: [
    {
      id: 'mela-1',
      title: 'Bengaluru Mega IT & Cloud Career Expo 2026',
      city: 'Bengaluru',
      state: 'Karnataka',
      venue: 'BIEC Exhibition Grounds, Tumkur Road, Hall 3',
      date: '2026-09-18',
      time: '09:00 AM - 06:00 PM IST',
      participationStatus: 'APPROVED',
      boothNumber: 'Booth B-14 (Hall 3, Premium Corporate Stall)',
      registeredCandidatesAtBooth: 142,
      spotInterviewsConducted: 38,
      spotOffersGiven: 8,
      showcasedPositions: ['Senior Frontend Engineer', 'Python Cloud Developer', 'DevOps Specialist'],
      candidatesQueue: [
        { id: '1', name: 'Priya Sharma', role: 'Senior Frontend Engineer', token: 'T-042', status: 'INTERVIEWED', match: '95%' },
        { id: '2', name: 'Rahul Kumar', role: 'Python Cloud Developer', token: 'T-043', status: 'IN_QUEUE', match: '92%' },
        { id: '3', name: 'Kiran Rao', role: 'DevOps Specialist', token: 'T-044', status: 'OFFERED', match: '94%' },
      ]
    },
    {
      id: 'mela-2',
      title: 'AP Mega IT & Engineering Job Mela 2026',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      venue: 'AU Convention Center, Beach Road',
      date: '2026-10-05',
      time: '09:00 AM - 05:30 PM IST',
      participationStatus: 'PENDING',
      boothNumber: 'Stall Allocation in Progress',
      registeredCandidatesAtBooth: 0,
      spotInterviewsConducted: 0,
      spotOffersGiven: 0,
      showcasedPositions: ['Full Stack Developer', 'Cloud Security Architect'],
      candidatesQueue: []
    }
  ],

  // Analytics Metrics
  analytics: {
    jobsPosted: 5,
    totalApplications: 167,
    screened: 112,
    shortlisted: 38,
    interviews: 12,
    selectedHired: 6,
    avgTimeToHire: '18 Days',
    offerAcceptanceRate: '88.5%',
    funnel: [
      { stage: '1. Applications Received', count: 167, pct: '100%', color: '#3b82f6' },
      { stage: '2. Profile Screening', count: 112, pct: '67.1%', color: '#6366f1' },
      { stage: '3. Shortlisted for Round', count: 38, pct: '22.8%', color: '#8b5cf6' },
      { stage: '4. Technical Interviews', count: 12, pct: '7.2%', color: '#f59e0b' },
      { stage: '5. Offers Released / Hired', count: 6, pct: '3.6%', color: '#10b981' },
    ],
    applicationTrends: [
      { month: 'May 2026', applicants: 45, hires: 2 },
      { month: 'Jun 2026', applicants: 78, hires: 3 },
      { month: 'Jul 2026', applicants: 124, hires: 4 },
      { month: 'Aug 2026', applicants: 167, hires: 6 },
    ],
    jobPerformance: [
      { title: 'Senior Frontend Engineer', views: 1840, applicants: 78, conversion: '4.2%' },
      { title: 'Python Cloud Developer', views: 1220, applicants: 45, conversion: '3.7%' },
      { title: 'DevOps & SRE Specialist', views: 890, applicants: 32, conversion: '3.6%' },
      { title: 'AI / ML Engineer', views: 410, applicants: 12, conversion: '2.9%' },
    ]
  },

  // Recruiter Settings
  settings: {
    applicantAlerts: true,
    interviewAlerts: true,
    jobMelaAlerts: true,
    weeklyDigest: true,
    teamMembers: [
      { id: 'tm-1', name: 'Pooja Nair', email: 'pooja.nair@example.com', role: 'Technical Recruiter', status: 'ACTIVE' },
      { id: 'tm-2', name: 'Karthik Varma', email: 'karthik.varma@example.com', role: 'Hiring Lead', status: 'ACTIVE' },
      { id: 'tm-3', name: 'Deepak Verma', email: 'deepak.verma@example.com', role: 'Interview Panelist', status: 'ACTIVE' },
    ]
  }
};

// ─── RECRUITER 2 SEED DATA: Sneha Rao (Tech Solutions) ─────────────────────
const RECRUITER_2_DATA = {
  id: 'rec-2',
  email: 'recruiter2@ntrvikasa.com',
  name: 'Sneha Rao',
  role: 'recruiter',
  designation: 'Head of People & University Talent',
  phone: '+91 91234 88776',
  avatar: 'S',

  company: {
    name: 'Tech Solutions Global Ltd',
    tagline: 'Building next-generation fintech architectures, AI platforms, and enterprise microservices.',
    description: 'Tech Solutions is an enterprise innovation powerhouse delivering mission-critical financial platforms, automated compliance workflows, and cloud-native solutions to multinational banks and tier-1 fintech startups.',
    industry: 'Fintech & Banking Technology',
    size: '500-1000 employees',
    employeesCount: '850+',
    foundedYear: '2018',
    website: 'https://techsolutions.example.com',
    email: 'hiring@techsolutions.example.com',
    phone: '+91 40 6820 4000',
    location: 'Hyderabad, Telangana (Offices in Visakhapatnam & Pune)',
    address: 'Floor 9, Cyber Towers, Hitec City, Madhapur, Hyderabad 500081',
    cinNumber: 'U72900TG2018PTC099142',
    gstNumber: '36ABCDE9876F1Z2',
    verified: true,
    activeJobsCount: 4,
    internshipsCount: 2,
  },

  jobs: [
    {
      id: 'job-201',
      title: 'Full Stack UI Architect (React / Node.js)',
      department: 'Fintech Core',
      type: 'Full-time',
      workMode: 'Hybrid',
      location: 'Hyderabad, Telangana',
      experience: '4-8 years',
      salary: '₹18,00,000 - ₹28,00,000 / year',
      applicantsCount: 64,
      shortlistedCount: 11,
      interviewsCount: 4,
      hiredCount: 1,
      status: 'PUBLISHED',
      createdAt: '2026-08-16',
      deadline: '2026-09-28',
      openings: 2,
      description: 'Lead banking payment gateway UI architectures, design systems, and secure transaction pipelines.',
      responsibilities: '• Architect high-availability financial dashboards.\n• Implement banking grade security and tokenization.\n• Guide team in React, Node, and TypeScript best practices.',
      requirements: '• 4+ years of Fullstack JavaScript/TypeScript experience.\n• Experience with React, Node.js, Next.js, and Redis.',
      qualifications: "Bachelor's Degree in CS/IT.",
      skills: ['React.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Tailwind CSS']
    },
    {
      id: 'job-202',
      title: 'Cloud Data Engineer (Python / Snowflake / Kafka)',
      department: 'Data Platform',
      type: 'Full-time',
      workMode: 'Remote',
      location: 'Remote (India)',
      experience: '3-6 years',
      salary: '₹16,00,000 - ₹25,00,000 / year',
      applicantsCount: 38,
      shortlistedCount: 8,
      interviewsCount: 3,
      hiredCount: 1,
      status: 'PUBLISHED',
      createdAt: '2026-08-19',
      deadline: '2026-10-05',
      openings: 2,
      description: 'Build real-time financial fraud detection streams, ETL data pipelines, and analytics warehouses.',
      responsibilities: '• Design streaming ETL pipelines in Kafka & Spark.\n• Optimize SQL queries and data schemas in Snowflake.',
      requirements: '• Strong Python, SQL, Kafka, and cloud data warehouse knowledge.',
      qualifications: "Bachelor's Degree in CS/IT.",
      skills: ['Python', 'Kafka', 'Snowflake', 'PostgreSQL', 'AWS', 'Spark']
    },
    {
      id: 'job-203',
      title: 'Cybersecurity & KYC Compliance Lead',
      department: 'Security & Risk',
      type: 'Full-time',
      workMode: 'Hybrid',
      location: 'Hyderabad, Telangana',
      experience: '5-9 years',
      salary: '₹22,00,000 - ₹34,00,000 / year',
      applicantsCount: 18,
      shortlistedCount: 4,
      interviewsCount: 2,
      hiredCount: 0,
      status: 'PUBLISHED',
      createdAt: '2026-08-22',
      deadline: '2026-10-15',
      openings: 1,
      description: 'Ensure PCI-DSS, ISO 27001, and RBI regulatory security frameworks across banking applications.',
      responsibilities: '• Conduct regular vulnerability assessments and penetration tests.\n• Lead audits with partner banks and financial regulators.',
      requirements: '• CISSP, CISA, or CEH certification with 5+ years in BFSI security.',
      qualifications: "Bachelor's or Master's in Cybersecurity.",
      skills: ['Cybersecurity', 'PCI-DSS', 'ISO 27001', 'Cloud Security', 'VAPT']
    }
  ],

  candidates: [
    {
      id: 'cand-1',
      name: 'Priya Sharma',
      role: 'Senior React & Frontend Developer',
      headline: 'Senior React & Frontend Developer | 4+ Years Experience | Visakhapatnam & Bengaluru',
      experience: '4.2 Years',
      location: 'Visakhapatnam, Andhra Pradesh',
      skills: ['React.js', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Jest', 'REST APIs'],
      matchScore: 94,
      resumeName: 'Priya_Sharma_Resume.pdf',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      education: 'B.Tech in Computer Science, Andhra University (8.7 CGPA)',
      currentSalary: '₹14,50,000 / year',
      expectedSalary: '₹20,00,000 - ₹24,00,000 / year',
      workMode: 'Hybrid / Remote',
      availability: 'Immediate (15 days notice)',
      summary: 'Passionate frontend engineer specialized in performant React architectures and design systems.',
      projects: ['NTR Vikasa Candidate Portal (React, Vite)', 'Enterprise Design System UI Kit'],
      certifications: ['Meta Certified Frontend Developer', 'AWS Cloud Practitioner'],
      shortlisted: true,
      status: 'SHORTLISTED',
    },
    {
      id: 'cand-2',
      name: 'Rahul Kumar',
      role: 'Senior Python & Cloud Backend Engineer',
      headline: 'Senior Python & Cloud Backend Developer | 3.5 Years Experience | Vijayawada & Hyderabad',
      experience: '3.5 Years',
      location: 'Vijayawada, Andhra Pradesh',
      skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Microservices'],
      matchScore: 96,
      resumeName: 'Rahul_Kumar_Python_Backend.pdf',
      email: 'rahul.kumar@example.com',
      phone: '+91 91234 56789',
      education: 'B.Tech in IT, VR Siddhartha Engineering College (8.4 CGPA)',
      currentSalary: '₹11,00,000 / year',
      expectedSalary: '₹16,00,000 - ₹20,00,000 / year',
      workMode: 'Hybrid / Remote',
      availability: '30 Days Notice',
      summary: 'Backend engineer specialized in Python, FastAPI, Django, PostgreSQL, and AWS microservices.',
      projects: ['High-Throughput API Rate Limiter', 'Distributed Telemetry Pipeline'],
      certifications: ['AWS Certified Solutions Architect – Associate', 'CKA'],
      shortlisted: true,
      status: 'SHORTLISTED',
    },
  ],

  applications: [
    {
      id: 'app-601',
      candidateId: 'cand-1',
      candidateName: 'Priya Sharma',
      candidateEmail: 'priya.sharma@example.com',
      candidatePhone: '+91 98765 43210',
      jobId: 'job-201',
      jobTitle: 'Full Stack UI Architect (React / Node.js)',
      experience: '4.2 Years',
      location: 'Visakhapatnam, AP',
      skills: ['React.js', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Tailwind CSS'],
      matchScore: 94,
      appliedDate: '01 Sept 2026',
      status: 'SHORTLISTED',
      resumeName: 'Priya_Sharma_Resume.pdf',
      coverNote: 'Interested in leading the payment UI architecture at Tech Solutions.',
      currentSalary: '₹14.5 LPA',
      expectedSalary: '₹22.0 LPA',
      noticePeriod: '15 Days',
      timeline: [
        { stage: 'Applied', date: '01 Sept 2026', completed: true },
        { stage: 'Screening', date: '02 Sept 2026', completed: true },
        { stage: 'Shortlisted', date: '03 Sept 2026', completed: true, current: true },
        { stage: 'Interview', date: '11 Sept 2026 (03:00 PM)', completed: false },
        { stage: 'Selected', date: 'Pending', completed: false },
      ]
    },
    {
      id: 'app-602',
      candidateId: 'cand-2',
      candidateName: 'Rahul Kumar',
      candidateEmail: 'rahul.kumar@example.com',
      candidatePhone: '+91 91234 56789',
      jobId: 'job-202',
      jobTitle: 'Cloud Data Engineer (Python / Snowflake / Kafka)',
      experience: '3.5 Years',
      location: 'Vijayawada, AP',
      skills: ['Python', 'PostgreSQL', 'Docker', 'AWS', 'Kafka'],
      matchScore: 96,
      appliedDate: '30 Aug 2026',
      status: 'INTERVIEW',
      resumeName: 'Rahul_Kumar_Python_Backend.pdf',
      coverNote: 'Strong experience in real-time event streaming and high-scale databases.',
      currentSalary: '₹11.0 LPA',
      expectedSalary: '₹19.0 LPA',
      noticePeriod: '30 Days',
      timeline: [
        { stage: 'Applied', date: '30 Aug 2026', completed: true },
        { stage: 'Screening', date: '31 Aug 2026', completed: true },
        { stage: 'Shortlisted', date: '01 Sept 2026', completed: true },
        { stage: 'Interview', date: '14 Sept 2026 (11:30 AM)', completed: true, current: true },
        { stage: 'Selected', date: 'Pending', completed: false },
      ]
    },
  ],

  interviews: [
    {
      id: 'int-201',
      candidateName: 'Priya Sharma',
      candidateEmail: 'priya.sharma@example.com',
      jobTitle: 'Full Stack UI Architect (React / Node.js)',
      date: '2026-09-11',
      time: '03:00 PM - 04:00 PM IST',
      mode: 'Online (Google Meet)',
      meetingLink: 'https://meet.google.com/techsolutions-priya',
      interviewer: 'Sneha Rao & Technical Lead',
      status: 'SCHEDULED',
      notes: 'Round 1: Payment UI architecture, secure tokenization, and live React system design.'
    },
    {
      id: 'int-202',
      candidateName: 'Rahul Kumar',
      candidateEmail: 'rahul.kumar@example.com',
      jobTitle: 'Cloud Data Engineer (Python / Snowflake / Kafka)',
      date: '2026-09-14',
      time: '11:30 AM - 12:30 PM IST',
      mode: 'Online (Zoom)',
      meetingLink: 'https://zoom.us/j/techsolutions-rahul',
      interviewer: 'Sneha Rao & Head of Data Engineering',
      status: 'SCHEDULED',
      notes: 'Round 1: Streaming pipelines, Kafka partitions, and data lake optimization.'
    },
  ],

  internships: [
    {
      id: 'intern-201',
      title: 'Fintech Full Stack Engineering Intern',
      stipend: '₹26,000 / month',
      duration: '6 Months',
      workMode: 'Hybrid',
      location: 'Hyderabad, Telangana',
      applicantsCount: 34,
      openings: 3,
      status: 'PUBLISHED',
      postedOn: '2026-08-20',
      description: 'Build responsive financial dashboards and API integration microservices.'
    }
  ],

  jobMelas: [
    {
      id: 'mela-201',
      title: 'Hyderabad Tech & Banking Drive 2026',
      city: 'Hyderabad',
      state: 'Telangana',
      venue: 'HITEX Exhibition Center, Hitec City',
      date: '2026-09-24',
      time: '09:00 AM - 06:00 PM IST',
      participationStatus: 'APPROVED',
      boothNumber: 'Stall H-08 (Hall 2)',
      registeredCandidatesAtBooth: 98,
      spotInterviewsConducted: 24,
      spotOffersGiven: 5,
      showcasedPositions: ['Full Stack UI Architect', 'Cloud Data Engineer'],
      candidatesQueue: [
        { id: '1', name: 'Rahul Kumar', role: 'Cloud Data Engineer', token: 'T-018', status: 'INTERVIEWED', match: '96%' },
      ]
    }
  ],

  analytics: {
    jobsPosted: 3,
    totalApplications: 120,
    screened: 84,
    shortlisted: 28,
    interviews: 8,
    selectedHired: 4,
    avgTimeToHire: '16 Days',
    offerAcceptanceRate: '92.0%',
    funnel: [
      { stage: '1. Applications Received', count: 120, pct: '100%', color: '#3b82f6' },
      { stage: '2. Profile Screening', count: 84, pct: '70.0%', color: '#6366f1' },
      { stage: '3. Shortlisted for Round', count: 28, pct: '23.3%', color: '#8b5cf6' },
      { stage: '4. Technical Interviews', count: 8, pct: '6.7%', color: '#f59e0b' },
      { stage: '5. Offers Released / Hired', count: 4, pct: '3.3%', color: '#10b981' },
    ],
    applicationTrends: [
      { month: 'Jun 2026', applicants: 50, hires: 1 },
      { month: 'Jul 2026', applicants: 85, hires: 2 },
      { month: 'Aug 2026', applicants: 120, hires: 4 },
    ],
    jobPerformance: [
      { title: 'Full Stack UI Architect', views: 1420, applicants: 64, conversion: '4.5%' },
      { title: 'Cloud Data Engineer', views: 980, applicants: 38, conversion: '3.9%' },
      { title: 'Cybersecurity & KYC Lead', views: 430, applicants: 18, conversion: '4.2%' },
    ]
  },

  settings: {
    applicantAlerts: true,
    interviewAlerts: true,
    jobMelaAlerts: true,
    weeklyDigest: true,
    teamMembers: [
      { id: 'tm-201', name: 'Rohit Sharma', email: 'rohit.sharma@techsolutions.example.com', role: 'Technical Recruiter', status: 'ACTIVE' },
      { id: 'tm-202', name: 'Priya Nair', email: 'priya.nair@techsolutions.example.com', role: 'Hiring Manager', status: 'ACTIVE' },
    ]
  }
};

// ─── SEED USERS ACCOUNTS ──────────────────────────────────────────────────
const SEED_USERS = [
  {
    id: 'user-arjun',
    name: 'Arjun Reddy',
    email: 'recruiter1@ntrvikasa.com',
    password: 'password123',
    role: 'recruiter',
    teamRole: 'Technical Recruiter',
    designation: 'Director of Talent Acquisition',
    phone: '+91 98765 00112',
    avatar: 'A',
    companyId: 'rec-1',
    status: 'ACTIVE',
    createdAt: '2026-08-01',
  },
  {
    id: 'user-pooja',
    name: 'Pooja Nair',
    email: 'pooja.nair@example.com',
    password: 'password123',
    role: 'recruiter',
    teamRole: 'Technical Recruiter',
    designation: 'Technical Recruiter',
    phone: '+91 98765 00113',
    avatar: 'P',
    companyId: 'rec-1',
    status: 'ACTIVE',
    createdAt: '2026-08-10',
  },
  {
    id: 'user-karthik',
    name: 'Karthik Varma',
    email: 'karthik.varma@example.com',
    password: 'password123',
    role: 'recruiter',
    teamRole: 'Hiring Lead',
    designation: 'Hiring Lead',
    phone: '+91 98765 00114',
    avatar: 'K',
    companyId: 'rec-1',
    status: 'ACTIVE',
    createdAt: '2026-08-12',
  },
  {
    id: 'user-sneha',
    name: 'Sneha Rao',
    email: 'recruiter2@ntrvikasa.com',
    password: 'password123',
    role: 'recruiter',
    teamRole: 'Technical Recruiter',
    designation: 'Head of People & University Talent',
    phone: '+91 91234 88776',
    avatar: 'S',
    companyId: 'rec-2',
    status: 'ACTIVE',
    createdAt: '2026-08-01',
  },
  {
    id: 'user-rohit',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@techsolutions.example.com',
    password: 'password123',
    role: 'recruiter',
    teamRole: 'Technical Recruiter',
    designation: 'Technical Recruiter',
    phone: '+91 91234 88777',
    avatar: 'R',
    companyId: 'rec-2',
    status: 'ACTIVE',
    createdAt: '2026-08-15',
  },
  {
    id: 'user-priya',
    name: 'Priya Nair',
    email: 'priya.nair@techsolutions.example.com',
    password: 'password123',
    role: 'recruiter',
    teamRole: 'Hiring Manager',
    designation: 'Hiring Manager',
    phone: '+91 91234 88778',
    avatar: 'P',
    companyId: 'rec-2',
    status: 'ACTIVE',
    createdAt: '2026-08-18',
  }
];

// ─── SEED INVITATIONS ──────────────────────────────────────────────────────
const SEED_INVITATIONS = [
  {
    token: 'inv_demo_ravi_101',
    name: 'Ravi Kumar',
    email: 'ravi@abctech.com',
    role: 'Interview Panelist',
    companyId: 'rec-1',
    companyName: 'ABC Technologies Pvt Ltd',
    inviterId: 'user-arjun',
    inviterName: 'Arjun Reddy',
    status: 'INVITED',
    invitedAt: '2026-08-28',
    expiresAt: '2026-09-30',
  }
];

const RecruiterContext = createContext(null);

export function RecruiterProvider({ children }) {
  // 1. Companies Dataset
  const [companiesData, setCompaniesData] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_companies_data_v5') || localStorage.getItem('ntr_recruiter_data_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed['rec-1'] && parsed['rec-2']) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return {
      'rec-1': RECRUITER_1_DATA,
      'rec-2': RECRUITER_2_DATA,
    };
  });

  // 2. User Accounts Dataset (Separate user accounts for recruiters in each company)
  const [userAccounts, setUserAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_recruiter_users_v5');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_USERS;
  });

  // 3. Invitations Dataset
  const [invitations, setInvitations] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_invitations_v5');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return SEED_INVITATIONS;
  });

  // 4. Current Active User ID (Default 'user-arjun')
  const [activeUserId, setActiveUserId] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_active_user_id_v5');
      if (stored) return stored;
    } catch (e) {
      // ignore
    }
    return 'user-arjun';
  });

  // 5. Is Recruiter Logged In
  const [isRecruiterLoggedIn, setIsRecruiterLoggedIn] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_recruiter_logged_in');
      return stored === 'true';
    } catch (e) {
      return false;
    }
  });

  // Persist all state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ntr_companies_data_v5', JSON.stringify(companiesData));
      localStorage.setItem('ntr_recruiter_users_v5', JSON.stringify(userAccounts));
      localStorage.setItem('ntr_invitations_v5', JSON.stringify(invitations));
      localStorage.setItem('ntr_active_user_id_v5', activeUserId);
      localStorage.setItem('ntr_recruiter_logged_in', String(isRecruiterLoggedIn));
    } catch (e) {
      // ignore
    }
  }, [companiesData, userAccounts, invitations, activeUserId, isRecruiterLoggedIn]);

  // Derive Current User and Current Company
  const currentUser = userAccounts.find(u => u.id === activeUserId) || userAccounts[0] || SEED_USERS[0];
  const activeCompanyId = currentUser.companyId || 'rec-1';
  const currentCompany = companiesData[activeCompanyId] || RECRUITER_1_DATA;

  // Composite Recruiter object for backward-compatibility across all recruiter pages
  const currentRecruiter = {
    ...currentCompany,
    id: currentUser.id,
    userId: currentUser.id,
    companyId: activeCompanyId,
    name: currentUser.name,
    email: currentUser.email,
    role: 'recruiter',
    teamRole: currentUser.teamRole || 'Technical Recruiter',
    designation: currentUser.designation || currentUser.teamRole || 'Recruiter',
    phone: currentUser.phone || currentCompany.phone || '+91 98765 00112',
    avatar: currentUser.avatar || currentUser.name?.[0]?.toUpperCase() || 'R',
    company: currentCompany.company,
    jobs: currentCompany.jobs || [],
    applications: currentCompany.applications || [],
    candidates: currentCompany.candidates || [],
    interviews: currentCompany.interviews || [],
    internships: currentCompany.internships || [],
    jobMelas: currentCompany.jobMelas || [],
    analytics: currentCompany.analytics || {},
    settings: currentCompany.settings || {},
  };

  // Helper to update current company dataset
  const updateRecruiter = (updater) => {
    setCompaniesData((prev) => {
      const comp = prev[activeCompanyId] || RECRUITER_1_DATA;
      const updated = typeof updater === 'function' ? updater(comp) : { ...comp, ...updater };
      return {
        ...prev,
        [activeCompanyId]: updated
      };
    });
  };

  // Login handler with support for individual user accounts
  const loginRecruiter = (email, enteredPassword) => {
    const cleanEmail = email?.trim().toLowerCase();
    
    // Find matching user account
    const matchedUser = userAccounts.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (matchedUser) {
      setActiveUserId(matchedUser.id);
      setIsRecruiterLoggedIn(true);
      return {
        success: true,
        user: matchedUser,
        company: companiesData[matchedUser.companyId]?.company
      };
    }

    // Fallback based on email substring (e.g. recruiter2 -> Sneha, recruiter1 -> Arjun)
    if (cleanEmail?.includes('recruiter2') || cleanEmail?.includes('sneha') || cleanEmail?.includes('tech')) {
      const snehaUser = userAccounts.find(u => u.id === 'user-sneha') || SEED_USERS[3];
      setActiveUserId(snehaUser.id);
      setIsRecruiterLoggedIn(true);
      return { success: true, user: snehaUser, company: companiesData['rec-2']?.company };
    }

    const arjunUser = userAccounts.find(u => u.id === 'user-arjun') || SEED_USERS[0];
    setActiveUserId(arjunUser.id);
    setIsRecruiterLoggedIn(true);
    return { success: true, user: arjunUser, company: companiesData['rec-1']?.company };
  };

  // Logout handler
  const logoutRecruiter = () => {
    setIsRecruiterLoggedIn(false);
  };

  // Switch Recruiter Demo helper
  const switchRecruiter = (identifier) => {
    if (identifier === 'rec-1' || identifier === 'user-arjun') {
      setActiveUserId('user-arjun');
      setIsRecruiterLoggedIn(true);
    } else if (identifier === 'rec-2' || identifier === 'user-sneha') {
      setActiveUserId('user-sneha');
      setIsRecruiterLoggedIn(true);
    } else if (identifier === 'user-pooja') {
      setActiveUserId('user-pooja');
      setIsRecruiterLoggedIn(true);
    } else {
      const target = userAccounts.find(u => u.id === identifier || u.email.toLowerCase() === identifier.toLowerCase());
      if (target) {
        setActiveUserId(target.id);
        setIsRecruiterLoggedIn(true);
      }
    }
  };

  // ── INVITATION SYSTEM METHODS ──────────────────────────────────────────────

  // 1. Invite a Team Member
  const inviteTeamMember = (memberData) => {
    const emailToInvite = memberData.email?.trim().toLowerCase();
    const companyTeam = currentCompany.settings?.teamMembers || [];

    // Check duplicate email in the current company's team
    const isDuplicateTeam = companyTeam.some(
      (m) => m.email?.trim().toLowerCase() === emailToInvite
    );
    const isDuplicateUser = userAccounts.some(
      (u) => u.companyId === activeCompanyId && u.email.toLowerCase() === emailToInvite
    );

    if (isDuplicateTeam || isDuplicateUser) {
      return { success: false, error: 'This email is already a member of your hiring team.' };
    }

    // Generate secure unique token
    const token = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Create invitation record
    const newInvitation = {
      token,
      name: memberData.name.trim(),
      email: memberData.email.trim(),
      role: memberData.role || 'Technical Recruiter',
      companyId: activeCompanyId,
      companyName: currentCompany.company?.name || 'Company',
      inviterId: currentUser.id,
      inviterName: currentUser.name,
      status: 'INVITED',
      invitedAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    // New Team Member record in Company Settings
    const newTeamMember = {
      id: `tm-${Date.now()}`,
      name: memberData.name.trim(),
      email: memberData.email.trim(),
      role: memberData.role || 'Technical Recruiter',
      status: 'INVITED',
      invitationToken: token,
      invitedAt: new Date().toISOString().split('T')[0],
      companyId: activeCompanyId,
      companyName: currentCompany.company?.name || 'Company',
    };

    // Update invitations store
    setInvitations((prev) => [newInvitation, ...prev]);

    // Update company team members
    updateRecruiter((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        teamMembers: [newTeamMember, ...(prev.settings?.teamMembers || [])],
      },
    }));

    return {
      success: true,
      invitationToken: token,
      invitation: newInvitation,
      member: newTeamMember
    };
  };

  // 2. Get Invitation by Token
  const getInvitationByToken = (token) => {
    if (!token) return { valid: false, reason: 'Invalid token.' };

    const inv = invitations.find((i) => i.token === token);
    if (!inv) {
      return { valid: false, reason: 'Invitation not found or link has expired.' };
    }

    if (inv.status === 'ACCEPTED') {
      return { valid: false, invitation: inv, reason: 'This invitation has already been accepted.' };
    }

    if (inv.status === 'EXPIRED') {
      return { valid: false, invitation: inv, reason: 'This invitation has expired. Please ask your team administrator to send a new invitation.' };
    }

    return { valid: true, invitation: inv };
  };

  // 3. Accept Invitation & Create Individual User Account
  const acceptInvitation = ({ token, password }) => {
    const check = getInvitationByToken(token);
    if (!check.valid || !check.invitation) {
      return { success: false, error: check.reason || 'Invalid invitation.' };
    }

    const inv = check.invitation;
    const cleanEmail = inv.email.trim().toLowerCase();

    // Create new separate User Account
    const newUserId = `user-${Date.now()}`;
    const newUser = {
      id: newUserId,
      name: inv.name,
      email: inv.email,
      password: password || 'password123',
      role: 'recruiter',
      teamRole: inv.role,
      designation: inv.role,
      phone: '+91 98000 00000',
      avatar: inv.name[0]?.toUpperCase() || 'U',
      companyId: inv.companyId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    // 1. Add to User Accounts
    setUserAccounts((prev) => [...prev, newUser]);

    // 2. Update Invitation status
    setInvitations((prev) =>
      prev.map((i) => (i.token === token ? { ...i, status: 'ACCEPTED', acceptedAt: new Date().toISOString() } : i))
    );

    // 3. Update Company Team Member status to ACTIVE
    setCompaniesData((prev) => {
      const targetCompany = prev[inv.companyId] || RECRUITER_1_DATA;
      const updatedMembers = (targetCompany.settings?.teamMembers || []).map((m) => {
        if (m.invitationToken === token || m.email?.toLowerCase() === cleanEmail) {
          return { ...m, status: 'ACTIVE', role: inv.role, acceptedAt: new Date().toISOString() };
        }
        return m;
      });

      return {
        ...prev,
        [inv.companyId]: {
          ...targetCompany,
          settings: {
            ...targetCompany.settings,
            teamMembers: updatedMembers,
          }
        }
      };
    });

    // 4. Set Active User to this new user and log them in
    setActiveUserId(newUserId);
    setIsRecruiterLoggedIn(true);

    return {
      success: true,
      user: newUser,
      company: companiesData[inv.companyId]?.company
    };
  };

  // 4. Remove Team Member
  const removeTeamMember = (memberId) => {
    updateRecruiter((prev) => {
      const removedMember = (prev.settings?.teamMembers || []).find((m) => m.id === memberId);
      const updatedMembers = (prev.settings?.teamMembers || []).filter((m) => m.id !== memberId);

      // Also clean up pending invitations if any
      if (removedMember?.email) {
        setInvitations((invPrev) =>
          invPrev.filter((i) => i.email.toLowerCase() !== removedMember.email.toLowerCase())
        );
      }

      return {
        ...prev,
        settings: {
          ...prev.settings,
          teamMembers: updatedMembers,
        },
      };
    });
  };

  // ── RECRUITMENT OPERATIONS ─────────────────────────────────────────────────

  // Create Job (tagged with creator ID)
  const createJob = (jobData) => {
    const newJob = {
      id: `job-${Date.now()}`,
      applicantsCount: 0,
      shortlistedCount: 0,
      interviewsCount: 0,
      hiredCount: 0,
      status: jobData.status || 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser.id,
      creatorName: currentUser.name,
      ...jobData
    };
    updateRecruiter((prev) => ({
      ...prev,
      jobs: [newJob, ...prev.jobs],
      company: {
        ...prev.company,
        activeJobsCount: prev.company.activeJobsCount + 1
      }
    }));
    return newJob;
  };

  // Update Job
  const updateJob = (jobId, updatedFields) => {
    updateRecruiter((prev) => ({
      ...prev,
      jobs: prev.jobs.map(j => j.id === jobId ? { ...j, ...updatedFields } : j)
    }));
  };

  // Close Job
  const closeJob = (jobId) => {
    updateRecruiter((prev) => ({
      ...prev,
      jobs: prev.jobs.map(j => j.id === jobId ? { ...j, status: 'CLOSED' } : j)
    }));
  };

  // Create Internship
  const createInternship = (internshipData) => {
    const newIntern = {
      id: `intern-${Date.now()}`,
      applicantsCount: 0,
      status: 'PENDING',
      postedOn: new Date().toISOString().split('T')[0],
      createdBy: currentUser.id,
      creatorName: currentUser.name,
      ...internshipData
    };
    updateRecruiter((prev) => ({
      ...prev,
      internships: [newIntern, ...prev.internships],
      company: {
        ...prev.company,
        internshipsCount: prev.company.internshipsCount + 1
      }
    }));
    return newIntern;
  };

  // Shortlist candidate
  const shortlistCandidate = (candidateId, jobId) => {
    updateRecruiter((prev) => {
      const updatedCandidates = prev.candidates.map(c =>
        c.id === candidateId ? { ...c, shortlisted: true, status: 'SHORTLISTED' } : c
      );
      const updatedApps = prev.applications.map(a =>
        a.candidateId === candidateId ? { ...a, status: 'SHORTLISTED' } : a
      );
      return {
        ...prev,
        candidates: updatedCandidates,
        applications: updatedApps
      };
    });
  };

  // Reject candidate
  const rejectCandidate = (candidateId) => {
    updateRecruiter((prev) => ({
      ...prev,
      applications: prev.applications.map(a =>
        a.candidateId === candidateId ? { ...a, status: 'REJECTED' } : a
      )
    }));
  };

  // Schedule Interview
  const scheduleInterview = (interviewData) => {
    const newInterview = {
      id: `int-${Date.now()}`,
      status: 'SCHEDULED',
      scheduledBy: currentUser.id,
      scheduledByName: currentUser.name,
      ...interviewData
    };
    updateRecruiter((prev) => ({
      ...prev,
      interviews: [newInterview, ...prev.interviews],
      applications: prev.applications.map(a =>
        a.candidateId === interviewData.candidateId || a.candidateName === interviewData.candidateName
          ? { ...a, status: 'INTERVIEW' }
          : a
      )
    }));
    return newInterview;
  };

  // Reschedule Interview
  const rescheduleInterview = (interviewId, newSchedule) => {
    updateRecruiter((prev) => ({
      ...prev,
      interviews: prev.interviews.map(i =>
        i.id === interviewId ? { ...i, ...newSchedule, status: 'RESCHEDULED' } : i
      )
    }));
  };

  // Cancel Interview
  const cancelInterview = (interviewId) => {
    updateRecruiter((prev) => ({
      ...prev,
      interviews: prev.interviews.map(i =>
        i.id === interviewId ? { ...i, status: 'CANCELLED' } : i
      )
    }));
  };

  // Update Company Profile
  const updateCompanyProfile = (companyData) => {
    updateRecruiter((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        ...companyData
      }
    }));
  };

  // Register Job Mela
  const registerJobMela = (melaData) => {
    const newMela = {
      id: `mela-${Date.now()}`,
      participationStatus: 'PENDING',
      boothNumber: 'Awaiting Admin Allocation',
      registeredCandidatesAtBooth: 0,
      spotInterviewsConducted: 0,
      spotOffersGiven: 0,
      candidatesQueue: [],
      registeredBy: currentUser.id,
      ...melaData
    };
    updateRecruiter((prev) => ({
      ...prev,
      jobMelas: [newMela, ...prev.jobMelas]
    }));
  };

  // Update Settings
  const updateSettings = (settingsData) => {
    if (settingsData.profile) {
      // Also update currentUser in userAccounts
      setUserAccounts((prev) =>
        prev.map((u) => (u.id === activeUserId ? { ...u, ...settingsData.profile } : u))
      );
    }
    updateRecruiter((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settingsData
      }
    }));
  };

  // Summary statistics for company dashboard
  const stats = {
    activeJobs: currentRecruiter.jobs.filter(j => j.status === 'PUBLISHED').length,
    pendingJobs: currentRecruiter.jobs.filter(j => j.status === 'PENDING').length,
    totalApplicants: currentRecruiter.applications.length,
    shortlisted: currentRecruiter.applications.filter(a => a.status === 'SHORTLISTED').length,
    interviews: currentRecruiter.interviews.filter(i => i.status === 'SCHEDULED' || i.status === 'RESCHEDULED').length,
    selectedHired: currentRecruiter.applications.filter(a => a.status === 'SELECTED').length || 6,
  };

  return (
    <RecruiterContext.Provider
      value={{
        recruiter: currentRecruiter,
        currentUser,
        currentCompany,
        userAccounts,
        invitations,
        activeRecruiterId: activeCompanyId,
        activeUserId,
        isRecruiterLoggedIn,
        stats,
        loginRecruiter,
        logoutRecruiter,
        switchRecruiter,
        updateRecruiter,
        createJob,
        updateJob,
        closeJob,
        createInternship,
        shortlistCandidate,
        rejectCandidate,
        scheduleInterview,
        rescheduleInterview,
        cancelInterview,
        updateCompanyProfile,
        registerJobMela,
        updateSettings,
        inviteTeamMember,
        removeTeamMember,
        getInvitationByToken,
        acceptInvitation,
      }}
    >
      {children}
    </RecruiterContext.Provider>
  );
}

export function useRecruiter() {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error('useRecruiter must be used within a RecruiterProvider');
  }
  return context;
}

