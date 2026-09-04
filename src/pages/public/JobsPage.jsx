import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, MapPin, SlidersHorizontal, X, RotateCcw, Briefcase,
  DollarSign, Clock, Building2, GraduationCap, Sparkles, AlertCircle,
  Heart, ShieldCheck, ArrowRight, Filter, Check, Eye, ChevronDown
} from 'lucide-react';
import Pagination from '../../components/ui/Pagination';
import { EmptyState, ErrorState } from '../../components/ui/States';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import ApplyModal from '../../components/ui/ApplyModal';
import { useToast } from '../../context/ToastContext';
import { useAdmin, DEFAULT_JOBS_PAGE_CONTENT } from '../../context/AdminContext';
import { INDIAN_STATES, INDIAN_UNION_TERRITORIES } from '../../data/indiaLocations';
import {
  MOCK_JOBS,
  LOCATIONS,
  JOB_TYPES,
  WORK_MODES,
  EXPERIENCE_LEVELS,
  SALARY_RANGES,
  INDUSTRIES,
  EDUCATION_LEVELS,
  SKILL_OPTIONS,
  POSTED_DATES
} from '../../data/mockData';

// Extended realistic mock jobs list (10 jobs)
const EXTENDED_MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Python Developer',
    company: 'TechCorp India',
    verified: true,
    location: 'Hyderabad, Telangana',
    salary: '₹6 - ₹10 LPA',
    salaryMin: 6,
    salaryMax: 10,
    experience: '2-4 Years',
    type: 'Full-time',
    workMode: 'Hybrid',
    industry: 'Information Technology',
    skills: ['Python', 'FastAPI', 'SQL', 'PostgreSQL', 'Docker'],
    matchScore: 92,
    postedTime: 'Posted 2 days ago',
    featured: true,
    description: 'Lead backend microservices design using Python, FastAPI, and scalable PostgreSQL database clusters.'
  },
  {
    id: '2',
    title: 'Senior Frontend Engineer (React + TypeScript)',
    company: 'Flipkart',
    verified: true,
    location: 'Bengaluru, Karnataka',
    salary: '₹14 - ₹22 LPA',
    salaryMin: 14,
    salaryMax: 22,
    experience: '3-5 Years',
    type: 'Full-time',
    workMode: 'Hybrid',
    industry: 'E-Commerce & Retail',
    skills: ['React', 'TypeScript', 'Redux Toolkit', 'Next.js', 'Tailwind CSS'],
    matchScore: 96,
    postedTime: 'Posted 1 day ago',
    featured: true,
    description: 'Architect customer checkout journeys handling millions of peak requests with sub-second latency.'
  },
  {
    id: '3',
    title: 'Data & AI Engineer (Machine Learning)',
    company: 'Infosys',
    verified: true,
    location: 'Visakhapatnam, Andhra Pradesh',
    salary: '₹10 - ₹18 LPA',
    salaryMin: 10,
    salaryMax: 18,
    experience: '3-5 Years',
    type: 'Full-time',
    workMode: 'Remote',
    industry: 'Information Technology',
    skills: ['Python', 'Machine Learning', 'PyTorch', 'SQL', 'AWS'],
    matchScore: 89,
    postedTime: 'Posted 3 days ago',
    featured: false,
    description: 'Develop enterprise predictive pipelines and generative AI solutions for Fortune 500 enterprise clients.'
  },
  {
    id: '4',
    title: 'Full Stack Web Developer (MERN)',
    company: 'Swiggy',
    verified: true,
    location: 'Bengaluru, Karnataka',
    salary: '₹12 - ₹20 LPA',
    salaryMin: 12,
    salaryMax: 20,
    experience: '2-4 Years',
    type: 'Full-time',
    workMode: 'On-site',
    industry: 'Information Technology',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
    matchScore: 85,
    postedTime: 'Posted 4 days ago',
    featured: false,
    description: 'Build real-time delivery logistics telemetry portals and merchant dashboards.'
  },
  {
    id: '5',
    title: 'DevOps & Cloud Infrastructure Engineer',
    company: 'Wipro Technologies',
    verified: true,
    location: 'Hyderabad, Telangana',
    salary: '₹10 - ₹16 LPA',
    salaryMin: 10,
    salaryMax: 16,
    experience: '3-5 Years',
    type: 'Full-time',
    workMode: 'Hybrid',
    industry: 'Information Technology',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    matchScore: 88,
    postedTime: 'Posted 5 days ago',
    featured: false,
    description: 'Automate multi-region cloud provisioning and zero-downtime Kubernetes deployments.'
  },
  {
    id: '6',
    title: 'UI/UX Product Designer',
    company: 'Razorpay',
    verified: true,
    location: 'Bengaluru, Karnataka',
    salary: '₹8 - ₹14 LPA',
    salaryMin: 8,
    salaryMax: 14,
    experience: '1-3 years',
    type: 'Full-time',
    workMode: 'Hybrid',
    industry: 'Fintech & Banking',
    skills: ['UI/UX Design', 'Figma', 'Prototyping', 'Design Systems'],
    matchScore: 90,
    postedTime: 'Posted 1 day ago',
    featured: true,
    description: 'Design frictionless payment checkout interfaces and merchant onboarding workflows.'
  },
  {
    id: '7',
    title: 'Junior Software Engineer (Fresher)',
    company: 'Tata Consultancy Services (TCS)',
    verified: true,
    location: 'Vijayawada, Andhra Pradesh',
    salary: '₹3 - ₹6 LPA',
    salaryMin: 3,
    salaryMax: 6,
    experience: 'Fresher (0-1 yr)',
    type: 'Full-time',
    workMode: 'On-site',
    industry: 'Information Technology',
    skills: ['Java', 'SQL', 'JavaScript', 'HTML/CSS'],
    matchScore: 82,
    postedTime: 'Posted today',
    featured: false,
    description: 'Exciting entry-level software developer opening for 2025/2026 engineering graduates across Andhra Pradesh.'
  },
  {
    id: '8',
    title: 'Financial Analyst & Risk Modeler',
    company: 'HDFC Bank',
    verified: true,
    location: 'Visakhapatnam, Andhra Pradesh',
    salary: '₹6 - ₹10 LPA',
    salaryMin: 6,
    salaryMax: 10,
    experience: '1-3 years',
    type: 'Full-time',
    workMode: 'On-site',
    industry: 'Fintech & Banking',
    skills: ['Financial Modeling', 'SQL', 'Excel', 'Data Analysis'],
    matchScore: 78,
    postedTime: 'Posted 3 days ago',
    featured: false,
    description: 'Analyze commercial credit portfolios, risk stress-testing, and compliance metrics.'
  },
  {
    id: '9',
    title: 'Lead Product Manager',
    company: 'Zomato',
    verified: true,
    location: 'Gurugram, Haryana',
    salary: '₹28 - ₹42 LPA',
    salaryMin: 28,
    salaryMax: 42,
    experience: '5-8 years',
    type: 'Full-time',
    workMode: 'Hybrid',
    industry: 'Information Technology',
    skills: ['Product Management', 'SQL', 'Data Analytics', 'Roadmapping'],
    matchScore: 87,
    postedTime: 'Posted 6 days ago',
    featured: false,
    description: 'Own end-to-end customer retention metrics, delivery ETA algorithms, and loyalty funnels.'
  },
  {
    id: '10',
    title: 'AI Prompt Engineer & Data Evaluator',
    company: 'Cognizant',
    verified: true,
    location: 'Tirupati, Andhra Pradesh',
    salary: '₹6 - ₹10 LPA',
    salaryMin: 6,
    salaryMax: 10,
    experience: '1-3 years',
    type: 'Full-time',
    workMode: 'Remote',
    industry: 'Information Technology',
    skills: ['Python', 'Machine Learning', 'Data Evaluation', 'NLP'],
    matchScore: 86,
    postedTime: 'Posted 2 days ago',
    featured: false,
    description: 'Benchmark large language model outputs and design robust safety evaluation datasets.'
  }
];

