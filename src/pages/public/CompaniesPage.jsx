import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Users, SlidersHorizontal, RotateCcw, Briefcase, Star, ExternalLink } from 'lucide-react';
import { CompanyCard } from '../../components/ui/EntityCards';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import {
  MOCK_COMPANIES,
  INDUSTRIES,
  LOCATIONS,
  COMPANY_SIZES
} from '../../data/mockData';

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [page, setPage] = useState(1);

  const handleReset = () => {
    setSearch('');
    setIndustry('');
    setLocation('');
    setSize('');
    setPage(1);
  };

  const filteredCompanies = useMemo(() => {
    return MOCK_COMPANIES.filter((company) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = company.name.toLowerCase().includes(q);
        const matchDesc = company.description?.toLowerCase().includes(q);
        const matchTag = company.tagline?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchTag) return false;
      }

      if (industry && industry !== 'All Industries') {
        if (company.industry.toLowerCase() !== industry.toLowerCase()) return false;
      }

      if (location && location !== 'All Locations') {
        if (!company.location.toLowerCase().includes(location.toLowerCase())) return false;
      }

      if (size && size !== 'All Sizes') {
        if (size.includes('1000+') && !company.size.includes('1000') && !company.size.includes('10000')) return false;
        if (size.includes('201-1000') && !company.size.includes('201-1000')) return false;
        if (size.includes('10000+') && !company.size.includes('10000')) return false;
      }

      return true;
    });
  }, [search, industry, location, size]);

  const PER_PAGE = 8;
  const totalPages = Math.ceil(filteredCompanies.length / PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeFilters = [
    industry && industry !== 'All Industries',
    location && location !== 'All Locations',
    size && size !== 'All Sizes'
  ].filter(Boolean).length;

  return (
    <div className="companies-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-16)' }}>
      {/* Top Banner */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <div style={{ maxWidth: 700, marginBottom: 'var(--space-6)' }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>Explore Top Employers & Workplaces</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontSize: 'var(--text-base)' }}>
              Research company cultures, benefits, employee reviews, and current job openings across India's leading organizations.
            </p>
          </div>

          {/* Search & Filter bar */}
          <div className="responsive-filter-bar">
            <div className="input-wrapper">
              <span className="input-icon-left"><Search size={16} /></span>
              <input
                className="input has-icon-left"
                placeholder="Search company by name, technology or keyword..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <div>
              <Select
                options={INDUSTRIES}
                placeholder="All Industries"
                value={industry}
                onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
              />
            </div>

            <div>
              <Select
                options={LOCATIONS}
                placeholder="All Locations"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              />
            </div>

            <div>
              <Select
                options={COMPANY_SIZES}
                placeholder="Company Size"
                value={size}
                onChange={(e) => { setSize(e.target.value); setPage(1); }}
              />
            </div>

            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw size={14} />}>
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Company Grid */}
      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Showing <strong style={{ color: 'var(--color-text)' }}>{filteredCompanies.length}</strong> verified companies
          </p>
        </div>

        {filteredCompanies.length === 0 ? (
          <EmptyState
            icon="companies"
            title="No companies found"
            description="Try changing your industry filter, location or keyword query."
            action={<Button variant="primary" onClick={handleReset}>Clear Filters</Button>}
          />
        ) : (
          <>
            <div className="responsive-card-grid">
              {paginatedCompanies.map((company) => (
                <div
                  key={company.id}
                  className="card card-hoverable"
                  style={{
                    borderRadius: 'var(--radius-2xl)',
                    padding: 'var(--space-6)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)'
                  }}
                >
                  <div>
                    {/* Header: Logo + Rating */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 'var(--radius-xl)',
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
                        color: '#fff',
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {company.name?.[0] || 'C'}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        background: 'var(--color-warning-50)',
                        color: 'var(--color-warning-700)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700
                      }}>
                        <Star size={13} fill="currentColor" /> {company.rating || '4.5'}
                      </div>
                    </div>

                    <Link to={`/companies/${company.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 4 }}>
                        {company.name}
                      </h2>
                    </Link>

                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                      {company.industry}
                    </p>

                    <p style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      lineHeight: 'var(--leading-relaxed)',
                      marginBottom: 'var(--space-3)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {company.tagline || company.description}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={13} /> {company.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={13} /> {company.employees} employees
                      </span>
                    </div>
                  </div>

                  {/* Footer Stats & CTA */}
                  <div style={{
                    paddingTop: 'var(--space-4)',
                    borderTop: '1px solid var(--color-gray-100)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        color: 'var(--color-success-700)',
                        background: 'var(--color-success-50)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        {company.openJobsCount} Open Jobs
                      </span>
                    </div>
                    <Link to={`/companies/${company.id}`}>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ marginTop: 'var(--space-10)' }}>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={filteredCompanies.length}
                  pageSize={PER_PAGE}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
