import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Award, Sparkles, Building2, Briefcase, ExternalLink,
  RotateCcw, Edit3, Plus, Trash2, CheckCircle2, MessageSquare,
  ShieldCheck, ArrowRight, Eye, EyeOff, X, Layers, Target,
  TrendingUp, BarChart2, Check
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useAdmin, DEFAULT_ABOUT_CONTENT } from '../../context/AdminContext';

const AVAILABLE_ICONS = [
  'ShieldCheck', 'Target', 'Users', 'Award', 'Sparkles',
  'TrendingUp', 'Building2', 'Briefcase', 'CheckCircle2'
];

export default function AdminAboutContentPage() {
  const { addToast } = useToast();
  const { aboutContent, updateAboutContent, resetAboutContent } = useAdmin();

  const currentContent = aboutContent || DEFAULT_ABOUT_CONTENT;
  const hero = currentContent.hero || DEFAULT_ABOUT_CONTENT.hero;
  const stats = currentContent.stats || DEFAULT_ABOUT_CONTENT.stats;
  const whatWeStandFor = currentContent.whatWeStandFor || DEFAULT_ABOUT_CONTENT.whatWeStandFor;
  const team = currentContent.team || DEFAULT_ABOUT_CONTENT.team;
  const leadershipMessages = currentContent.leadershipMessages || DEFAULT_ABOUT_CONTENT.leadershipMessages;
  const partners = currentContent.partners || DEFAULT_ABOUT_CONTENT.partners;

  // Modals state
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [whatWeStandForModalOpen, setWhatWeStandForModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [partnersModalOpen, setPartnersModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Form states
  const [heroForm, setHeroForm] = useState({
    badge: hero.badge || 'Our Mission & Impact',
    heading: hero.heading || 'Bridging Talent with Opportunity Across India',
    description: hero.description || '',
  });

  const [statsForm, setStatsForm] = useState(
    (stats || DEFAULT_ABOUT_CONTENT.stats).map(s => ({ ...s }))
  );

  const [whatWeStandForForm, setWhatWeStandForForm] = useState({
    heading: whatWeStandFor.heading || 'What We Stand For',
    description: whatWeStandFor.description || '',
    cards: (whatWeStandFor.cards || DEFAULT_ABOUT_CONTENT.whatWeStandFor.cards).map(c => ({ ...c })),
  });

  const [teamForm, setTeamForm] = useState({
    badge: team.badge || 'Our Leadership & Team',
    heading: team.heading || 'Our Team',
    description: team.description || '',
    members: (team.members || []).map(m => ({ ...m })),
  });

  const [messagesForm, setMessagesForm] = useState({
    badge: leadershipMessages.badge || 'LEADERSHIP',
    heading: leadershipMessages.heading || 'Leadership Messages',
    description: leadershipMessages.description || '',
    messages: (leadershipMessages.messages || []).map(m => ({ ...m })),
  });

  const [partnersForm, setPartnersForm] = useState({
    heading: partners.heading || 'OUR INDUSTRY & ACADEMIC TRAINING PARTNERS',
    description: partners.description || '',
    list: (partners.list || []).map(p => ({ ...p })),
  });

  const [saving, setSaving] = useState(false);

  // Icon preview helper
  const renderIconPreview = (iconName, size = 18) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck size={size} />;
      case 'Target': return <Target size={size} />;
      case 'Users': return <Users size={size} />;
      case 'Award': return <Award size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'TrendingUp': return <TrendingUp size={size} />;
      case 'Building2': return <Building2 size={size} />;
      case 'Briefcase': return <Briefcase size={size} />;
      default: return <CheckCircle2 size={size} />;
    }
  };

  // 1. Save Hero
  const handleSaveHero = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateAboutContent({ hero: heroForm });
      setSaving(false);
      setHeroModalOpen(false);
      addToast('Hero section updated successfully!', 'success');
    }, 250);
  };

  // 2. Save Stats
  const handleSaveStats = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateAboutContent({ stats: statsForm });
      setSaving(false);
      setStatsModalOpen(false);
      addToast('Statistics updated successfully!', 'success');
    }, 250);
  };

  // 3. Save What We Stand For
  const handleSaveWhatWeStandFor = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateAboutContent({ whatWeStandFor: whatWeStandForForm });
      setSaving(false);
      setWhatWeStandForModalOpen(false);
      addToast('What We Stand For section updated successfully!', 'success');
    }, 250);
  };

  // 4. Save Team
  const handleSaveTeam = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateAboutContent({ team: teamForm });
      setSaving(false);
      setTeamModalOpen(false);
      addToast('Our Team section updated successfully!', 'success');
    }, 250);
  };

  // 5. Save Leadership Messages
  const handleSaveMessages = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateAboutContent({ leadershipMessages: messagesForm });
      setSaving(false);
      setMessagesModalOpen(false);
      addToast('Leadership Messages updated successfully!', 'success');
    }, 250);
  };

  // 6. Save Partners
  const handleSavePartners = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateAboutContent({ partners: partnersForm });
      setSaving(false);
      setPartnersModalOpen(false);
      addToast('Industry & Academic Partners updated successfully!', 'success');
    }, 250);
  };

  // Reset all to defaults
  const handleConfirmReset = () => {
    resetAboutContent();
    setHeroForm({ ...DEFAULT_ABOUT_CONTENT.hero });
    setStatsForm(DEFAULT_ABOUT_CONTENT.stats.map(s => ({ ...s })));
    setWhatWeStandForForm({
      ...DEFAULT_ABOUT_CONTENT.whatWeStandFor,
      cards: DEFAULT_ABOUT_CONTENT.whatWeStandFor.cards.map(c => ({ ...c }))
    });
    setTeamForm({
      ...DEFAULT_ABOUT_CONTENT.team,
      members: DEFAULT_ABOUT_CONTENT.team.members.map(m => ({ ...m }))
    });
    setMessagesForm({
      ...DEFAULT_ABOUT_CONTENT.leadershipMessages,
      messages: DEFAULT_ABOUT_CONTENT.leadershipMessages.messages.map(m => ({ ...m }))
    });
    setPartnersForm({
      ...DEFAULT_ABOUT_CONTENT.partners,
      list: DEFAULT_ABOUT_CONTENT.partners.list.map(p => ({ ...p }))
    });
    setResetModalOpen(false);
    addToast('About Us content reset to default values.', 'info');
  };

  // Team member helpers
  const handleAddMember = () => {
    setTeamForm(prev => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id: `team-${Date.now()}`,
          name: '',
          role: '',
          organization: 'NTR Vikasa',
          bio: '',
          image: null
        }
      ]
    }));
  };

  const handleRemoveMember = (idx) => {
    setTeamForm(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== idx)
    }));
  };

  // Message helpers
  const handleAddMessage = () => {
    setMessagesForm(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: `msg-${Date.now()}`,
          name: '',
          designation: '',
          organization: 'Vikasa Jobs',
          image: null,
          initials: 'VK',
          headerBg: '#0f2a59',
          message: '',
          fullMessage: '',
          hasViewAction: true
        }
      ]
    }));
  };

  const handleRemoveMessage = (idx) => {
    setMessagesForm(prev => ({
      ...prev,
      messages: prev.messages.filter((_, i) => i !== idx)
    }));
  };

  // Partner helpers
  const handleAddPartner = () => {
    setPartnersForm(prev => ({
      ...prev,
      list: [
        ...prev.list,
        {
          id: `p-${Date.now()}`,
          name: '',
          logoText: '',
          active: true,
          order: prev.list.length + 1
        }
      ]
    }));
  };

  const handleRemovePartner = (idx) => {
    setPartnersForm(prev => ({
      ...prev,
      list: prev.list.filter((_, i) => i !== idx)
    }));
  };

  const handleTogglePartnerActive = (idx) => {
    setPartnersForm(prev => {
      const updated = [...prev.list];
      updated[idx] = { ...updated[idx], active: !updated[idx].active };
      return { ...prev, list: updated };
    });
  };

  return (
    <div className="admin-about-content-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      {/* ── Page Header Bar ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Users size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>About Us Page Content</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Manage Hero, Key Statistics, What We Stand For, Our Team, Leadership Messages, and Training Partners on the public About Us page.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <a
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="outline" size="sm" leftIcon={<ExternalLink size={14} />}>
                View Public Page
              </Button>
            </a>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw size={14} />}
              onClick={() => setResetModalOpen(true)}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>

      {/* ── 6 Main Content Sections Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>

        {/* 1. Hero / Mission & Impact Section Card */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary-600)', background: 'var(--color-primary-50)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                Section 1
              </span>
              <Button size="xs" variant="primary" leftIcon={<Edit3 size={13} />} onClick={() => setHeroModalOpen(true)}>
                Edit Hero
              </Button>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 var(--space-2) 0', color: 'var(--color-text)' }}>
              Hero / Mission & Impact
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
              Main introduction banner with gradient backdrop, mission badge, and headline narrative.
            </p>

            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)' }}>
              <p style={{ margin: '0 0 4px 0' }}><strong>Badge:</strong> {hero.badge}</p>
              <p style={{ margin: '0 0 4px 0' }}><strong>Heading:</strong> {hero.heading}</p>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {hero.description}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Platform Statistics Section Card */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-info-700)', background: 'var(--color-info-50)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                Section 2
              </span>
              <Button size="xs" variant="primary" leftIcon={<Edit3 size={13} />} onClick={() => setStatsModalOpen(true)}>
                Edit Statistics
              </Button>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 var(--space-2) 0', color: 'var(--color-text)' }}>
              Platform Statistics
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
              4 key platform metric counters for candidates, placements, verified employers, and job melas.
            </p>

            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: 'var(--text-xs)' }}>
              {stats.map((s, idx) => (
                <div key={s.id || idx}>
                  <p style={{ fontWeight: 800, margin: 0, color: 'var(--color-primary-600)' }}>{s.value}</p>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '10px' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. What We Stand For Section Card */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-warning-700)', background: 'var(--color-warning-50)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                Section 3
              </span>
              <Button size="xs" variant="primary" leftIcon={<Edit3 size={13} />} onClick={() => setWhatWeStandForModalOpen(true)}>
                Edit Principles
              </Button>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 var(--space-2) 0', color: 'var(--color-text)' }}>
              What We Stand For
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
              Three guiding institutional pillars for verified quality, transparent tracking, and inclusive hiring.
            </p>

            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)' }}>
              <p style={{ margin: '0 0 4px 0' }}><strong>Heading:</strong> {whatWeStandFor.heading}</p>
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                <strong>Cards:</strong> {(whatWeStandFor.cards || []).map(c => c.title).join(' • ')}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Our Team Section Card */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary-600)', background: 'var(--color-primary-50)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                Section 4
              </span>
              <Button size="xs" variant="primary" leftIcon={<Edit3 size={13} />} onClick={() => setTeamModalOpen(true)}>
                Edit Our Team
              </Button>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 var(--space-2) 0', color: 'var(--color-text)' }}>
              Our Team
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
              Key organization leadership and executive members displayed directly above leadership messages.
            </p>

            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)' }}>
              <p style={{ margin: '0 0 4px 0' }}><strong>Heading:</strong> {team.heading}</p>
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                <strong>Members ({team.members?.length || 0}):</strong> {(team.members || []).map(m => m.name).slice(0, 3).join(', ')}...
              </p>
            </div>
          </div>
        </div>

        {/* 5. Leadership Messages Section Card */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#b45309', background: '#fef3c7', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                Section 5
              </span>
              <Button size="xs" variant="primary" leftIcon={<Edit3 size={13} />} onClick={() => setMessagesModalOpen(true)}>
                Edit Messages
              </Button>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 var(--space-2) 0', color: 'var(--color-text)' }}>
              Leadership Messages
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
              Official mission guidance messages and vision statements from Chairperson & Project Director.
            </p>

            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)' }}>
              <p style={{ margin: '0 0 4px 0' }}><strong>Heading:</strong> {leadershipMessages.heading}</p>
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                <strong>Leaders ({leadershipMessages.messages?.length || 0}):</strong> {(leadershipMessages.messages || []).map(m => `${m.name} (${m.designation})`).join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* 6. Our Industry & Academic Training Partners Card */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-success-700)', background: 'var(--color-success-50)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                Section 6
              </span>
              <Button size="xs" variant="primary" leftIcon={<Edit3 size={13} />} onClick={() => setPartnersModalOpen(true)}>
                Edit Partners
              </Button>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 var(--space-2) 0', color: 'var(--color-text)' }}>
              Industry & Academic Partners
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
              Partner logo strip positioned directly underneath the Leadership Messages section.
            </p>

            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)' }}>
              <p style={{ margin: '0 0 4px 0' }}><strong>Heading:</strong> {partners.heading}</p>
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                <strong>Total Partners:</strong> {(partners.list || []).length} Organizations Configured
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── MODAL 1: Edit Hero ── */}
      {heroModalOpen && (
        <Modal
          isOpen={heroModalOpen}
          onClose={() => setHeroModalOpen(false)}
          title="Edit About Us Hero Section"
          size="md"
        >
          <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <FormField label="Badge Text" required>
              <Input
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                placeholder="Our Mission & Impact"
                required
              />
            </FormField>

            <FormField label="Main Heading" required>
              <Input
                value={heroForm.heading}
                onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                placeholder="Bridging Talent with Opportunity Across India"
                required
              />
            </FormField>

            <FormField label="Description" required>
              <Textarea
                value={heroForm.description}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                rows={3}
                placeholder="Hero mission text..."
                required
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setHeroModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Hero
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL 2: Edit Statistics ── */}
      {statsModalOpen && (
        <Modal
          isOpen={statsModalOpen}
          onClose={() => setStatsModalOpen(false)}
          title="Edit Platform Statistics"
          size="md"
        >
          <form onSubmit={handleSaveStats} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Update the display values and labels for the 4 core platform achievement metrics.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {statsForm.map((stat, idx) => (
                <div key={stat.id || idx} style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-3)' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Display Value</label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...statsForm];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        setStatsForm(updated);
                      }}
                      placeholder="e.g. 2,80,000+"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Label</label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...statsForm];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setStatsForm(updated);
                      }}
                      placeholder="e.g. Registered Job Seekers"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setStatsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Statistics
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL 3: Edit What We Stand For ── */}
      {whatWeStandForModalOpen && (
        <Modal
          isOpen={whatWeStandForModalOpen}
          onClose={() => setWhatWeStandForModalOpen(false)}
          title="Edit What We Stand For Section"
          size="lg"
        >
          <form onSubmit={handleSaveWhatWeStandFor} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <FormField label="Section Heading" required>
              <Input
                value={whatWeStandForForm.heading}
                onChange={(e) => setWhatWeStandForForm({ ...whatWeStandForForm, heading: e.target.value })}
                placeholder="What We Stand For"
                required
              />
            </FormField>

            <FormField label="Section Description" required>
              <Textarea
                value={whatWeStandForForm.description}
                onChange={(e) => setWhatWeStandForForm({ ...whatWeStandForForm, description: e.target.value })}
                rows={2}
                placeholder="Guiding principles description..."
                required
              />
            </FormField>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <h4 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-base)', fontWeight: 800 }}>
                Principle Cards (3 Pillars)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {whatWeStandForForm.cards.map((card, idx) => (
                  <div key={card.id || idx} style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Icon</label>
                        <select
                          value={card.icon || 'ShieldCheck'}
                          onChange={(e) => {
                            const updated = [...whatWeStandForForm.cards];
                            updated[idx] = { ...updated[idx], icon: e.target.value };
                            setWhatWeStandForForm({ ...whatWeStandForForm, cards: updated });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            fontSize: 'var(--text-xs)',
                            background: '#ffffff'
                          }}
                        >
                          {AVAILABLE_ICONS.map(ic => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Card Title</label>
                        <Input
                          value={card.title}
                          onChange={(e) => {
                            const updated = [...whatWeStandForForm.cards];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setWhatWeStandForForm({ ...whatWeStandForForm, cards: updated });
                          }}
                          placeholder="e.g. 100% Verified Quality"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Card Description</label>
                      <Textarea
                        value={card.desc}
                        onChange={(e) => {
                          const updated = [...whatWeStandForForm.cards];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          setWhatWeStandForForm({ ...whatWeStandForForm, cards: updated });
                        }}
                        rows={2}
                        placeholder="Description of principle..."
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setWhatWeStandForModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Principles
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL 4: Edit Our Team ── */}
      {teamModalOpen && (
        <Modal
          isOpen={teamModalOpen}
          onClose={() => setTeamModalOpen(false)}
          title="Edit Our Team Section"
          size="lg"
        >
          <form onSubmit={handleSaveTeam} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Section Badge" required>
                <Input
                  value={teamForm.badge}
                  onChange={(e) => setTeamForm({ ...teamForm, badge: e.target.value })}
                  placeholder="Our Leadership & Team"
                  required
                />
              </FormField>
              <FormField label="Section Heading" required>
                <Input
                  value={teamForm.heading}
                  onChange={(e) => setTeamForm({ ...teamForm, heading: e.target.value })}
                  placeholder="Our Team"
                  required
                />
              </FormField>
            </div>

            <FormField label="Section Description" required>
              <Textarea
                value={teamForm.description}
                onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                rows={2}
                placeholder="Section subtitle..."
                required
              />
            </FormField>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 800 }}>Team Members ({teamForm.members.length})</h4>
                <Button type="button" size="xs" variant="outline" leftIcon={<Plus size={13} />} onClick={handleAddMember}>
                  Add Member
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                {teamForm.members.map((member, idx) => (
                  <div key={member.id || idx} style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-primary-600)' }}>
                        Member #{idx + 1}
                      </span>
                      {teamForm.members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--color-danger-600)', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Full Name</label>
                        <Input
                          value={member.name}
                          onChange={(e) => {
                            const updated = [...teamForm.members];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setTeamForm({ ...teamForm, members: updated });
                          }}
                          placeholder="e.g. Dr. Ramesh Sundaram"
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Role / Designation</label>
                        <Input
                          value={member.role}
                          onChange={(e) => {
                            const updated = [...teamForm.members];
                            updated[idx] = { ...updated[idx], role: e.target.value };
                            setTeamForm({ ...teamForm, members: updated });
                          }}
                          placeholder="e.g. Chief Technology Officer"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Organization (Optional)</label>
                        <Input
                          value={member.organization || ''}
                          onChange={(e) => {
                            const updated = [...teamForm.members];
                            updated[idx] = { ...updated[idx], organization: e.target.value };
                            setTeamForm({ ...teamForm, members: updated });
                          }}
                          placeholder="e.g. NTR Vikasa"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Photo URL (Optional)</label>
                        <Input
                          value={member.image || ''}
                          onChange={(e) => {
                            const updated = [...teamForm.members];
                            updated[idx] = { ...updated[idx], image: e.target.value };
                            setTeamForm({ ...teamForm, members: updated });
                          }}
                          placeholder="https://... or blank for initials"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Short Bio</label>
                      <Textarea
                        value={member.bio}
                        onChange={(e) => {
                          const updated = [...teamForm.members];
                          updated[idx] = { ...updated[idx], bio: e.target.value };
                          setTeamForm({ ...teamForm, members: updated });
                        }}
                        rows={2}
                        placeholder="Short biography description..."
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setTeamModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Our Team
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL 5: Edit Leadership Messages ── */}
      {messagesModalOpen && (
        <Modal
          isOpen={messagesModalOpen}
          onClose={() => setMessagesModalOpen(false)}
          title="Edit Leadership Messages"
          size="lg"
        >
          <form onSubmit={handleSaveMessages} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Section Badge" required>
                <Input
                  value={messagesForm.badge}
                  onChange={(e) => setMessagesForm({ ...messagesForm, badge: e.target.value })}
                  placeholder="LEADERSHIP"
                  required
                />
              </FormField>
              <FormField label="Section Heading" required>
                <Input
                  value={messagesForm.heading}
                  onChange={(e) => setMessagesForm({ ...messagesForm, heading: e.target.value })}
                  placeholder="Leadership Messages"
                  required
                />
              </FormField>
            </div>

            <FormField label="Section Description" required>
              <Textarea
                value={messagesForm.description}
                onChange={(e) => setMessagesForm({ ...messagesForm, description: e.target.value })}
                rows={2}
                placeholder="Words from our esteemed leaders..."
                required
              />
            </FormField>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 800 }}>
                  Leader Cards ({messagesForm.messages.length})
                </h4>
                <Button type="button" size="xs" variant="outline" leftIcon={<Plus size={13} />} onClick={handleAddMessage}>
                  Add Leader Message
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {messagesForm.messages.map((item, idx) => (
                  <div key={item.id || idx} style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-primary-600)' }}>
                        Leader #{idx + 1}
                      </span>
                      {messagesForm.messages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMessage(idx)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--color-danger-600)', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Leader Name</label>
                        <Input
                          value={item.name}
                          onChange={(e) => {
                            const updated = [...messagesForm.messages];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setMessagesForm({ ...messagesForm, messages: updated });
                          }}
                          placeholder="e.g. K Lacha Rao"
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Designation</label>
                        <Input
                          value={item.designation}
                          onChange={(e) => {
                            const updated = [...messagesForm.messages];
                            updated[idx] = { ...updated[idx], designation: e.target.value };
                            setMessagesForm({ ...messagesForm, messages: updated });
                          }}
                          placeholder="e.g. Chairperson"
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Organization</label>
                        <Input
                          value={item.organization}
                          onChange={(e) => {
                            const updated = [...messagesForm.messages];
                            updated[idx] = { ...updated[idx], organization: e.target.value };
                            setMessagesForm({ ...messagesForm, messages: updated });
                          }}
                          placeholder="e.g. NTR Vikasa Jobs"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Header Color Theme</label>
                        <select
                          value={item.headerBg || '#0f2a59'}
                          onChange={(e) => {
                            const updated = [...messagesForm.messages];
                            updated[idx] = { ...updated[idx], headerBg: e.target.value };
                            setMessagesForm({ ...messagesForm, messages: updated });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            fontSize: 'var(--text-xs)',
                            background: '#ffffff'
                          }}
                        >
                          <option value="#0f2a59">Navy Blue (#0f2a59)</option>
                          <option value="#047857">Emerald Green (#047857)</option>
                          <option value="#1e1b4b">Deep Indigo (#1e1b4b)</option>
                          <option value="#831843">Maroon (#831843)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Photo URL / Initials</label>
                        <Input
                          value={item.image || ''}
                          onChange={(e) => {
                            const updated = [...messagesForm.messages];
                            updated[idx] = { ...updated[idx], image: e.target.value };
                            setMessagesForm({ ...messagesForm, messages: updated });
                          }}
                          placeholder="https://... or leave blank for initials"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Card Message (Summary)</label>
                      <Textarea
                        value={item.message}
                        onChange={(e) => {
                          const updated = [...messagesForm.messages];
                          updated[idx] = { ...updated[idx], message: e.target.value };
                          setMessagesForm({ ...messagesForm, messages: updated });
                        }}
                        rows={2}
                        placeholder="Displayed on the main card..."
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: 2 }}>Full Message (Modal Pop-up)</label>
                      <Textarea
                        value={item.fullMessage || item.message}
                        onChange={(e) => {
                          const updated = [...messagesForm.messages];
                          updated[idx] = { ...updated[idx], fullMessage: e.target.value };
                          setMessagesForm({ ...messagesForm, messages: updated });
                        }}
                        rows={3}
                        placeholder="Full leadership address viewed in popup..."
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setMessagesModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Leadership Messages
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL 6: Edit Partners ── */}
      {partnersModalOpen && (
        <Modal
          isOpen={partnersModalOpen}
          onClose={() => setPartnersModalOpen(false)}
          title="Edit Industry & Academic Training Partners"
          size="lg"
        >
          <form onSubmit={handleSavePartners} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <FormField label="Section Heading" required>
              <Input
                value={partnersForm.heading}
                onChange={(e) => setPartnersForm({ ...partnersForm, heading: e.target.value })}
                placeholder="OUR INDUSTRY & ACADEMIC TRAINING PARTNERS"
                required
              />
            </FormField>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 800 }}>
                  Partners ({partnersForm.list.length})
                </h4>
                <Button type="button" size="xs" variant="outline" leftIcon={<Plus size={13} />} onClick={handleAddPartner}>
                  Add Partner
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {partnersForm.list.map((partner, idx) => (
                  <div key={partner.id || idx} style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-text-muted)', width: 20 }}>
                      #{idx + 1}
                    </span>

                    <div style={{ flex: 1 }}>
                      <Input
                        value={partner.name}
                        onChange={(e) => {
                          const updated = [...partnersForm.list];
                          updated[idx] = { ...updated[idx], name: e.target.value, logoText: e.target.value };
                          setPartnersForm({ ...partnersForm, list: updated });
                        }}
                        placeholder="Partner Name (e.g. Hyundai MOBIS)"
                        required
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <Input
                        value={partner.logo || ''}
                        onChange={(e) => {
                          const updated = [...partnersForm.list];
                          updated[idx] = { ...updated[idx], logo: e.target.value };
                          setPartnersForm({ ...partnersForm, list: updated });
                        }}
                        placeholder="Custom Logo URL (Optional)"
                      />
                    </div>

                    {/* Active toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePartnerActive(idx)}
                      title={partner.active !== false ? 'Active (Click to hide)' : 'Hidden (Click to show)'}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        background: partner.active !== false ? 'var(--color-success-50)' : 'var(--color-gray-200)',
                        color: partner.active !== false ? 'var(--color-success-700)' : 'var(--color-text-muted)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {partner.active !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      {partner.active !== false ? 'Active' : 'Hidden'}
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(idx)}
                      style={{ border: 'none', background: 'transparent', color: 'var(--color-danger-600)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setPartnersModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Partners
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL 7: Reset Confirmation ── */}
      {resetModalOpen && (
        <Modal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          title="Reset About Us Content to Defaults"
          size="sm"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', margin: 0 }}>
              Are you sure you want to reset all About Us page sections (Hero, Statistics, What We Stand For, Our Team, Leadership Messages, and Partners) to default portal content?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button variant="outline" onClick={() => setResetModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmReset}>
                Reset to Defaults
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