export default function JobsPage() {
  const { toast } = useToast();
  const { jobsPageContent } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentJobsContent = jobsPageContent || DEFAULT_JOBS_PAGE_CONTENT;
  const heroConfig = currentJobsContent.hero || DEFAULT_JOBS_PAGE_CONTENT.hero;
  const searchConfig = currentJobsContent.search || DEFAULT_JOBS_PAGE_CONTENT.search;

  // Search & Filter state
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [experience, setExperience] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [industry, setIndustry] = useState(searchParams.get('industry') || '');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || '');
  const [datePosted, setDatePosted] = useState('');
  const [sortBy, setSortBy] = useState('Relevance');

  const [savedJobIds, setSavedJobIds] = useState(['1', '3']);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync URL query params
  useEffect(() => {
    const q = searchParams.get('q');
    const loc = searchParams.get('location');
    if (q !== null) setSearch(q);
    if (loc !== null) setLocation(loc);
  }, [searchParams]);

  const handleToggleSave = (jobId, title) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter(id => id !== jobId));
      toast({ type: 'info', title: 'Removed from Saved', message: `Removed "${title}" from saved jobs.` });
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
      toast({ type: 'success', title: 'Job Saved', message: `Saved "${title}" to your bookmarks.` });
    }
  };

  const handleOpenApply = (job) => {
    setSelectedJobToApply(job);
    setApplyModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setExperience('');
    setSalaryRange('');
    setJobType('');
    setWorkMode('');
    setIndustry('');
    setSelectedSkill('');
    setDatePosted('');
    setSortBy('Relevance');
    setSearchParams({});
  };

  // Filter computation
  const filteredJobs = useMemo(() => {
    let result = EXTENDED_MOCK_JOBS.filter((job) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(query);
        const matchCompany = job.company.toLowerCase().includes(query);
        const matchSkill = job.skills?.some(s => s.toLowerCase().includes(query));
        if (!matchTitle && !matchCompany && !matchSkill) return false;
      }

      // 2. Location
      if (location && location !== 'All Locations') {
        if (!job.location.toLowerCase().includes(location.toLowerCase())) return false;
      }

      // 3. Experience
      if (experience && experience !== 'All Experience') {
        if (!job.experience.toLowerCase().includes(experience.toLowerCase().replace('all experience', ''))) {
          if (experience.includes('Fresher') && !job.experience.includes('Fresher')) return false;
          if (experience.includes('1-3') && !job.experience.includes('1-3') && !job.experience.includes('2-4')) return false;
          if (experience.includes('3-5') && !job.experience.includes('3-5') && !job.experience.includes('2-4')) return false;
        }
      }

      // 4. Salary
      if (salaryRange && salaryRange !== 'All Salaries') {
        if (salaryRange.includes('0 - ₹3') && job.salaryMin > 3) return false;
        if (salaryRange.includes('3 - ₹6') && (job.salaryMax < 3 || job.salaryMin > 6)) return false;
        if (salaryRange.includes('6 - ₹10') && (job.salaryMax < 6 || job.salaryMin > 10)) return false;
        if (salaryRange.includes('10 - ₹18') && (job.salaryMax < 10 || job.salaryMin > 18)) return false;
        if (salaryRange.includes('18 - ₹30') && (job.salaryMax < 18 || job.salaryMin > 30)) return false;
      }

      // 5. Job Type
      if (jobType && jobType !== 'All Types') {
        if (job.type.toLowerCase() !== jobType.toLowerCase()) return false;
      }

      // 6. Work Mode
      if (workMode && workMode !== 'All Modes') {
        if (job.workMode.toLowerCase() !== workMode.toLowerCase()) return false;
      }

      // 7. Industry
      if (industry && industry !== 'All Industries') {
        if (job.industry !== industry) return false;
      }

      // 8. Skill
      if (selectedSkill) {
        if (!job.skills.some(s => s.toLowerCase() === selectedSkill.toLowerCase())) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'Salary: High to Low') {
      result.sort((a, b) => b.salaryMax - a.salaryMax);
    } else if (sortBy === 'Salary: Low to High') {
      result.sort((a, b) => a.salaryMin - b.salaryMin);
    } else if (sortBy === 'Latest') {
      // Keep order
    } else {
      // Relevance by match score
      result.sort((a, b) => b.matchScore - a.matchScore);
    }

    return result;
  }, [search, location, experience, salaryRange, jobType, workMode, industry, selectedSkill, sortBy]);

  const activeFilterCount = [
    experience, salaryRange, jobType, workMode, industry, selectedSkill, datePosted
  ].filter(Boolean).length;

  const popularTags = searchConfig.popularSearches && searchConfig.popularSearches.length > 0
    ? searchConfig.popularSearches
    : ['Python Developer', 'React JS', 'Data Analyst', 'Fresher Jobs', 'Hybrid Work', 'FastAPI'];

  return (
    <div className="jobs-search-page" style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 'var(--space-20)' }}>
      {/* ── 1. Top Search Header Section ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        color: '#ffffff',
        padding: 'var(--space-12) var(--space-6)',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#c7d2fe', background: 'rgba(255,255,255,0.15)', padding: '3px 12px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {heroConfig.badge || 'Corporate Recruitment Portal'}
            </span>
            <h1 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', fontWeight: 800, color: '#ffffff', marginTop: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              {heroConfig.heading || 'Find Your Dream Job in Andhra Pradesh & India'}
            </h1>
            <p style={{ fontSize: 'var(--text-base)', color: '#cbd5e1' }}>
              {heroConfig.subtitle || 'Explore 2,450+ verified corporate job openings with zero placement fees'}
            </p>
          </div>

          {/* Search Inputs Bar */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-3)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            alignItems: 'center'
          }}>
            {/* Keyword input */}
            <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)' }}>
              <Search size={18} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={searchConfig.searchPlaceholder || 'Job title, skills (Python, React...), or company...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text)',
                  background: 'transparent'
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ width: 1, height: 32, background: 'var(--color-border)', alignSelf: 'center' }} className="hide-mobile" />

            {/* Location dropdown */}
            <div style={{ flex: '1 1 230px', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', position: 'relative' }}>
              <MapPin size={18} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Filter by Location"
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: 'var(--text-sm)',
                  color: location ? 'var(--color-text)' : 'var(--color-text-muted)',
                  background: 'transparent',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  paddingRight: '18px'
                }}
              >
                <option value="" style={{ color: 'var(--color-text-muted)' }}>
                  {searchConfig.locationPlaceholder || 'All Locations (All India)'}
                </option>
                <optgroup label="States (28)" style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st} style={{ color: 'var(--color-text)', fontWeight: 500 }}>
                      {st}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Union Territories (8)" style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>
                  {INDIAN_UNION_TERRITORIES.map((ut) => (
                    <option key={ut} value={ut} style={{ color: 'var(--color-text)', fontWeight: 500 }}>
                      {ut}
                    </option>
                  ))}
                </optgroup>
              </select>
              {location ? (
                <button
                  type="button"
                  onClick={() => setLocation('')}
                  title="Clear location filter"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 2,
                    marginLeft: 2
                  }}
                >
                  <X size={14} />
                </button>
              ) : (
                <ChevronDown size={14} style={{ color: 'var(--color-text-muted)', pointerEvents: 'none', position: 'absolute', right: 12 }} />
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              style={{ flex: '0 0 auto', minWidth: 140, fontWeight: 700 }}
              onClick={() => {}}
            >
              Search Jobs
            </Button>
          </div>

          {/* Popular Searches Chips */}
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', fontSize: 'var(--text-xs)' }}>
            <span style={{ color: '#c7d2fe', fontWeight: 700 }}>Popular Searches:</span>
            {popularTags.map((chip) => (
              <button
                key={chip}
                onClick={() => setSearch(chip)}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  transition: 'background var(--transition-fast)'
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Main Two-Column Layout: Filters on Left, Results on Right ── */}
      <div className="container" style={{ marginTop: 'var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)', alignItems: 'start' }}>

          {/* Left Column: Filters Panel */}
          <aside style={{ gridColumn: 'span 4' }} className="hide-mobile">
            <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', border: '1px solid var(--color-border)', position: 'sticky', top: 90 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Filter size={16} style={{ color: 'var(--color-primary-600)' }} />
                  <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)' }}>
                    Filter Jobs
                  </h2>
                  {activeFilterCount > 0 && (
                    <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', padding: '1px 7px', borderRadius: 'var(--radius-full)' }}>
                      {activeFilterCount}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary-600)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Experience */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    Experience Level
                  </label>
                  <Select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    options={EXPERIENCE_LEVELS}
                  />
                </div>

                {/* Salary Range */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    Salary Range (CTC)
                  </label>
                  <Select
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    options={SALARY_RANGES}
                  />
                </div>

                {/* Work Mode */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    Work Mode
                  </label>
                  <Select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    options={WORK_MODES}
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    Job Type
                  </label>
                  <Select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    options={JOB_TYPES}
                  />
                </div>

                {/* Industry */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    Industry Sector
                  </label>
                  <Select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    options={INDUSTRIES}
                  />
                </div>

                {/* Technical Skills */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                    Required Technical Skills
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {['Python', 'React', 'TypeScript', 'SQL', 'FastAPI', 'Node.js', 'Docker', 'AWS'].map((s) => {
                      const isSelected = selectedSkill.toLowerCase() === s.toLowerCase();
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSkill(isSelected ? '' : s)}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-md)',
                            border: isSelected ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                            background: isSelected ? 'var(--color-primary-50)' : 'var(--color-surface)',
                            color: isSelected ? 'var(--color-primary-700)' : 'var(--color-text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          {s} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date Posted */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    Date Posted
                  </label>
                  <Select
                    value={datePosted}
                    onChange={(e) => setDatePosted(e.target.value)}
                    options={POSTED_DATES}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Results Section */}
          <main style={{ gridColumn: 'span 8' }} className="jobs-results-column">
            {/* Results Header Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text)' }}>
                  2,450 Jobs Found
                </h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Showing {filteredJobs.length} active matching positions
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    background: 'var(--color-surface)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Relevance">Relevance</option>
                  <option value="Latest">Latest</option>
                  <option value="Salary: High to Low">Salary: High to Low</option>
                  <option value="Salary: Low to High">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {/* Jobs Cards List */}
            {filteredJobs.length === 0 ? (
              <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-12)' }}>
                <EmptyState
                  icon="jobs"
                  title="No Jobs Found Matching Filters"
                  description="Try clearing some of your filter criteria or searching for different keywords."
                  action={<Button variant="primary" onClick={handleResetFilters}>Reset All Filters</Button>}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {filteredJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className="card card-hoverable"
                      style={{
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--space-6)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        transition: 'all var(--transition-base)'
                      }}
                    >
                      {/* Top Bar: Title & Save Button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 4 }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              color: 'var(--color-primary-700)',
                              background: 'var(--color-primary-50)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}>
                              <Sparkles size={11} /> {job.matchScore}% Match
                            </span>

                            {job.featured && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                color: 'var(--color-accent-700)',
                                background: 'var(--color-accent-50)',
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-md)'
                              }}>
                                ★ Featured Hiring
                              </span>
                            )}
                          </div>

                          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text)', marginBottom: 2 }}>
                            <Link to={`/jobs/${job.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {job.title}
                            </Link>
                          </h3>

                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <strong style={{ color: 'var(--color-text)' }}>{job.company}</strong>
                            {job.verified && <ShieldCheck size={14} style={{ color: 'var(--color-primary-600)' }} />}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleSave(job.id, job.title)}
                          style={{
                            background: isSaved ? 'var(--color-primary-50)' : 'none',
                            border: 'none',
                            color: isSaved ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          aria-label={isSaved ? 'Remove Bookmark' : 'Save Job'}
                        >
                          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Key Attributes Row */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--space-3)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-muted)',
                        margin: 'var(--space-3) 0',
                        alignItems: 'center'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={13} /> {job.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--color-text)' }}>
                          <DollarSign size={13} /> {job.salary}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Briefcase size={13} /> {job.experience}
                        </span>
                        <span style={{ background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}>
                          {job.type}
                        </span>
                        <span style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', padding: '2px 8px', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                          {job.workMode}
                        </span>
                      </div>

                      {/* Skills Chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: 'var(--color-primary-800)',
                              background: 'var(--color-primary-50)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-md)'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Footer: Posted time & CTA */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 'var(--space-3)',
                        borderTop: '1px solid var(--color-gray-100)',
                        flexWrap: 'wrap',
                        gap: 'var(--space-2)'
                      }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {job.postedTime}
                        </span>

                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <Link to={`/jobs/${job.id}`}>
                            <Button variant="outline" size="sm">
                              View Job
                            </Button>
                          </Link>
                          <Button variant="primary" size="sm" onClick={() => handleOpenApply(job)}>
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={selectedJobToApply}
      />
    </div>
  );
}
