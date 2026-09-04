import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutTemplate, Edit3, Image as ImageIcon, Sparkles,
  Briefcase, Building2, Users, TrendingUp, Award, ShieldCheck,
  GraduationCap, CalendarDays, ArrowUpRight, CheckCircle2,
  Save, RotateCcw, ExternalLink, Search, Check, UploadCloud, X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useAdmin, DEFAULT_HOME_CONTENT } from '../../context/AdminContext';
import heroImgDefault from '../../assets/hero.jpeg';

export default function AdminHomeContentPage() {
  const { addToast } = useToast();
  const { homeContent, updateHomeContent, resetHomeContent } = useAdmin();

  const currentContent = homeContent || DEFAULT_HOME_CONTENT;
  const hero = currentContent.hero || DEFAULT_HOME_CONTENT.hero;
  const stats = currentContent.stats || DEFAULT_HOME_CONTENT.stats;
  const whyChoose = currentContent.whyChoose || DEFAULT_HOME_CONTENT.whyChoose;

  // Modals state
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [wcModalOpen, setWcModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Hero Form State
  const [heroForm, setHeroForm] = useState({
    badge: hero.badge || '',
    heading1: hero.heading1 || '',
    heading2: hero.heading2 || '',
    subtext: hero.subtext || '',
    searchPlaceholder: hero.searchPlaceholder || '',
    popularSearchesText: (hero.popularSearches || []).join(', '),
    heroImage: hero.heroImage || null,
  });

  // Stats Form State
  const [statsForm, setStatsForm] = useState(
    stats.map(s => ({ ...s }))
  );

  // Why Choose Form State
  const [wcForm, setWcForm] = useState({
    heading1: whyChoose.heading1 || '',
    heading2: whyChoose.heading2 || '',
    subtitle: whyChoose.subtitle || '',
    cards: (whyChoose.cards || []).map(c => ({ ...c })),
  });

  const [savingHero, setSavingHero] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [savingWc, setSavingWc] = useState(false);

  // Available icon options for selectors
  const iconOptions = [
    { value: 'Briefcase', label: 'Briefcase (Jobs)' },
    { value: 'Building2', label: 'Building (Companies)' },
    { value: 'Users', label: 'Users (Candidates)' },
    { value: 'TrendingUp', label: 'Trending Up (Placements)' },
    { value: 'Award', label: 'Award (Achievements)' },
    { value: 'ShieldCheck', label: 'Shield Check (Trust)' },
    { value: 'GraduationCap', label: 'Graduation Cap (Skills)' },
    { value: 'CalendarDays', label: 'Calendar Days (Job Melas)' },
    { value: 'ArrowUpRight', label: 'Arrow Up Right (Applications)' },
    { value: 'CheckCircle2', label: 'Check Circle (Success)' },
    { value: 'Sparkles', label: 'Sparkles (Featured)' },
  ];

  const renderIcon = (iconName, size = 20) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase size={size} />;
      case 'Building2': return <Building2 size={size} />;
      case 'Users': return <Users size={size} />;
      case 'TrendingUp': return <TrendingUp size={size} />;
      case 'Award': return <Award size={size} />;
      case 'ShieldCheck': return <ShieldCheck size={size} />;
      case 'GraduationCap': return <GraduationCap size={size} />;
      case 'CalendarDays': return <CalendarDays size={size} />;
      case 'ArrowUpRight': return <ArrowUpRight size={size} />;
      case 'CheckCircle2': return <CheckCircle2 size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      default: return <Briefcase size={size} />;
    }
  };

  // 1. Save Hero Section
  const handleOpenHeroModal = () => {
    setHeroForm({
      badge: hero.badge || '',
      heading1: hero.heading1 || '',
      heading2: hero.heading2 || '',
      subtext: hero.subtext || '',
      searchPlaceholder: hero.searchPlaceholder || '',
      popularSearchesText: (hero.popularSearches || []).join(', '),
      heroImage: hero.heroImage || null,
    });
    setHeroModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setHeroForm(prev => ({ ...prev, heroImage: uploadEvent.target.result }));
      addToast('Hero image selected for preview. Click Save to publish.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHero = (e) => {
    e.preventDefault();
    if (!heroForm.heading1.trim()) {
      addToast('Heading line 1 is required.', 'error');
      return;
    }
    setSavingHero(true);
    const tags = heroForm.popularSearchesText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    setTimeout(() => {
      updateHomeContent({
        hero: {
          badge: heroForm.badge,
          heading1: heroForm.heading1,
          heading2: heroForm.heading2,
          subtext: heroForm.subtext,
          searchPlaceholder: heroForm.searchPlaceholder,
          popularSearches: tags.length ? tags : hero.popularSearches,
          heroImage: heroForm.heroImage,
        }
      });
      setSavingHero(false);
      setHeroModalOpen(false);
      addToast('Hero section content updated and published successfully.', 'success');
    }, 400);
  };

  // 2. Save Statistics Section
  const handleOpenStatsModal = () => {
    setStatsForm(stats.map(s => ({ ...s })));
    setStatsModalOpen(true);
  };

  const handleSaveStats = (e) => {
    e.preventDefault();
    setSavingStats(true);
    setTimeout(() => {
      updateHomeContent({ stats: statsForm });
      setSavingStats(false);
      setStatsModalOpen(false);
      addToast('Home page platform statistics updated successfully.', 'success');
    }, 400);
  };

  // 3. Save Why Choose Us Section
  const handleOpenWcModal = () => {
    setWcForm({
      heading1: whyChoose.heading1 || '',
      heading2: whyChoose.heading2 || '',
      subtitle: whyChoose.subtitle || '',
      cards: (whyChoose.cards || []).map(c => ({ ...c })),
    });
    setWcModalOpen(true);
  };

  const handleSaveWc = (e) => {
    e.preventDefault();
    setSavingWc(true);
    setTimeout(() => {
      updateHomeContent({ whyChoose: wcForm });
      setSavingWc(false);
      setWcModalOpen(false);
      addToast('Why Choose Us section and feature cards updated successfully.', 'success');
    }, 400);
  };

  const handleResetToDefaults = () => {
    resetHomeContent();
    setResetModalOpen(false);
    addToast('Home Page content reset to default state.', 'info');
  };

  return (
    <div className="admin-home-content-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <LayoutTemplate size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Home Page Content Management</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Manage public hero banner messaging, platform statistics, and feature highlights.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="sm" leftIcon={<ExternalLink size={14} />}>
                View Live Home Page
              </Button>
            </Link>
            <Button variant="danger" size="sm" leftIcon={<RotateCcw size={14} />} onClick={() => setResetModalOpen(true)}>
              Reset Defaults
            </Button>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: HERO SECTION CARD ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Sparkles size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title" style={{ margin: 0, fontSize: 'var(--text-lg)' }}>1. Hero Banner Section</h2>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Edit3 size={14} />} onClick={handleOpenHeroModal}>
            Edit Hero Section
          </Button>
        </div>

        <div className="card-body" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Live Preview of Hero Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: '#c7d2fe',
                background: 'rgba(99,102,241,0.2)',
                border: '1px solid rgba(165,180,252,0.3)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                marginBottom: 'var(--space-3)'
              }}>
                <Sparkles size={12} style={{ color: '#a5b4fc' }} />
                <span>{hero.badge || 'Most Trusted Career & Job Fair Network'}</span>
              </div>

              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, margin: '0 0 var(--space-2) 0' }}>
                {hero.heading1} <br />
                <span style={{
                  background: 'linear-gradient(135deg, #a5b4fc 0%, #e0e7ff 50%, #f5d0fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {hero.heading2}
                </span>
              </h3>

              <p style={{ fontSize: 'var(--text-sm)', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 var(--space-4) 0' }}>
                {hero.subtext}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                color: '#64748b',
                padding: '8px 14px',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-xs)',
                maxWidth: 440,
                marginBottom: 'var(--space-3)',
                gap: 'var(--space-2)'
              }}>
                <Search size={14} />
                <span>{hero.searchPlaceholder || 'Search job titles, required skills, keywords...'}</span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Popular Searches:</span>
                {(hero.popularSearches || []).map(tag => (
                  <span key={tag} style={{
                    padding: '2px 8px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '10px',
                    color: '#e2e8f0'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Background Image Thumbnail Badge */}
            <div style={{
              position: 'absolute',
              right: 20,
              bottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'rgba(0,0,0,0.4)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-lg)',
              fontSize: '11px',
              backdropFilter: 'blur(4px)'
            }}>
              <ImageIcon size={14} style={{ color: '#93c5fd' }} />
              <span>Background: {hero.heroImage ? 'Custom Admin Image Uploaded' : 'Default Portal Graphic Asset'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: STATISTICS SECTION CARD ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title" style={{ margin: 0, fontSize: 'var(--text-lg)' }}>2. Home Page Statistics</h2>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Edit3 size={14} />} onClick={handleOpenStatsModal}>
            Edit Statistics
          </Button>
        </div>

        <div className="card-body" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            {stats.map((stat) => (
              <div key={stat.id || stat.label} style={{
                background: 'var(--color-gray-50)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-primary-50)',
                  color: 'var(--color-primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-2)'
                }}>
                  {renderIcon(stat.icon, 22)}
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: WHY CHOOSE US SECTION CARD ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ShieldCheck size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title" style={{ margin: 0, fontSize: 'var(--text-lg)' }}>3. "Why Choose Our Job Portal" Section</h2>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Edit3 size={14} />} onClick={handleOpenWcModal}>
            Edit Why Choose Section
          </Button>
        </div>

        <div className="card-body" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Section Heading Preview */}
          <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: '0 0 4px 0' }}>
              {whyChoose.heading1} <span style={{ color: 'var(--color-primary-600)' }}>{whyChoose.heading2}</span>
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              {whyChoose.subtitle}
            </p>
          </div>

          {/* 6 Feature Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
            {(whyChoose.cards || []).map((card, idx) => (
              <div key={card.id || card.title} style={{
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)'
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-50)',
                  color: 'var(--color-primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {renderIcon(card.icon, 18)}
                </div>
                <div>
                  <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', display: 'block', marginBottom: 2 }}>
                    {idx + 1}. {card.title}
                  </strong>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODAL 1: EDIT HERO SECTION ── */}
      {heroModalOpen && (
        <Modal
          isOpen={heroModalOpen}
          onClose={() => setHeroModalOpen(false)}
          title="Edit Home Page Hero Banner"
          size="lg"
        >
          <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FormField label="Badge Highlight Text" required>
              <Input
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                placeholder="e.g. Most Trusted Career & Job Fair Network"
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Main Heading (Line 1)" required>
                <Input
                  value={heroForm.heading1}
                  onChange={(e) => setHeroForm({ ...heroForm, heading1: e.target.value })}
                  placeholder="e.g. Find Your Dream Job."
                />
              </FormField>

              <FormField label="Main Heading Gradient (Line 2)" required>
                <Input
                  value={heroForm.heading2}
                  onChange={(e) => setHeroForm({ ...heroForm, heading2: e.target.value })}
                  placeholder="e.g. Accelerate Your Career."
                />
              </FormField>
            </div>

            <FormField label="Hero Description / Subtext" required>
              <Textarea
                rows={3}
                value={heroForm.subtext}
                onChange={(e) => setHeroForm({ ...heroForm, subtext: e.target.value })}
                placeholder="Connect with top verified recruiters..."
              />
            </FormField>

            <FormField label="Search Bar Placeholder Text">
              <Input
                value={heroForm.searchPlaceholder}
                onChange={(e) => setHeroForm({ ...heroForm, searchPlaceholder: e.target.value })}
                placeholder="Search job titles, required skills, keywords, companies..."
              />
            </FormField>

            <FormField label="Popular Search Keywords (Comma-separated)">
              <Input
                value={heroForm.popularSearchesText}
                onChange={(e) => setHeroForm({ ...heroForm, popularSearchesText: e.target.value })}
                placeholder="React, Python, Java, Data Science, Figma, Fintech, Freshers, Remote"
              />
            </FormField>

            {/* Hero Image Management */}
            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, display: 'block', marginBottom: 'var(--space-2)' }}>
                Hero Banner Background Graphic
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                <img
                  src={heroForm.heroImage || heroImgDefault}
                  alt="Hero Graphic Preview"
                  style={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}>
                    <UploadCloud size={14} /> Upload Custom Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  {heroForm.heroImage && (
                    <button
                      type="button"
                      onClick={() => setHeroForm({ ...heroForm, heroImage: null })}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger-600)', fontSize: 'var(--text-xs)', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                    >
                      Reset to default artwork
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <Button variant="outline" type="button" onClick={() => setHeroModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={savingHero} leftIcon={<Save size={14} />}>
                Save & Publish Hero Content
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL 2: EDIT STATISTICS ── */}
      {statsModalOpen && (
        <Modal
          isOpen={statsModalOpen}
          onClose={() => setStatsModalOpen(false)}
          title="Edit Home Page Platform Statistics"
          size="lg"
        >
          <form onSubmit={handleSaveStats} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Update display values, labels, and icons for the four key counters shown on the public landing page.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {statsForm.map((stat, idx) => (
                <div key={stat.id || idx} style={{
                  background: 'var(--color-gray-50)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1.2fr',
                  gap: 'var(--space-3)',
                  alignItems: 'center'
                }}>
                  <FormField label={`Statistic #${idx + 1} Label`}>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const next = [...statsForm];
                        next[idx].label = e.target.value;
                        setStatsForm(next);
                      }}
                    />
                  </FormField>

                  <FormField label="Display Value">
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const next = [...statsForm];
                        next[idx].value = e.target.value;
                        setStatsForm(next);
                      }}
                    />
                  </FormField>

                  <FormField label="Display Icon">
                    <Select
                      value={stat.icon}
                      options={iconOptions}
                      onChange={(e) => {
                        const next = [...statsForm];
                        next[idx].icon = e.target.value;
                        setStatsForm(next);
                      }}
                    />
                  </FormField>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <Button variant="outline" type="button" onClick={() => setStatsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={savingStats} leftIcon={<Save size={14} />}>
                Save Statistics
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL 3: EDIT WHY CHOOSE SECTION ── */}
      {wcModalOpen && (
        <Modal
          isOpen={wcModalOpen}
          onClose={() => setWcModalOpen(false)}
          title="Edit Why Choose Our Job Portal Section"
          size="xl"
        >
          <form onSubmit={handleSaveWc} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Section Heading (Prefix)" required>
                <Input
                  value={wcForm.heading1}
                  onChange={(e) => setWcForm({ ...wcForm, heading1: e.target.value })}
                  placeholder="Why Choose"
                />
              </FormField>

              <FormField label="Section Heading (Highlight)" required>
                <Input
                  value={wcForm.heading2}
                  onChange={(e) => setWcForm({ ...wcForm, heading2: e.target.value })}
                  placeholder="Our Job Portal?"
                />
              </FormField>
            </div>

            <FormField label="Section Subtitle" required>
              <Textarea
                rows={2}
                value={wcForm.subtitle}
                onChange={(e) => setWcForm({ ...wcForm, subtitle: e.target.value })}
                placeholder="Everything you need to launch, accelerate..."
              />
            </FormField>

            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, margin: 'var(--space-2) 0 0 0' }}>
              Feature Cards (6 Cards)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', maxHeight: '380px', overflowY: 'auto', paddingRight: 4 }}>
              {wcForm.cards.map((card, idx) => (
                <div key={card.id || idx} style={{
                  background: 'var(--color-gray-50)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--color-primary-700)' }}>Card #{idx + 1}</strong>
                    <div style={{ width: 140 }}>
                      <Select
                        value={card.icon}
                        options={iconOptions}
                        onChange={(e) => {
                          const nextCards = [...wcForm.cards];
                          nextCards[idx].icon = e.target.value;
                          setWcForm({ ...wcForm, cards: nextCards });
                        }}
                      />
                    </div>
                  </div>

                  <Input
                    value={card.title}
                    onChange={(e) => {
                      const nextCards = [...wcForm.cards];
                      nextCards[idx].title = e.target.value;
                      setWcForm({ ...wcForm, cards: nextCards });
                    }}
                    placeholder="Card Title"
                    style={{ fontSize: 'var(--text-xs)' }}
                  />

                  <Textarea
                    rows={2}
                    value={card.desc}
                    onChange={(e) => {
                      const nextCards = [...wcForm.cards];
                      nextCards[idx].desc = e.target.value;
                      setWcForm({ ...wcForm, cards: nextCards });
                    }}
                    placeholder="Short description..."
                    style={{ fontSize: 'var(--text-xs)' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <Button variant="outline" type="button" onClick={() => setWcModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={savingWc} leftIcon={<Save size={14} />}>
                Save Why Choose Section
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── RESET CONFIRMATION MODAL ── */}
      {resetModalOpen && (
        <Modal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          title="Reset Home Page Content to Defaults"
          size="sm"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Are you sure you want to reset all Home Page content (Hero messaging, statistics, and Why Choose cards) back to the default platform values?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="outline" size="sm" onClick={() => setResetModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" leftIcon={<RotateCcw size={14} />} onClick={handleResetToDefaults}>
                Yes, Reset Defaults
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
