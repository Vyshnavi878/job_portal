import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Building2, TrendingUp, ShieldCheck,
  Target, Sparkles, Award, Heart, ArrowRight, CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import CardCarousel from '../../components/ui/CardCarousel';
import { MOCK_STATS, WHY_CHOOSE_US } from '../../data/mockData';

export default function AboutPage() {
  const leadershipTeam = [
    { name: 'Dr. Ramesh Sundaram', role: 'Founder & Managing Director', bio: 'Former National Employment Council advisor with 20+ years driving talent mobility initiatives.' },
    { name: 'Ananya Deshmukh', role: 'Chief Technology Officer', bio: 'Ex-Google & Flipkart engineering leader passionate about AI-driven career matching.' },
    { name: 'Siddharth Nair', role: 'Head of Employer Partnerships', bio: 'Built recruitment pipelines across 500+ Indian corporate enterprises and SME networks.' },
    { name: 'Meera Sengupta', role: 'Director of Diversity & Job Melas', bio: 'Pioneered inclusive job fairs for women, PwD, and tier-2/3 college graduates across India.' },
  ];

  return (
    <div className="about-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-20)' }}>
      {/* ── Hero Section ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        color: '#ffffff',
        padding: 'var(--space-20) var(--space-6)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: 840, position: 'relative', zIndex: 1 }}>
          <div className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.15)', color: '#c7d2fe', marginBottom: 'var(--space-4)' }}>
            <Sparkles size={12} style={{ marginRight: 4 }} /> Our Mission & Impact
          </div>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 'var(--space-4)', color: '#ffffff' }}>
            Bridging Talent with Opportunity Across India
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: '#cbd5e1', lineHeight: 'var(--leading-relaxed)' }}>
            NTR VIKASA Job Portal was founded on a simple principle: every candidate deserves fair, direct access to employment opportunities without scam fees, opaque processes, or dead ends.
          </p>
        </div>
      </section>

      {/* ── Platform Stats ── */}
      <section style={{ background: 'var(--color-surface)', padding: 'var(--space-12) 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', textAlign: 'center' }}>
            <div>
              <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-primary-600)' }}>{MOCK_STATS.totalCandidates}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>Registered Job Seekers</p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-success-600)' }}>{MOCK_STATS.totalPlacements}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>Confirmed Placements</p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-warning-600)' }}>{MOCK_STATS.totalCompanies}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>Verified Hiring Employers</p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-info-600)' }}>{MOCK_STATS.activeJobMelas}</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>State-Wide Job Melas Held</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Core Values ── */}
      <section className="container" style={{ paddingTop: 'var(--space-16)' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto var(--space-12)' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
            What We Stand For
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)' }}>
            Guiding principles that power our candidate-first architecture and employer verification policies.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-2xl)' }}>
            <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-xl)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>100% Verified Quality</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              Every single recruiter profile and job listing is reviewed to eliminate illegitimate recruiters and recruitment charges.
            </p>
          </div>

          <div className="card" style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-2xl)' }}>
            <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-xl)', background: 'var(--color-success-50)', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <Target size={26} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Transparent Application Lifecycle</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              Candidates receive live feedback across all 20 standard recruitment milestones from applied to interview to offer letters.
            </p>
          </div>

          <div className="card" style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-2xl)' }}>
            <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-xl)', background: 'var(--color-warning-50)', color: 'var(--color-warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <Users size={26} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Inclusive Mega Job Melas</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              Bringing top corporate opportunities directly to Tier-2, Tier-3 and rural graduate communities through walk-in physical fairs.
            </p>
          </div>
        </div>
      </section>

      {/* ── Leadership Team ── */}
      <section className="container" style={{ paddingTop: 'var(--space-20)' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto var(--space-12)' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
            Leadership Team
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)' }}>
            Experienced leaders with backgrounds across technology, public policy, and corporate recruitment.
          </p>
        </div>

        <CardCarousel
          items={leadershipTeam}
          desktopItems={4}
          tabletItems={2}
          mobileItems={1}
          gap={20}
          renderItem={(member) => (
            <div
              key={member.name}
              className="card"
              style={{
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-2xl)',
                textAlign: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
                color: '#fff', fontSize: 'var(--text-2xl)', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                flexShrink: 0
              }}>
                {member.name[0]}
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>{member.name}</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>{member.role}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>{member.bio}</p>
            </div>
          )}
        />
      </section>

      {/* ── Bottom CTA ── */}
      <section className="container" style={{ paddingTop: 'var(--space-20)' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-900))',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-12) var(--space-8)',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)', color: '#ffffff' }}>
            Join the NTR VIKASA Job Portal Community Today
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: 'var(--text-base)', maxWidth: 600, margin: '0 auto var(--space-8)' }}>
            Whether you are looking for your next career breakthrough or hiring top talent, we are here to support your journey.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register/candidate"><Button variant="primary" size="lg" style={{ background: '#ffffff', color: 'var(--color-primary-900)' }}>Register as Candidate</Button></Link>
            <Link to="/contact"><Button variant="outline" size="lg" style={{ borderColor: '#ffffff', color: '#ffffff' }}>Contact Support</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
