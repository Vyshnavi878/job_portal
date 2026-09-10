import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Banknote, Clock, Building2,
  Bookmark, BookmarkCheck, CheckCircle2, SlidersHorizontal,
  RotateCcw, Sparkles, Filter, ChevronRight, Zap, ArrowRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import ApplyModal from '../../components/ui/ApplyModal';
import { useCandidate } from '../../context/CandidateContext';
import { useToast } from '../../context/ToastContext';
import {
  MOCK_JOBS,
  LOCATIONS,
  JOB_TYPES,
  WORK_MODES,
  EXPERIENCE_LEVELS,
  SALARY_RANGES,
  INDUSTRIES,
  SKILL_OPTIONS
} from '../../data/mockData';
import { formatJobId } from '../../utils/applicationUtils';

const POPULAR_SEARCHES = ['React Developer', 'Python FastAPI', 'Fullstack Engineer', 'Data Analyst', 'DevOps', 'UI/UX Designer'];

export default function CandidateJobsPage() {
  const { candidate, isJobSaved, saveJob, unsaveJob } = useCandidate();
  const { toast } = useToast();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [page, setPage] = useState(1);

  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  const handleOpenApply = (job) => {
    setSelectedJobForApply(job);
    setApplyModalOpen(true);
  };

  const handleToggleSave = (jobId) => {
    if (isJobSaved(jobId)) {
      unsaveJob(jobId);
      toast({ type: 'info', title: 'Removed from Saved', message: 'Job has been removed from your saved list.' });
    } else {
      saveJob(jobId);
      toast({ type: 'success', title: 'Job Saved', message: 'Job bookmarked to your Saved Jobs workspace.' });
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setExperience('');
    setSalary('');
    setJobType('');
    setWorkMode('');
    setIndustry('');
    setSelectedSkill('');
    setSortBy('relevance');
    setPage(1);
  };

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    let result = MOCK_JOBS.filter((job) => {
      // 1. Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchComp = job.company.toLowerCase().includes(q);
        const matchSkills = job.tags?.some(tag => tag.toLowerCase().includes(q)) ||
                            job.requirements?.some(r => r.toLowerCase().includes(q));
        if (!matchTitle && !matchComp && !matchSkills) return false;
      }

      // 2. Location
      if (location && location !== 'All Locations') {
        if (!job.location.toLowerCase().includes(location.toLowerCase())) return false;
      }

      // 3. Experience
      if (experience && experience !== 'All Experience') {
        if (experience.includes('Fresher') && !job.experience.toLowerCase().includes('0') && !job.experience.toLowerCase().includes('1')) return false;
        if (experience.includes('1-3') && !job.experience.includes('1') && !job.experience.includes('2') && !job.experience.includes('3')) return false;
        if (experience.includes('3-5') && !job.experience.includes('3') && !job.experience.includes('4') && !job.experience.includes('5')) return false;
        if (experience.includes('5-8') && !job.experience.includes('5') && !job.experience.includes('6') && !job.experience.includes('7') && !job.experience.includes('8')) return false;
      }

      // 4. Job Type
      if (jobType && jobType !== 'All Types') {
        if (job.type.toLowerCase() !== jobType.toLowerCase()) return false;
      }

      // 5. Work Mode
      if (workMode && workMode !== 'All Modes') {
        if (job.mode.toLowerCase() !== workMode.toLowerCase()) return false;
      }

      // 6. Industry
      if (industry && industry !== 'All Industries') {
        if (job.industry?.toLowerCase() !== industry.toLowerCase()) return false;
      }

      // 7. Skill
      if (selectedSkill && selectedSkill !== 'All Skills') {
        if (!job.tags?.some(t => t.toLowerCase() === selectedSkill.toLowerCase())) return false;
      }

      return true;
    });

    // Calculate match score based on candidate's skills
    result = result.map((job) => {
      const candidateSkills = candidate.skillsPreferences.skills.map(s => s.toLowerCase());
      const jobTags = (job.tags || []).map(t => t.toLowerCase());
      const matches = jobTags.filter(t => candidateSkills.some(cs => cs.includes(t) || t.includes(cs)));
      let matchScore = 85;
      if (matches.length >= 3) matchScore = 96;
      else if (matches.length === 2) matchScore = 92;
      else if (matches.length === 1) matchScore = 88;
      return { ...job, matchScore };
    });

    // Sorting
    if (sortBy === 'salaryHigh') {
      result.sort((a, b) => (b.salaryMin || 10) - (a.salaryMin || 10));
    } else if (sortBy === 'salaryLow') {
      result.sort((a, b) => (a.salaryMin || 10) - (b.salaryMin || 10));
    } else if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.createdAt || '2026-09-01') - new Date(a.createdAt || '2026-09-01'));
    } else {
      // Relevance (match score)
      result.sort((a, b) => b.matchScore - a.matchScore);
    }

    return result;
  }, [search, location, experience, jobType, workMode, industry, selectedSkill, sortBy, candidate]);

  // EXACTLY 9 jobs per page
  const PER_PAGE = 9;
  const totalPages = Math.ceil(filteredJobs.length / PER_PAGE);
  const paginatedJobs = filteredJobs.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeFiltersCount = [
    location && location !== 'All Locations',
    experience && experience !== 'All Experience',
    salary && salary !== 'All Salaries',
    jobType && jobType !== 'All Types',
    workMode && workMode !== 'All Modes',
    industry && industry !== 'All Industries',
    selectedSkill && selectedSkill !== 'All Skills'
  ].filter(Boolean).length;

  const handlePageChange = (p) => {
    setPage(p);
    const resultsPane = document.querySelector('.candidate-results-pane');
    if (resultsPane) {
      resultsPane.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="candidate-jobs-page">
      
      {/* ── Two-Column Layout: Stationary Left Filter + Dedicated Scrolling Right Results ── */}
      <div className="candidate-find-jobs-layout">

        {/* ── Left Stationary Filter Panel ── */}
        <aside className="candidate-filter-pane">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Filter size={16} style={{ color: 'var(--color-primary-600)' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Filter Jobs</h2>
              </div>
              {activeFiltersCount > 0 && (
                <span style={{
                  background: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  border: '1px solid var(--color-primary-200)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '10px'
                }}>
                  {activeFiltersCount} active
                </span>
              )}
            </div>

            {/* Experience */}
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                Experience Level
              </label>
              <Select
                options={EXPERIENCE_LEVELS}
                value={experience}
                onChange={(e) => { setExperience(e.target.value); setPage(1); }}
              />
            </div>

            {/* Salary */}
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                Salary Range
              </label>
              <Select
                options={SALARY_RANGES}
                value={salary}
                onChange={(e) => { setSalary(e.target.value); setPage(1); }}
              />
            </div>

            {/* Work Mode */}
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                Work Mode
              </label>
              <Select
                options={WORK_MODES}
                value={workMode}
                onChange={(e) => { setWorkMode(e.target.value); setPage(1); }}
              />
            </div>

            {/* Job Type */}
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                Employment Type
              </label>
              <Select
                options={JOB_TYPES}
                value={jobType}
                onChange={(e) => { setJobType(e.target.value); setPage(1); }}
              />
            </div>

            {/* Key Skill */}
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                Required Skill
              </label>
              <Select
                options={['All Skills', ...SKILL_OPTIONS]}
                value={selectedSkill}
                onChange={(e) => { setSelectedSkill(e.target.value === 'All Skills' ? '' : e.target.value); setPage(1); }}
              />
            </div>

            {/* Industry */}
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                Industry Sector
              </label>
              <Select
                options={INDUSTRIES}
                value={industry}
                onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* Bottom Area: Reset Filters Action */}
          <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              disabled={activeFiltersCount === 0 && !search && !location}
              style={{
                width: '100%',
                fontSize: '0.78rem',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                color: activeFiltersCount > 0 || search || location ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                borderColor: activeFiltersCount > 0 || search || location ? 'var(--color-primary-300)' : 'var(--color-border)'
              }}
            >
              <RotateCcw size={13} />
              <span>Reset Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </Button>
          </div>
        </aside>

        {/* ── Right Column: The Dedicated Scrolling Container ── */}
        <main className="candidate-results-pane">
          
          {/* Top Search Card in Right Column */}
          <div
            className="card"
            style={{
              borderRadius: 'var(--radius-xl)',
              padding: '1.1rem 1.25rem',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
              color: '#fff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', color: '#c7d2fe', border: '1px solid rgba(255,255,255,0.2)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  <Sparkles size={11} /> AI Job Match for {candidate.name}
                </div>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                  Find Your Next Career Opportunity
                </h1>
              </div>
            </div>

            {/* Search Inputs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(200px, 1.8fr) minmax(150px, 1.2fr) auto',
              gap: '0.45rem',
              background: 'rgba(255,255,255,0.12)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div className="input-wrapper" style={{ background: '#fff', borderRadius: 'var(--radius-md)' }}>
                <span className="input-icon-left"><Search size={15} style={{ color: 'var(--color-primary-600)' }} /></span>
                <input
                  className="input has-icon-left"
                  style={{ border: 'none', background: 'transparent', height: '36px', fontSize: '0.85rem' }}
                  placeholder="Job title, skills (React, Python), or company..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>

              <div style={{ background: '#fff', borderRadius: 'var(--radius-md)' }}>
                <select
                  className="select"
                  style={{ border: 'none', background: 'transparent', height: '36px', width: '100%', fontSize: '0.85rem' }}
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                >
                  {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              <Button variant="primary" style={{ background: 'var(--color-primary-500)', borderColor: 'var(--color-primary-400)', height: '36px', fontSize: '0.85rem', padding: '0 1rem' }}>
                Search
              </Button>
            </div>

            {/* Popular Search Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.45rem', fontSize: '0.72rem' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>Popular:</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => { setSearch(term); setPage(1); }}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#e0e7ff',
                    borderRadius: 'var(--radius-full)',
                    padding: '1px 8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header with Count and Sort */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: 0 }}>
                {filteredJobs.length} Jobs Found
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                Showing page {page} of {totalPages || 1} • Sorted by best match for your profile
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Sort by:</span>
              <select
                className="select"
                style={{ padding: '6px 12px', fontSize: 'var(--text-xs)', width: 'auto', height: '34px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance / Best Match</option>
                <option value="latest">Latest Posted</option>
                <option value="salaryHigh">Salary: High to Low</option>
                <option value="salaryLow">Salary: Low to High</option>
              </select>
            </div>
          </div>

          {/* Jobs List (EXACTLY 3 Cards Per Row in Desktop Grid) */}
          {filteredJobs.length === 0 ? (
            <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-10)' }}>
              <EmptyState
                icon="default"
                title="No jobs found matching your criteria"
                description="Try clearing your search query or broadening your experience and location filters."
                action={<Button variant="primary" onClick={handleResetFilters}>Reset All Filters</Button>}
              />
            </div>
          ) : (
            <div
              className="recruiter-jobs-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '1rem'
              }}
            >
              {paginatedJobs.map((job) => {
                const isSaved = isJobSaved(job.id);
                return (
                  <div
                    key={job.id}
                    className="card recruiter-job-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      gap: '0.65rem',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--color-gray-200)',
                      background: '#fff',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      {/* Header: Company Avatar + Title + Company Name + Verified + Bookmark */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.45rem', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', minWidth: 0 }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: 'var(--radius-lg)',
                            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {job.company?.[0] || 'C'}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <Link
                              to={`/candidate/jobs/${job.id}`}
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <h3
                                title={job.title}
                                style={{
                                  fontSize: '0.92rem',
                                  fontWeight: 700,
                                  color: 'var(--color-gray-900)',
                                  margin: 0,
                                  lineHeight: 1.25,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {job.title}
                              </h3>
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: 2 }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {job.company}
                              </span>
                              <CheckCircle2 size={11} style={{ color: 'var(--color-success-600)', flexShrink: 0 }} />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleSave(job.id)}
                          style={{
                            background: isSaved ? 'var(--color-primary-50)' : 'transparent',
                            border: isSaved ? '1px solid var(--color-primary-200)' : '1px solid var(--color-gray-200)',
                            color: isSaved ? 'var(--color-primary-600)' : 'var(--color-gray-400)',
                            borderRadius: 'var(--radius-md)',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.15s ease'
                          }}
                          aria-label={isSaved ? 'Unsave job' : 'Save job'}
                        >
                          {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        </button>
                      </div>

                      {/* Match Score & Status Badge Row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.35rem',
                        background: 'var(--color-gray-50)',
                        padding: '0.35rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--color-gray-200)',
                        marginBottom: '0.45rem'
                      }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            color: 'var(--color-primary-700)',
                            background: 'var(--color-primary-50)',
                            border: '1px solid var(--color-primary-200)',
                            padding: '0.08rem 0.35rem',
                            borderRadius: '4px'
                          }}>
                            {formatJobId(job.id)}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            <CheckCircle2 size={11} style={{ color: 'var(--color-success-600)' }} /> Verified Employer
                          </span>
                        </div>
                        {job.matchScore && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2,
                            background: job.matchScore >= 90 ? '#ecfdf5' : '#eef2ff',
                            color: job.matchScore >= 90 ? '#059669' : 'var(--color-primary-700)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.08rem 0.35rem',
                            borderRadius: '10px',
                            border: `1px solid ${job.matchScore >= 90 ? '#a7f3d0' : '#c7d2fe'}`,
                            flexShrink: 0
                          }}>
                            <Zap size={10} fill="currentColor" />
                            {job.matchScore}% Match
                          </span>
                        )}
                      </div>

                      {/* Metadata: Location, Salary, Experience, Mode */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-gray-600)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <MapPin size={12} style={{ color: 'var(--color-gray-400)', flexShrink: 0 }} />
                            <span>{job.location}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--color-gray-800)', flexShrink: 0 }}>
                            <Banknote size={12} style={{ color: 'var(--color-gray-400)', flexShrink: 0 }} />
                            <span>{job.salary}</span>
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem', color: 'var(--color-gray-500)', fontSize: '0.72rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <Clock size={12} style={{ color: 'var(--color-gray-400)', flexShrink: 0 }} />
                            <span>{job.experience}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            <Briefcase size={12} style={{ color: 'var(--color-gray-400)', flexShrink: 0 }} />
                            <span>{job.type} ({job.mode})</span>
                          </span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      {job.tags && job.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.4rem', minHeight: '20px' }}>
                          {job.tags.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: 'var(--color-gray-100)',
                                color: 'var(--color-gray-700)',
                                padding: '0.1rem 0.35rem',
                                borderRadius: '4px',
                                fontSize: '0.68rem',
                                fontWeight: 500
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                          {job.tags.length > 3 && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-gray-500)', fontWeight: 500 }}>
                              +{job.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer: Posted Date + View Job & Apply Buttons */}
                    <div style={{
                      borderTop: '1px solid var(--color-gray-100)',
                      paddingTop: '0.5rem',
                      marginTop: '0.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)' }}>
                          Posted 2d ago • Active hiring
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.35rem' }}>
                        <Link to={`/candidate/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                          <Button size="sm" variant="outline" style={{ width: '100%', fontSize: '0.75rem', padding: '0.25rem 0.4rem', height: '30px' }}>
                            View Job
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenApply(job)}
                          style={{ width: '100%', fontSize: '0.75rem', padding: '0.25rem 0.4rem', height: '30px' }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination (9 jobs per page) */}
          {totalPages > 1 && (
            <div style={{ marginTop: 'var(--space-6)' }}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={filteredJobs.length}
                pageSize={PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>

      {/* Reusable Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          job={selectedJobForApply}
        />
      )}
    </div>
  );
}

