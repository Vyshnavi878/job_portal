import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu, X, Briefcase, Building2, BookOpen, CalendarDays,
  ChevronDown, User, UserPlus, Info, Sparkles, Globe, Home, ExternalLink
} from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function PublicHeader() {
  const { t, toggle, lang } = useLanguage();
  const nav = t.nav;
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const getStartedRef = useRef(null);
  const aboutRef = useRef(null);

  // Nav links built from translations so they update on language switch
  const NAV_LINKS = [
    { label: nav.home,        href: '/',                  icon: <Home size={16} /> },
    { label: nav.jobs,        href: '/jobs',              icon: <Briefcase size={16} /> },
    { label: nav.internships, href: '/internships',       icon: <BookOpen size={16} /> },
    { label: nav.companies,   href: '/companies',         icon: <Building2 size={16} /> },
    { label: nav.jobMelas,    href: '/job-melas',         icon: <CalendarDays size={16} /> },
    { label: nav.skillDev,    href: '/skill-development', icon: <Sparkles size={16} /> },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (getStartedRef.current && !getStartedRef.current.contains(e.target)) {
        setGetStartedOpen(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(e.target)) {
        setAboutDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="public-header">
        <div className="public-header-inner">
          {/* ── 1. Official NTR VIKASA Branding ── */}
          <Link to="/" className="logo" aria-label="NTR Vikasa Home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/logo_image.png" alt="NTR Vikasa Logo" style={{ height: '48px', objectFit: 'contain' }} />
          </Link>

          {/* ── 2. Desktop Navigation ── */}
          <nav className="public-nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isSkillDevActive = link.href === '/skill-development' && (
                location.pathname.startsWith('/skill-development') || location.pathname.startsWith('/training')
              );
              return (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `public-nav-link ${isActive || isSkillDevActive ? 'active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}

            {/* About Dropdown */}
            <div
              ref={aboutRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                type="button"
                className={`public-nav-link ${location.pathname.startsWith('/about') ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
                onClick={() => setAboutDropdownOpen((v) => !v)}
                aria-expanded={aboutDropdownOpen}
                aria-haspopup="true"
              >
                {nav.about} <ChevronDown size={14} style={{ opacity: 0.7, transform: aboutDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
              </button>

              {aboutDropdownOpen && (
                <div
                  className="dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 'auto',
                    minWidth: 230,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: 'var(--space-2)',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <Link
                    to="/about"
                    className="dropdown-item"
                    onClick={() => setAboutDropdownOpen(false)}
                    style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }}
                  >
                    <Info size={16} style={{ color: 'var(--color-primary-600)' }} />
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.2 }}>{nav.aboutUs}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{nav.aboutDesc}</p>
                    </div>
                  </Link>

                  <a
                    href="https://naipunyam.ap.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dropdown-item"
                    onClick={() => setAboutDropdownOpen(false)}
                    style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }}
                  >
                    <ExternalLink size={16} style={{ color: 'var(--color-primary-600)' }} />
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.2 }}>{nav.trainingPrograms}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{nav.trainingProgramsDesc}</p>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* ── 3. Action Buttons & Get Started Dropdown ── */}
          <div className="public-header-actions">
            <Link to="/login" className="hide-mobile">
              <Button variant="ghost" size="sm">{nav.login}</Button>
            </Link>

            {/* Get Started Dropdown (Candidate vs Recruiter) */}
            <div ref={getStartedRef} style={{ position: 'relative' }} className="hide-mobile">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setGetStartedOpen((v) => !v)}
                rightIcon={<ChevronDown size={14} style={{ transform: getStartedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />}
              >
                {nav.getStarted}
              </Button>

              {getStartedOpen && (
                <div
                  className="dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    minWidth: 260,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: 'var(--space-2)',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--color-gray-100)', marginBottom: 4 }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>
                      {nav.createAccount}
                    </p>
                  </div>

                  <Link
                    to="/register/candidate"
                    className="dropdown-item"
                    onClick={() => setGetStartedOpen(false)}
                    style={{ padding: '10px 12px', borderRadius: 'var(--radius-lg)' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={16} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)', lineHeight: 1.2 }}>{nav.candidateReg}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{nav.candidateDesc}</p>
                    </div>
                  </Link>

                  <Link
                    to="/register/recruiter"
                    className="dropdown-item"
                    onClick={() => setGetStartedOpen(false)}
                    style={{ padding: '10px 12px', borderRadius: 'var(--radius-lg)' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-50)', color: 'var(--color-accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)', lineHeight: 1.2 }}>{nav.recruiterReg}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{nav.recruiterDesc}</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="header-mobile-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu size={22} />
            </button>

            {/* Language toggle — desktop only */}
            <button
              className="hide-mobile notranslate"
              onClick={toggle}
              aria-label={lang === 'en' ? 'Switch to Telugu' : 'Switch to English'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '5px 10px',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: lang === 'te' ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 150ms ease, border-color 150ms ease',
                borderColor: lang === 'te' ? 'var(--color-primary-300)' : 'var(--color-border)',
              }}
            >
              <Globe size={14} />
              {lang === 'en' ? 'Telugu' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* ── 4. Responsive Mobile Drawer ── */}
      {menuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-panel">
            <div className="mobile-nav-header">
              <Link to="/" className="logo" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <img src="/logo_image.png" alt="NTR Vikasa Logo" style={{ height: '36px', objectFit: 'contain' }} />
              </Link>
              <button
                className="modal-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mobile-nav-links">
              {NAV_LINKS.map((link) => {
                const isSkillDevActive = link.href === '/skill-development' && (
                  location.pathname.startsWith('/skill-development') || location.pathname.startsWith('/training')
                );
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      `mobile-nav-link ${isActive || isSkillDevActive ? 'active' : ''}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                );
              })}

              {/* About Collapsible */}
              <div>
                <button
                  type="button"
                  className={`mobile-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                  onClick={() => setMobileAboutOpen((v) => !v)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    font: 'inherit',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Info size={16} />
                    {nav.about}
                  </span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: mobileAboutOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 150ms ease'
                    }}
                  />
                </button>
                {mobileAboutOpen && (
                  <div style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 'var(--space-2)' }}>
                    <NavLink
                      to="/about"
                      className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                      style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-3)' }}
                    >
                      <Info size={14} />
                      {nav.aboutUs}
                    </NavLink>
                    <a
                      href="https://naipunyam.ap.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-nav-link"
                      onClick={() => setMenuOpen(false)}
                      style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-3)' }}
                    >
                      <ExternalLink size={14} />
                      {nav.trainingPrograms}
                    </a>
                  </div>
                )}
              </div>

              <NavLink to="/contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                <UserPlus size={16} /> {nav.contactSupport}
              </NavLink>

              {/* Language toggle in mobile drawer */}
              <button
                className="mobile-nav-link notranslate"
                onClick={() => { toggle(); setMenuOpen(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: lang === 'te' ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                  fontWeight: lang === 'te' ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: 'var(--space-3)',
                }}
                aria-label={lang === 'en' ? 'Switch to Telugu' : 'Switch to English'}
              >
                <Globe size={16} /> {lang === 'en' ? 'Telugu' : 'English'}
              </button>
            </div>

            <div className="mobile-nav-actions">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" fullWidth>{nav.login}</Button>
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Link to="/register/candidate" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" fullWidth leftIcon={<User size={16} />}>
                    {nav.candidateReg}
                  </Button>
                </Link>
                <Link to="/register/recruiter" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" fullWidth leftIcon={<Building2 size={16} />}>
                    {nav.recruiterReg}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div
            style={{ flex: 1 }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
}
