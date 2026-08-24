import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, MapPin, SlidersHorizontal, X, RotateCcw, Briefcase,
  DollarSign, Clock, Building2, GraduationCap, Sparkles, AlertCircle
} from 'lucide-react';
import { JobCard } from '../../components/ui/EntityCards';
import Pagination from '../../components/ui/Pagination';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { JobCardSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import FormField from '../../components/ui/FormField';
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

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states (all 9 required filters)
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [experience, setExperience] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [industry, setIndustry] = useState(searchParams.get('industry') || '');
  const [education, setEducation] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || '');
  const [datePosted, setDatePosted] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync URL query params if present
  useEffect(() => {
    const q = searchParams.get('q');
    const loc = searchParams.get('location');
    const ind = searchParams.get('industry');
    const sk = searchParams.get('skill');
    if (q !== null) setSearch(q);
    if (loc !== null) setLocation(loc);
    if (ind !== null) setIndustry(ind);
    if (sk !== null) setSelectedSkill(sk);
  }, [searchParams]);

  // Simulate brief loading when filters change
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setExperience('');
    setSalaryRange('');
    setJobType('');
    setWorkMode('');
    setIndustry('');
    setEducation('');
    setSelectedSkill('');
    setDatePosted('');
    setSortBy('Newest');
    setPage(1);
    setSearchParams({});
    setHasError(false);
  };

  // Filter computation
  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(query);
        const matchCompany = job.company.toLowerCase().includes(query);
        const matchDesc = job.description?.toLowerCase().includes(query);
        const matchSkill = job.skills?.some(s => s.toLowerCase().includes(query));
        if (!matchTitle && !matchCompany && !matchDesc && !matchSkill) return false;
      }

      // 2. Location Filter
      if (location && location !== 'All Locations') {
        if (!job.location.toLowerCase().includes(location.toLowerCase())) return false;
      }

      // 3. Experience Filter
      if (experience && experience !== 'All Experience') {
        if (job.experience !== experience) {
          if (experience.includes('Fresher') && !job.experience.includes('Fresher') && !job.experience.includes('0-1')) return false;
          if (experience.includes('1-3') && !job.experience.includes('1-3')) return false;
          if (experience.includes('3-5') && !job.experience.includes('3-5')) return false;
          if (experience.includes('5-8') && !job.experience.includes('5-8')) return false;
          if (experience.includes('8+') && !job.experience.includes('8+')) return false;
        }
      }

      // 4. Salary Filter
      if (salaryRange && salaryRange !== 'All Salaries') {
        if (salaryRange.includes('0 - ₹3') && job.salaryMin > 3) return false;
        if (salaryRange.includes('3 - ₹6') && (job.salaryMax < 3 || job.salaryMin > 6)) return false;
        if (salaryRange.includes('6 - ₹10') && (job.salaryMax < 6 || job.salaryMin > 10)) return false;
        if (salaryRange.includes('10 - ₹18') && (job.salaryMax < 10 || job.salaryMin > 18)) return false;
        if (salaryRange.includes('18 - ₹30') && (job.salaryMax < 18 || job.salaryMin > 30)) return false;
        if (salaryRange.includes('30+') && job.salaryMax < 30) return false;
      }

      // 5. Job Type Filter
      if (jobType && jobType !== 'All Types') {
        if (job.type.toLowerCase() !== jobType.toLowerCase()) return false;
      }

      // 6. Work Mode Filter
      if (workMode && workMode !== 'All Modes') {
        if (job.workMode.toLowerCase() !== workMode.toLowerCase()) return false;
      }

      // 7. Industry Filter
      if (industry && industry !== 'All Industries') {
        if (job.industry.toLowerCase() !== industry.toLowerCase()) return false;
      }

      // 8. Education Filter
      if (education && education !== 'All Qualifications') {
        if (education.includes("Bachelor") && !job.education.includes("Bachelor")) return false;
        if (education.includes("Master") && !job.education.includes("Master")) return false;
      }

      // 9. Skill Filter
      if (selectedSkill && selectedSkill !== '') {
        if (!job.skills?.some(s => s.toLowerCase() === selectedSkill.toLowerCase())) return false;
      }

      // Date Posted Filter
      if (datePosted && datePosted !== 'Any time') {
        if (datePosted === 'Past 24 hours' && !job.postedAgo?.includes('1 day')) return false;
        if (datePosted === 'Past week' && job.postedAgo?.includes('days') && parseInt(job.postedAgo) > 7) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Salary: High to Low') return (b.salaryMax || 0) - (a.salaryMax || 0);
      if (sortBy === 'Salary: Low to High') return (a.salaryMin || 0) - (b.salaryMin || 0);
      if (sortBy === 'Most Popular') return (b.applicationsCount || 0) - (a.applicationsCount || 0);
      return new Date(b.postedDate) - new Date(a.postedDate); // Newest default
    });
  }, [search, location, experience, salaryRange, jobType, workMode, industry, education, selectedSkill, datePosted, sortBy]);

  const activeFilterCount = [
    location && location !== 'All Locations',
    experience && experience !== 'All Experience',
    salaryRange && salaryRange !== 'All Salaries',
    jobType && jobType !== 'All Types',
    workMode && workMode !== 'All Modes',
    industry && industry !== 'All Industries',
    education && education !== 'All Qualifications',
    selectedSkill,
    datePosted && datePosted !== 'Any time'
  ].filter(Boolean).length;

  const PER_PAGE = 6;
  const totalPages = Math.ceil(filteredJobs.length / PER_PAGE);
  const paginatedJobs = filteredJobs.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="jobs-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-16)' }}>
      {/* Top Header Banner */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div>
              <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>Explore Job Opportunities</h1>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
                Showing verified listings with direct applications and live status updates
              </p>
            </div>
            {/* Quick action buttons for demo testing */}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant={hasError ? 'danger' : 'ghost'}
                size="sm"
                onClick={() => setHasError(v => !v)}
                title="Toggle simulated error state"
              >
                {hasError ? 'Clear Error' : 'Simulate Error'}
              </Button>
            </div>
          </div>

          {/* Primary Quick Search Bar */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="input-wrapper" style={{ flex: '3 1 280px', minWidth: 240 }}>
              <span className="input-icon-left"><Search size={16} /></span>
              <input
                className="input has-icon-left"
                placeholder="Search by job title, skill, company or keyword..."
                value={search}
                onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => handleFilterChange(setSearch, '')}
                  className="input-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ flex: '1 1 180px', minWidth: 150 }}>
              <Select
                options={LOCATIONS}
                placeholder="Location"
                value={location}
                onChange={(e) => handleFilterChange(setLocation, e.target.value)}
              />
            </div>

            <div style={{ flex: '1 1 160px', minWidth: 140 }}>
              <Select
                options={JOB_TYPES}
                placeholder="Job Type"
                value={jobType}
                onChange={(e) => handleFilterChange(setJobType, e.target.value)}
              />
            </div>

            <Button
              variant="secondary"
              leftIcon={<SlidersHorizontal size={16} />}
              onClick={() => setShowMobileFilters(v => !v)}
              className="hide-desktop"
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Filters:</span>
              {location && location !== 'All Locations' && (
                <span className="multi-select-tag">
                  Location: {location}
                  <X size={12} onClick={() => handleFilterChange(setLocation, '')} style={{ cursor: 'pointer', marginLeft: 4 }} />
                </span>
              )}
              {jobType && jobType !== 'All Types' && (
                <span className="multi-select-tag">
                  Type: {jobType}
                  <X size={12} onClick={() => handleFilterChange(setJobType, '')} style={{ cursor: 'pointer', marginLeft: 4 }} />
                </span>
              )}
              {workMode && workMode !== 'All Modes' && (
                <span className="multi-select-tag">
                  Mode: {workMode}
                  <X size={12} onClick={() => handleFilterChange(setWorkMode, '')} style={{ cursor: 'pointer', marginLeft: 4 }} />
                </span>
              )}
              {experience && experience !== 'All Experience' && (
                <span className="multi-select-tag">
                  Exp: {experience}
                  <X size={12} onClick={() => handleFilterChange(setExperience, '')} style={{ cursor: 'pointer', marginLeft: 4 }} />
                </span>
              )}
              {salaryRange && salaryRange !== 'All Salaries' && (
                <span className="multi-select-tag">
                  Salary: {salaryRange}
                  <X size={12} onClick={() => handleFilterChange(setSalaryRange, '')} style={{ cursor: 'pointer', marginLeft: 4 }} />
                </span>
              )}
              {industry && industry !== 'All Industries' && (
                <span className="multi-select-tag">
                  Industry: {industry}
                  <X size={12} onClick={() => handleFilterChange(setIndustry, '')} style={{ cursor: 'pointer', marginLeft: 4 }} />
                </span>
              )}
              {education && education !== 'All Qualifications' && (
                <span className="multi-select-tag">
                  Edu: {education.split(' ')[0]}
                  <X size={12} onClick={() => handleFilterChange(setEducation, '')} style={{ cursor: 'pointer', marginLeft: 4 }} />
                </span>
              )}
              {selectedSkill && (
                <span className="multi-select-tag">
                  Skill: {selectedSkill}
                  <X size={12} onClick={() => handleFilterChange(setSelectedSkill, '')} style={{ cursor: 'pointer', marginLeft: 4 }} />
                </span>
              )}
              {datePosted && datePosted !== 'Any time' && (
                <span className="multi-select-tag">
                  Posted: {datePosted}
                  <X size={12} onClick={() => handleFilterChange(setDatePosted, '')} style={{ cursor: 'pointer', marginLeft: 4 }} />
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-danger-600)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <RotateCcw size={11} /> Reset All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Results Grid */}
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div className="responsive-split-sidebar">

          {/* ── Left Filters Sidebar (All 9 Filters) ── */}
          <aside className={`jobs-filter-sidebar ${showMobileFilters ? 'open' : ''}`} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
            position: 'sticky',
            top: '80px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <SlidersHorizontal size={18} style={{ color: 'var(--color-primary-600)' }} />
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>All Filters</h2>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Clear ({activeFilterCount})
                </button>
              )}
            </div>

            {/* 1. Work Mode Filter */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', display: 'block' }}>
                Work Mode
              </label>
              <Select
                options={WORK_MODES}
                value={workMode}
                onChange={(e) => handleFilterChange(setWorkMode, e.target.value)}
              />
            </div>

            {/* 2. Experience Level */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', display: 'block' }}>
                Experience Level
              </label>
              <Select
                options={EXPERIENCE_LEVELS}
                value={experience}
                onChange={(e) => handleFilterChange(setExperience, e.target.value)}
              />
            </div>

            {/* 3. Salary Range */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', display: 'block' }}>
                Salary (LPA)
              </label>
              <Select
                options={SALARY_RANGES}
                value={salaryRange}
                onChange={(e) => handleFilterChange(setSalaryRange, e.target.value)}
              />
            </div>

            {/* 4. Industry */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', display: 'block' }}>
                Industry
              </label>
              <Select
                options={INDUSTRIES}
                value={industry}
                onChange={(e) => handleFilterChange(setIndustry, e.target.value)}
              />
            </div>

            {/* 5. Required Skills */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', display: 'block' }}>
                Key Skill
              </label>
              <Select
                options={['All Skills', ...SKILL_OPTIONS]}
                value={selectedSkill}
                onChange={(e) => handleFilterChange(setSelectedSkill, e.target.value === 'All Skills' ? '' : e.target.value)}
              />
            </div>

            {/* 6. Education Qualification */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', display: 'block' }}>
                Education Level
              </label>
              <Select
                options={EDUCATION_LEVELS}
                value={education}
                onChange={(e) => handleFilterChange(setEducation, e.target.value)}
              />
            </div>

            {/* 7. Date Posted */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', display: 'block' }}>
                Date Posted
              </label>
              <Select
                options={POSTED_DATES}
                value={datePosted}
                onChange={(e) => handleFilterChange(setDatePosted, e.target.value)}
              />
            </div>

            {showMobileFilters && (
              <Button variant="primary" fullWidth onClick={() => setShowMobileFilters(false)}>
                Apply Filters
              </Button>
            )}
          </aside>

          {/* ── Right Results Grid ── */}
          <main>
            {/* Results bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-6)',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  Showing <strong style={{ color: 'var(--color-text)' }}>{filteredJobs.length}</strong> matching positions
                </p>
              </div>

              {/* Sort selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Sort by:</span>
                <div style={{ width: 190 }}>
                  <Select
                    options={['Newest', 'Salary: High to Low', 'Salary: Low to High', 'Most Popular']}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Render States */}
            {hasError ? (
              <ErrorState
                title="Unable to load job listings"
                description="There was an error communicating with the job search index. Please try refreshing."
                action={<Button variant="primary" onClick={() => setHasError(false)}>Retry Search</Button>}
              />
            ) : isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <EmptyState
                icon="jobs"
                title="No jobs matched your criteria"
                description="Try expanding your location, lowering experience requirements, or clearing selected skills."
                action={
                  <Button variant="primary" onClick={handleResetFilters}>
                    Clear All Filters
                  </Button>
                }
              />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
                  {paginatedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ marginTop: 'var(--space-10)' }}>
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      totalItems={filteredJobs.length}
                      pageSize={PER_PAGE}
                      onPageChange={(p) => {
                        setPage(p);
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
