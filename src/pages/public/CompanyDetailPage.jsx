import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2, MapPin, Users, Globe, Mail, Phone, Calendar,
  Star, Briefcase, GraduationCap, CheckCircle2, ExternalLink,
  Sparkles, ArrowLeft
} from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import { JobCard, InternshipCard } from '../../components/ui/EntityCards';
import { Tabs, TabsList, Tab, TabPanel } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/States';
import { MOCK_COMPANIES, MOCK_JOBS, MOCK_INTERNSHIPS } from '../../data/mockData';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('jobs');

  const company = useMemo(() => {
    return MOCK_COMPANIES.find((c) => c.id === id) || MOCK_COMPANIES[0];
  }, [id]);

  const openJobs = useMemo(() => {
    return MOCK_JOBS.filter((j) => j.companyId === company.id || j.company.toLowerCase() === company.name.toLowerCase());
  }, [company]);

  const internships = useMemo(() => {
    return MOCK_INTERNSHIPS.filter((i) => i.companyId === company.id || i.company.toLowerCase() === company.name.toLowerCase());
  }, [company]);

  return (
    <div className="company-detail-page" style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      {/* Breadcrumb Header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Companies', href: '/companies' }, { label: company.name }]} />
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        {/* Company Hero Profile Header */}
        <div className="card" style={{ marginBottom: 'var(--space-8)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
          {/* Header Banner */}
          <div style={{
            height: '140px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #4f46e5 100%)',
            position: 'relative'
          }} />

          <div className="card-body" style={{ padding: '0 var(--space-8) var(--space-8)', position: 'relative' }}>
            {/* Logo Badge offset */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
              marginTop: '-50px',
              marginBottom: 'var(--space-5)'
            }}>
              <div style={{
                width: 96,
                height: 96,
                borderRadius: 'var(--radius-2xl)',
                background: '#ffffff',
                boxShadow: 'var(--shadow-lg)',
                border: '4px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-4xl)',
                fontWeight: 800,
                color: 'var(--color-primary-600)'
              }}>
                {company.name?.[0] || 'C'}
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="sm" rightIcon={<ExternalLink size={14} />}>
                      Visit Website
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Title & Tagline */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>{company.name}</h1>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'var(--color-warning-50)',
                  color: 'var(--color-warning-700)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700
                }}>
                  <Star size={13} fill="currentColor" /> {company.rating || 4.5} rating
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', maxWidth: 800 }}>
                {company.tagline || company.description}
              </p>
            </div>

            {/* Meta tags bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-6)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-border)',
              fontSize: 'var(--text-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
                <Building2 size={16} style={{ color: 'var(--color-primary-600)' }} />
                <span>Industry: <strong>{company.industry}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
                <Users size={16} style={{ color: 'var(--color-primary-600)' }} />
                <span>Size: <strong>{company.size} ({company.employees})</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
                <MapPin size={16} style={{ color: 'var(--color-primary-600)' }} />
                <span>HQ: <strong>{company.location}</strong></span>
              </div>
              {company.foundedYear && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
                  <Calendar size={16} style={{ color: 'var(--color-primary-600)' }} />
                  <span>Founded: <strong>{company.foundedYear}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Layout: Info Sidebar + Tabs (Open Jobs, Internships, About) */}
        <div className="responsive-split-detail">

          {/* ── Left Content: Tabs for Open Jobs & Internships ── */}
          <div>
            <Tabs defaultTab="jobs" value={activeTab} onChange={setActiveTab}>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <TabsList>
                  <Tab value="jobs" badge={openJobs.length}>
                    <Briefcase size={16} style={{ marginRight: 6 }} /> Open Jobs
                  </Tab>
                  <Tab value="internships" badge={internships.length}>
                    <GraduationCap size={16} style={{ marginRight: 6 }} /> Internships
                  </Tab>
                  <Tab value="about">About & Culture</Tab>
                </TabsList>
              </div>

              {/* Tab 1: Open Jobs */}
              <TabPanel value="jobs">
                {openJobs.length === 0 ? (
                  <EmptyState
                    icon="jobs"
                    title={`No active jobs at ${company.name}`}
                    description="Check back soon or explore other verified hiring employers."
                    action={<Link to="/jobs"><Button variant="primary">Browse All Jobs</Button></Link>}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {openJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </TabPanel>

              {/* Tab 2: Internships */}
              <TabPanel value="internships">
                {internships.length === 0 ? (
                  <EmptyState
                    icon="default"
                    title={`No active internships at ${company.name}`}
                    description="Internship opportunities will appear here once published by the recruiter."
                    action={<Link to="/internships"><Button variant="primary">Browse All Internships</Button></Link>}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {internships.map((internship) => (
                      <InternshipCard key={internship.id} internship={internship} />
                    ))}
                  </div>
                )}
              </TabPanel>

              {/* Tab 3: About & Culture */}
              <TabPanel value="about">
                <div className="card" style={{ borderRadius: 'var(--radius-2xl)', marginBottom: 'var(--space-6)' }}>
                  <div className="card-header">
                    <h2 className="card-title">Company Overview</h2>
                  </div>
                  <div className="card-body">
                    <p style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text)' }}>
                      {company.description}
                    </p>
                  </div>
                </div>

                {company.culture && (
                  <div className="card" style={{ borderRadius: 'var(--radius-2xl)', marginBottom: 'var(--space-6)' }}>
                    <div className="card-header">
                      <h2 className="card-title">Work Culture & Values</h2>
                    </div>
                    <div className="card-body">
                      <p style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text)' }}>
                        {company.culture}
                      </p>
                    </div>
                  </div>
                )}

                {company.benefits && (
                  <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
                    <div className="card-header">
                      <h2 className="card-title">Employee Benefits & Perks</h2>
                    </div>
                    <div className="card-body">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                        {company.benefits.map((b, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                            <CheckCircle2 size={16} style={{ color: 'var(--color-success-600)', flexShrink: 0 }} />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabPanel>
            </Tabs>
          </div>

          {/* ── Right Sidebar: Contact & Quick Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 'var(--text-base)' }}>Company Information</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                {company.address && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Office Address</span>
                    <strong style={{ fontSize: 'var(--text-xs)', lineHeight: 1.4 }}>{company.address}</strong>
                  </div>
                )}
                {company.website && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Website</span>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', wordBreak: 'break-all' }}>
                      {company.website}
                    </a>
                  </div>
                )}
                {company.email && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Careers Email</span>
                    <a href={`mailto:${company.email}`} style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}>
                      {company.email}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Contact Phone</span>
                    <span>{company.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', textAlign: 'center' }}>
              <Sparkles size={28} style={{ color: 'var(--color-primary-600)', margin: '0 auto var(--space-2)' }} />
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                Want to work at {company.name}?
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Explore open positions above and submit your resume directly to their hiring team.
              </p>
              <Button variant="primary" size="sm" fullWidth onClick={() => setActiveTab('jobs')}>
                View {openJobs.length} Open Positions
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
