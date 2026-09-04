import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Banknote, Clock, Building2,
  GraduationCap, SlidersHorizontal, RotateCcw, CheckCircle2, Bookmark, BookmarkCheck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import ApplyModal from '../../components/ui/ApplyModal';
import { useCandidate } from '../../context/CandidateContext';
import { useToast } from '../../context/ToastContext';
import {
  MOCK_INTERNSHIPS,
  LOCATIONS,
  WORK_MODES,
  STIPEND_RANGES,
  INTERNSHIP_DURATIONS,
  SKILL_OPTIONS
} from '../../data/mockData';

export default function CandidateInternshipsPage() {
  const { isJobSaved, saveJob, unsaveJob } = useCandidate();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [stipendRange, setStipendRange] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [page, setPage] = useState(1);

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedInternshipForApply, setSelectedInternshipForApply] = useState(null);

  const handleOpenApply = (internship) => {
    setSelectedInternshipForApply({
      ...internship,
      salary: internship.stipend ? `${internship.stipend}/mo` : '₹15,000/mo'
    });
    setApplyModalOpen(true);
  };

  const handleToggleSave = (id) => {
    if (isJobSaved(id)) {
      unsaveJob(id);
      toast({ type: 'info', title: 'Removed', message: 'Internship removed from saved list.' });
    } else {
      saveJob(id);
      toast({ type: 'success', title: 'Saved', message: 'Internship saved to your list.' });
    }
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setWorkMode('');
    setStipendRange('');
    setDuration('');
    setSelectedSkill('');
    setPage(1);
  };

  const filteredInternships = useMemo(() => {
    return MOCK_INTERNSHIPS.filter((item) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCompany = item.company.toLowerCase().includes(q);
        const matchSkill = item.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchSkill) return false;
      }

      if (location && location !== 'All Locations') {
        if (!item.location.toLowerCase().includes(location.toLowerCase())) return false;
      }

      if (workMode && workMode !== 'All Modes') {
        if (item.mode.toLowerCase() !== workMode.toLowerCase()) return false;
      }

      if (stipendRange && stipendRange !== 'All Stipends') {
        if (stipendRange.includes('5,000 - ₹10,000') && (item.stipendAmount < 5000 || item.stipendAmount > 10000)) return false;
        if (stipendRange.includes('10,000 - ₹20,000') && (item.stipendAmount < 10000 || item.stipendAmount > 20000)) return false;
        if (stipendRange.includes('20,000 - ₹40,000') && (item.stipendAmount < 20000 || item.stipendAmount > 40000)) return false;
      }

      if (duration && duration !== 'All Durations') {
        if (!item.duration.toLowerCase().includes(duration.toLowerCase().split(' ')[0])) return false;
      }

      if (selectedSkill && selectedSkill !== '') {
        if (!item.skills?.some(s => s.toLowerCase() === selectedSkill.toLowerCase())) return false;
      }

      return true;
    });
  }, [search, location, workMode, stipendRange, duration, selectedSkill]);

  const PER_PAGE = 6;
  const totalPages = Math.ceil(filteredInternships.length / PER_PAGE);
  const paginated = filteredInternships.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="candidate-internships-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', color: '#fff' }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <GraduationCap size={18} style={{ color: '#c7d2fe' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c7d2fe' }}>
              Campus & Early Career Programs
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
            Explore Verified Paid Internships
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: '#cbd5e1' }}>
            Gain hands-on corporate experience, monthly stipends, and direct Pre-Placement Offers (PPOs).
          </p>
        </div>

        {/* Quick Search */}
        <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'minmax(240px, 2fr) minmax(180px, 1fr) auto', gap: 'var(--space-2)', background: 'rgba(255,255,255,0.12)', padding: 'var(--space-2)', borderRadius: 'var(--radius-xl)' }}>
          <div className="input-wrapper" style={{ background: '#fff', borderRadius: 'var(--radius-lg)' }}>
            <span className="input-icon-left"><Search size={16} style={{ color: 'var(--color-primary-600)' }} /></span>
            <input
              className="input has-icon-left"
              style={{ border: 'none', background: 'transparent' }}
              placeholder="Search by role, company, or key skill..."
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

          <Button variant="primary" style={{ background: 'var(--color-primary-500)' }}>
            Search
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="responsive-split-sidebar">
        
        {/* Filters Sidebar */}
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
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Internship Filters</h2>
            <button
              type="button"
              onClick={handleReset}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 600 }}
            >
              Reset
            </button>
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
              Monthly Stipend
            </label>
            <Select options={STIPEND_RANGES} value={stipendRange} onChange={(e) => { setStipendRange(e.target.value); setPage(1); }} />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
              Duration
            </label>
            <Select options={INTERNSHIP_DURATIONS} value={duration} onChange={(e) => { setDuration(e.target.value); setPage(1); }} />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
              Work Mode
            </label>
            <Select options={WORK_MODES} value={workMode} onChange={(e) => { setWorkMode(e.target.value); setPage(1); }} />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>
              Key Skill
            </label>
            <Select options={['All Skills', ...SKILL_OPTIONS]} value={selectedSkill} onChange={(e) => { setSelectedSkill(e.target.value === 'All Skills' ? '' : e.target.value); setPage(1); }} />
          </div>
        </aside>

        {/* Results */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>
              Showing {filteredInternships.length} Available Internships
            </h2>
          </div>

          {filteredInternships.length === 0 ? (
            <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)' }}>
              <EmptyState
                icon="default"
                title="No internships found"
                description="Try clearing your filters to see more opportunities."
                action={<Button variant="primary" onClick={handleReset}>Clear Filters</Button>}
              />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
              {paginated.map((item) => {
                const isSaved = isJobSaved(item.id);
                return (
                  <div
                    key={item.id}
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
                        <div>
                          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)' }}>
                            {item.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-600)' }}>
                              {item.company}
                            </span>
                            <CheckCircle2 size={13} style={{ color: 'var(--color-success-600)' }} />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleSave(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--color-primary-600)' : 'var(--color-text-light)' }}
                        >
                          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-3) 0' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {item.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Banknote size={13} /> {item.stipend?.includes('/mo') ? item.stipend : `${item.stipend}/month`}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={13} /> {item.duration} ({item.mode})</span>
                      </div>

                      {item.skills && item.skills.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {item.skills.slice(0, 3).map(skill => (
                            <span key={skill} style={{ background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: '11px', fontWeight: 600 }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                        Apply by {new Date(item.deadline || '2026-09-30').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                      <Button size="sm" variant="primary" onClick={() => handleOpenApply(item)}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ marginTop: 'var(--space-6)' }}>
              <Pagination currentPage={page} totalPages={totalPages} totalItems={filteredInternships.length} pageSize={PER_PAGE} onPageChange={setPage} />
            </div>
          )}
        </main>
      </div>

      {selectedInternshipForApply && (
        <ApplyModal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          job={selectedInternshipForApply}
        />
      )}
    </div>
  );
}
