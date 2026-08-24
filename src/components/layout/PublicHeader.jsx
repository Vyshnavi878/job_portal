import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu, X, Briefcase, Building2, BookOpen, CalendarDays,
  GraduationCap, ChevronDown, User, UserPlus, Info, Sparkles
} from 'lucide-react';
import Button from '../ui/Button';

const NAV_LINKS = [
  { label: 'Jobs', href: '/jobs', icon: <Briefcase size={16} /> },
  { label: 'Internships', href: '/internships', icon: <BookOpen size={16} /> },
  { label: 'Companies', href: '/companies', icon: <Building2 size={16} /> },
  { label: 'Job Melas', href: '/job-melas', icon: <CalendarDays size={16} /> },
  { label: 'Training', href: '/training', icon: <GraduationCap size={16} /> },
];

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  const getStartedRef = useRef(null);
  const aboutRef = useRef(null);

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
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `public-nav-link ${isActive ? 'active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* About Dropdown */}
            <div
              ref={aboutRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `public-nav-link ${isActive ? 'active' : ''}`
                }
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                onClick={(e) => {
                  // If clicking on mobile or desktop, toggle dropdown
                  setAboutDropdownOpen((v) => !v);
                }}
              >
                About <ChevronDown size={14} style={{ opacity: 0.7, transform: aboutDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
              </NavLink>

              {aboutDropdownOpen && (
                <div
                  className="dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 'auto',
                    minWidth: 220,
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
                      <p style={{ fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.2 }}>About Us</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Mission & organization overview</p>
                    </div>
                  </Link>

                  <Link
                    to="/training"
                    className="dropdown-item"
                    onClick={() => setAboutDropdownOpen(false)}
                    style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }}
                  >
                    <GraduationCap size={16} style={{ color: 'var(--color-primary-600)' }} />
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.2 }}>Skill Development</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Certified industry skill courses</p>
                    </div>
                  </Link>

                  <Link
                    to="/training"
                    className="dropdown-item"
                    onClick={() => setAboutDropdownOpen(false)}
                    style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }}
                  >
                    <Sparkles size={16} style={{ color: 'var(--color-accent-600)' }} />
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.2 }}>Training Programs</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Vocational & IT labs</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* ── 3. Action Buttons & Get Started Dropdown ── */}
          <div className="public-header-actions">
            <Link to="/login" className="hide-mobile">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>

            {/* Get Started Dropdown (Candidate vs Recruiter) */}
            <div ref={getStartedRef} style={{ position: 'relative' }} className="hide-mobile">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setGetStartedOpen((v) => !v)}
                rightIcon={<ChevronDown size={14} style={{ transform: getStartedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />}
              >
                Get Started
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
                      Create Free Account
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
                      <p style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)', lineHeight: 1.2 }}>Candidate Registration</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Find jobs, internships & job fairs</p>
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
                      <p style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)', lineHeight: 1.2 }}>Recruiter Registration</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Post jobs & hire verified talent</p>
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
          </div>
        </div>
      </header>

      {/* ── 4. Responsive Mobile Drawer ── */}
      {menuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-panel">
            <div className="mobile-nav-header">
              <Link to="/" className="logo" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
                <div className="logo-icon"><Briefcase size={18} /></div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span className="logo-text" style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>
                    NTR <span style={{ color: 'var(--color-primary-600)' }}>VIKASA</span>
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Employment Generation
                  </span>
                </div>
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
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                <Info size={16} /> About Us
              </NavLink>
              <NavLink to="/contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                <UserPlus size={16} /> Contact & Support
              </NavLink>
            </div>

            <div className="mobile-nav-actions">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" fullWidth>Log In</Button>
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Link to="/register/candidate" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" fullWidth leftIcon={<User size={16} />}>
                    Register as Candidate
                  </Button>
                </Link>
                <Link to="/register/recruiter" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" fullWidth leftIcon={<Building2 size={16} />}>
                    Register as Recruiter
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
