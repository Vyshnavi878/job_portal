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

  const PER_PAGE = 8;
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

  return (
    <div className="candidate-jobs-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      
      {/* ── Top Search Section ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)', color: '#fff' }}>
        <div style={{ maxWidth: 800, marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.15)', color: '#c7d2fe', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles size={12} style={{ marginRight: 4 }} /> AI-Powered Job Match for {candidate.name}
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
            Find Your Next Career Opportunity
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: '#cbd5e1' }}>
            Personalized recommendations tailored to your profile, preferred roles, and skills.
          </p>
        </div>

        {/* Search Bar Inputs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 1.8fr) minmax(180px, 1.2fr) auto',
          gap: 'var(--space-2)',
          background: 'rgba(255,255,255,0.12)',
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div className="input-wrapper" style={{ background: '#fff', borderRadius: 'var(--radius-lg)' }}>
            <span className="input-icon-left"><Search size={16} style={{ color: 'var(--color-primary-600)' }} /></span>
            <input
              className="input has-icon-left"
              style={{ border: 'none', background: 'transparent' }}
              placeholder="Job title, skills (React, Python), or company..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)' }}>
            <select
              className="select"
              style={{ border: 'none', background: 'transparent', height: '100%', width: '100%' }}
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
            >
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <Button variant="primary" style={{ background: 'var(--color-primary-500)', borderColor: 'var(--color-primary-400)' }}>
            Search Jobs
          </Button>
        </div>

        {/* Popular / Recent Searches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>Popular Searches:</span>
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
                padding: '2px 10px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout: Filters on Left, Jobs on Right ── */}
      <div className="responsive-split-sidebar">

        {/* ── Filters Sidebar (Left) ── */}
        <aside style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
          position: 'sticky',
          top: '80px',
          height: 'fit-content'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Filter size={18} style={{ color: 'var(--color-primary-600)' }} />
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Filter Jobs</h2>
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear All ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Experience */}
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
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
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
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
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
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
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
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
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
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
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
              Industry Sector
            </label>
            <Select
              options={INDUSTRIES}
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
            />
          </div>
        </aside>

        {/* ── Job Results (Right) ── */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          {/* Results Header with Count and Sort */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
                {filteredJobs.length} Jobs Found
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Sorted by best match for your profile skills & preferences
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Sort by:</span>
              <select
                className="select"
                style={{ padding: '6px 12px', fontSize: 'var(--text-xs)', width: 'auto' }}
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

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)' }}>
              <EmptyState
                icon="default"
                title="No jobs found matching your criteria"
                description="Try clearing your search query or broadening your experience and location filters."
                action={<Button variant="primary" onClick={handleResetFilters}>Reset All Filters</Button>}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {paginatedJobs.map((job) => {
                const isSaved = isJobSaved(job.id);
                return (
                  <div
                    key={job.id}
                    className="card card-hoverable"
                    style={{
                      borderRadius: 'var(--radius-2xl)',
                      padding: 'var(--space-6)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-4)',
                      transition: 'all var(--transition-normal)'
                    }}
                  >
                    {/* Header: Company + Title + Match + Save */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: 'var(--radius-xl)',
                          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                          color: '#fff',
                          fontSize: 'var(--text-lg)',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {job.company?.[0] || 'C'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            <Link
                              to={`/candidate/jobs/${job.id}`}
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)' }}>
                                {job.title}
                              </h3>
                            </Link>
                            {job.matchScore >= 90 && (
                              <span style={{
                                background: '#ecfdf5',
                                color: '#059669',
                                border: '1px solid #a7f3d0',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '11px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}>
                                <Zap size={11} fill="currentColor" /> {job.matchScore}% Match
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-600)' }}>
                              {job.company}
                            </span>
                            <CheckCircle2 size={13} style={{ color: 'var(--color-success-600)' }} />
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>• Verified Employer</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleSave(job.id)}
                        style={{
                          background: isSaved ? 'var(--color-primary-50)' : 'var(--color-surface)',
                          border: isSaved ? '1px solid var(--color-primary-300)' : '1px solid var(--color-border)',
                          color: isSaved ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                          borderRadius: 'var(--radius-lg)',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                        aria-label={isSaved ? 'Unsave job' : 'Save job'}
                      >
                        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                    </div>

                    {/* Metadata Pills */}
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} /> {job.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Banknote size={13} /> {job.salary}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> {job.experience}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Briefcase size={13} /> {job.type} ({job.mode})
                      </span>
                    </div>

                    {/* Skills Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                        {job.tags.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            style={{
                              background: 'var(--color-gray-100)',
                              color: 'var(--color-text)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '11px',
                              fontWeight: 600
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--color-gray-100)',
                      paddingTop: 'var(--space-3)',
                      marginTop: 2
                    }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                        Posted 2 days ago • Active hiring
                      </span>

                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Link to={`/candidate/jobs/${job.id}`}>
                          <Button size="sm" variant="outline">
                            View Job
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenApply(job)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={filteredJobs.length}
                pageSize={PER_PAGE}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
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
