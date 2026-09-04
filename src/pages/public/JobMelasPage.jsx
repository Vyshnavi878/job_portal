import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, MapPin, Building2, Users, Search,
  Clock, ArrowRight, CheckCircle2, Sparkles, Filter
} from 'lucide-react';
import { Tabs, TabsList, Tab, TabPanel } from '../../components/ui/Tabs';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/States';
import { MOCK_JOB_MELAS } from '../../data/mockData';
import { useAdmin, DEFAULT_JOB_MELA_CONTENT } from '../../context/AdminContext';

export default function JobMelasPage() {
  const { jobMelaContent } = useAdmin();
  const currentContent = jobMelaContent || DEFAULT_JOB_MELA_CONTENT;
  const hero = currentContent.hero || DEFAULT_JOB_MELA_CONTENT.hero;

  const [activeTab, setActiveTab] = useState('upcoming');
  const [cityFilter, setCityFilter] = useState('');
  const [search, setSearch] = useState('');

  const upcomingMelas = useMemo(() => {
    return MOCK_JOB_MELAS.filter(m => m.status === 'UPCOMING' || m.status === 'REGISTRATION_OPEN');
  }, []);

  const ongoingMelas = useMemo(() => {
    return MOCK_JOB_MELAS.filter(m => m.status === 'ONGOING');
  }, []);

  const completedMelas = useMemo(() => {
    return MOCK_JOB_MELAS.filter(m => m.status === 'COMPLETED');
  }, []);

  const getFilteredList = (list) => {
    return list.filter(m => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchCity = m.city.toLowerCase().includes(q);
        const matchVenue = m.venue.toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchVenue) return false;
      }
      if (cityFilter && m.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
      return true;
    });
  };

  const currentList = useMemo(() => {
    if (activeTab === 'ongoing') return getFilteredList(ongoingMelas);
    if (activeTab === 'completed') return getFilteredList(completedMelas);
    return getFilteredList(upcomingMelas);
  }, [activeTab, search, cityFilter, upcomingMelas, ongoingMelas, completedMelas]);

  return (
    <div className="job-melas-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-16)' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        color: '#ffffff',
        padding: 'var(--space-12) 0',
      }}>
        <div className="container">
          <div style={{ maxWidth: 760 }}>
            <div className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.15)', color: '#c7d2fe', border: '1px solid rgba(255,255,255,0.2)', marginBottom: 'var(--space-3)' }}>
              <CalendarDays size={12} style={{ marginRight: 4 }} /> {hero.badge || 'Nationwide Recruitment Drives'}
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: 'var(--space-3)', color: '#ffffff' }}>
              {hero.heading || 'Mega Job Melas & Career Fairs'}
            </h1>
            <p style={{ fontSize: 'var(--text-base)', color: '#cbd5e1', lineHeight: 'var(--leading-relaxed)' }}>
              {hero.description || 'Attend on-ground walk-in interview sessions with 100+ hiring companies, receive free career guidance, and get spot job offer letters. Free registration for all job seekers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content & Tabs */}
      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flex: 1, maxWidth: 540 }}>
            <div className="input-wrapper" style={{ flex: 1 }}>
              <span className="input-icon-left"><Search size={16} /></span>
              <input
                className="input has-icon-left"
                placeholder="Search job mela by title, city, or venue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="select"
              style={{ width: 170 }}
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="">All Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>
          </div>
        </div>

        {/* Status Tabs: Upcoming, Ongoing, Completed */}
        <Tabs defaultTab="upcoming" value={activeTab} onChange={setActiveTab}>
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <TabsList>
              <Tab value="upcoming" badge={upcomingMelas.length}>
                Upcoming Events
              </Tab>
              <Tab value="ongoing" badge={ongoingMelas.length}>
                Ongoing Today
              </Tab>
              <Tab value="completed" badge={completedMelas.length}>
                Past & Concluded
              </Tab>
            </TabsList>
          </div>

          {currentList.length === 0 ? (
            <EmptyState
              icon="default"
              title={`No ${activeTab} job melas found`}
              description="Check back soon for new announcements or try clearing your search and city filters."
              action={
                <Button variant="primary" onClick={() => { setSearch(''); setCityFilter(''); }}>
                  Reset Filters
                </Button>
              }
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
              {currentList.map((mela) => (
                <div
                  key={mela.id}
                  className="card card-hoverable"
                  style={{
                    borderRadius: 'var(--radius-2xl)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {/* Top color header */}
                  <div style={{
                    background: mela.status === 'ONGOING'
                      ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                      : mela.status === 'COMPLETED'
                      ? 'linear-gradient(135deg, #475569 0%, #64748b 100%)'
                      : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    padding: 'var(--space-4) var(--space-6)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#fff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <CalendarDays size={16} />
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                        {new Date(mela.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <StatusBadge status={mela.status} size="sm" />
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <Link to={`/job-melas/${mela.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, lineHeight: 1.3 }}>
                        {mela.title}
                      </h2>
                    </Link>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={14} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                        <span>{mela.venue}, <strong>{mela.city}</strong></span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                        <span>{mela.time}</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={14} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                        <span><strong>{mela.companiesCount}+ Companies</strong> Participating</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Sparkles size={14} style={{ color: 'var(--color-accent-600)', flexShrink: 0 }} />
                        <span><strong>{mela.totalOpportunities}</strong> Available</span>
                      </span>
                    </div>

                    <p style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      lineHeight: 'var(--leading-relaxed)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginTop: 'var(--space-1)'
                    }}>
                      {mela.description}
                    </p>
                  </div>

                  {/* Footer CTA & Seats Status */}
                  <div style={{
                    padding: 'var(--space-4) var(--space-6)',
                    background: 'var(--color-gray-50)',
                    borderTop: '1px solid var(--color-gray-100)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      {mela.seats && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          <strong>{mela.seats - (mela.registeredCount || 0)}</strong> seats remaining
                        </p>
                      )}
                    </div>

                    <Link to={`/job-melas/${mela.id}`}>
                      <Button
                        size="sm"
                        variant={mela.status === 'COMPLETED' ? 'secondary' : 'primary'}
                        rightIcon={<ArrowRight size={14} />}
                      >
                        {mela.status === 'COMPLETED' ? 'View Summary' : 'View Details & Register'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
