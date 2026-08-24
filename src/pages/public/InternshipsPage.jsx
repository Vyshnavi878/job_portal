import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, SlidersHorizontal, RotateCcw, GraduationCap,
  DollarSign, Clock, Building2, Sparkles, X
} from 'lucide-react';
import { InternshipCard } from '../../components/ui/EntityCards';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import {
  MOCK_INTERNSHIPS,
  LOCATIONS,
  WORK_MODES,
  STIPEND_RANGES,
  INTERNSHIP_DURATIONS,
  SKILL_OPTIONS,
  INDUSTRIES
} from '../../data/mockData';

export default function InternshipsPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [stipendRange, setStipendRange] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setWorkMode('');
    setStipendRange('');
    setDuration('');
    setSelectedSkill('');
    setIndustry('');
    setPage(1);
  };

  const filteredInternships = useMemo(() => {
    return MOCK_INTERNSHIPS.filter((item) => {
      // 1. Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCompany = item.company.toLowerCase().includes(q);
        const matchSkill = item.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchSkill) return false;
      }

      // 2. Location
      if (location && location !== 'All Locations') {
        if (!item.location.toLowerCase().includes(location.toLowerCase())) return false;
      }

      // 3. Work Mode
      if (workMode && workMode !== 'All Modes') {
        if (item.mode.toLowerCase() !== workMode.toLowerCase()) return false;
      }

      // 4. Stipend Range
      if (stipendRange && stipendRange !== 'All Stipends') {
        if (stipendRange.includes('5,000 - ₹10,000') && (item.stipendAmount < 5000 || item.stipendAmount > 10000)) return false;
        if (stipendRange.includes('10,000 - ₹20,000') && (item.stipendAmount < 10000 || item.stipendAmount > 20000)) return false;
        if (stipendRange.includes('20,000 - ₹40,000') && (item.stipendAmount < 20000 || item.stipendAmount > 40000)) return false;
        if (stipendRange.includes('40,000+') && item.stipendAmount < 40000) return false;
      }

      // 5. Duration
      if (duration && duration !== 'All Durations') {
        if (!item.duration.toLowerCase().includes(duration.toLowerCase().split(' ')[0])) return false;
      }

      // 6. Skill
      if (selectedSkill && selectedSkill !== '') {
        if (!item.skills?.some(s => s.toLowerCase() === selectedSkill.toLowerCase())) return false;
      }

      // 7. Industry
      if (industry && industry !== 'All Industries') {
        if (item.industry.toLowerCase() !== industry.toLowerCase()) return false;
      }

      return true;
    });
  }, [search, location, workMode, stipendRange, duration, selectedSkill, industry]);

  const PER_PAGE = 6;
  const totalPages = Math.ceil(filteredInternships.length / PER_PAGE);
  const paginatedInternships = filteredInternships.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeFiltersCount = [
    location && location !== 'All Locations',
    workMode && workMode !== 'All Modes',
    stipendRange && stipendRange !== 'All Stipends',
    duration && duration !== 'All Durations',
    selectedSkill,
    industry && industry !== 'All Industries'
  ].filter(Boolean).length;

  return (
    <div className="internships-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-16)' }}>
      {/* Top Banner */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div>
              <div className="badge badge-info" style={{ marginBottom: 'var(--space-2)' }}>
                <GraduationCap size={12} style={{ marginRight: 4 }} /> Campus & Trainee Programs
              </div>
              <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>Explore Paid Internships</h1>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
                Launch your career with verified corporate internships, monthly stipends, and PPO opportunities
              </p>
            </div>
          </div>

          {/* Quick Filter Row */}
          <div className="responsive-filter-bar" style={{ marginTop: 'var(--space-6)' }}>
            <div className="input-wrapper">
              <span className="input-icon-left"><Search size={16} /></span>
              <input
                className="input has-icon-left"
                placeholder="Search internships by role, company, skill or stipend..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <div>
              <Select
                options={LOCATIONS}
                placeholder="Location"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              />
            </div>

            <div>
              <Select
                options={WORK_MODES}
                placeholder="Work Mode"
                value={workMode}
                onChange={(e) => { setWorkMode(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div className="responsive-split-sidebar">

          {/* ── Filters Sidebar (All required filters: location, work mode, stipend, duration, skills, industry) ── */}
          <aside style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
            position: 'sticky',
            top: '80px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <SlidersHorizontal size={18} style={{ color: 'var(--color-primary-600)' }} />
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Internship Filters</h2>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Stipend Filter */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
                Monthly Stipend
              </label>
              <Select
                options={STIPEND_RANGES}
                value={stipendRange}
                onChange={(e) => { setStipendRange(e.target.value); setPage(1); }}
              />
            </div>

            {/* Duration Filter */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
                Duration
              </label>
              <Select
                options={INTERNSHIP_DURATIONS}
                value={duration}
                onChange={(e) => { setDuration(e.target.value); setPage(1); }}
              />
            </div>

            {/* Required Skill */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
                Key Skill
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
                Industry
              </label>
              <Select
                options={INDUSTRIES}
                value={industry}
                onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
              />
            </div>
          </aside>

          {/* ── Main Results ── */}
          <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Showing <strong style={{ color: 'var(--color-text)' }}>{filteredInternships.length}</strong> available internships
              </p>
            </div>

            {filteredInternships.length === 0 ? (
              <EmptyState
                icon="default"
                title="No internships match your filter criteria"
                description="Try lowering stipend requirements, clearing skills or switching location filters."
                action={<Button variant="primary" onClick={handleReset}>Clear All Filters</Button>}
              />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
                  {paginatedInternships.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={{ marginTop: 'var(--space-10)' }}>
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      totalItems={filteredInternships.length}
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
