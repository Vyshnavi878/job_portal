import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Building2, Users, CheckCircle2,
  Star, Briefcase, GraduationCap, ArrowRight, ShieldCheck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import {
  MOCK_COMPANIES,
  INDUSTRIES,
  LOCATIONS
} from '../../data/mockData';

export default function CandidateCompaniesPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_COMPANIES.filter((company) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = company.name.toLowerCase().includes(q);
        const matchDesc = company.description?.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      if (industry && industry !== 'All Industries') {
        if (company.industry?.toLowerCase() !== industry.toLowerCase()) return false;
      }
      if (location && location !== 'All Locations') {
        if (!company.location?.toLowerCase().includes(location.toLowerCase())) return false;
      }
      return true;
    });
  }, [search, industry, location]);

  const PER_PAGE = 6;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="candidate-companies-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)', color: '#fff' }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <ShieldCheck size={18} style={{ color: '#c7d2fe' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c7d2fe' }}>
              Verified Employers & Hiring Partners
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
            Explore Top Hiring Companies
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: '#cbd5e1' }}>
            Discover company work cultures, tech stacks, active job openings, and internship opportunities across Andhra Pradesh and India.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'minmax(240px, 2fr) minmax(180px, 1fr) auto', gap: 'var(--space-2)', background: 'rgba(255,255,255,0.12)', padding: 'var(--space-2)', borderRadius: 'var(--radius-xl)' }}>
          <div className="input-wrapper" style={{ background: '#fff', borderRadius: 'var(--radius-lg)' }}>
            <span className="input-icon-left"><Search size={16} style={{ color: 'var(--color-primary-600)' }} /></span>
            <input
              className="input has-icon-left"
              style={{ border: 'none', background: 'transparent' }}
              placeholder="Search companies by name or technology..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)' }}>
            <select
              className="select"
              style={{ border: 'none', background: 'transparent', height: '100%', width: '100%' }}
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
            >
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          <Button variant="primary" style={{ background: 'var(--color-primary-500)' }}>
            Search
          </Button>
        </div>
      </div>

      {/* Companies Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>
            {filtered.length} Verified Employers Hiring Now
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)' }}>
            <EmptyState
              icon="companies"
              title="No companies match your search"
              description="Try clearing your search query or choosing another industry."
              action={<Button variant="primary" onClick={() => { setSearch(''); setIndustry(''); setLocation(''); }}>Clear Filters</Button>}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
            {paginated.map((company) => (
              <div
                key={company.id}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: 'var(--radius-xl)',
                      background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                      color: '#fff',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {company.name?.[0] || 'C'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-warning-50)', color: 'var(--color-warning-700)', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 700 }}>
                      <Star size={12} fill="currentColor" /> {company.rating || '4.5'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)' }}>
                      {company.name}
                    </h3>
                    <CheckCircle2 size={14} style={{ color: 'var(--color-success-600)' }} />
                  </div>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600, marginTop: 2 }}>
                    {company.industry}
                  </p>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-2) 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {company.tagline || company.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {company.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={13} /> {company.employees || '1,000+'} employees</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-success-700)',
                    background: 'var(--color-success-50)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    {company.openJobsCount || 12} Open Jobs
                  </span>

                  <Link to="/candidate/jobs">
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight size={13} />}>
                      View Jobs
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PER_PAGE} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
