import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Briefcase, Building2, BookOpen, CalendarDays, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const NAV_LINKS = [
  { label: 'Jobs',       href: '/jobs',        icon: <Briefcase size={16} /> },
  { label: 'Internships',href: '/internships',  icon: <BookOpen size={16} /> },
  { label: 'Companies',  href: '/companies',   icon: <Building2 size={16} /> },
  { label: 'Job Melas',  href: '/job-melas',   icon: <CalendarDays size={16} /> },
];

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="public-header">
        <div className="public-header-inner">
          {/* Logo */}
          <Link to="/" className="logo" aria-label="JobConnect Home">
            <div className="logo-icon" aria-hidden="true">
              <Briefcase size={20} />
            </div>
            <span className="logo-text">Job<span>Connect</span></span>
          </Link>

          {/* Desktop Nav */}
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
          </nav>

          {/* Actions */}
          <div className="public-header-actions">
            <Link to="/login" className="hide-mobile">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/register/candidate" className="hide-mobile">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
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

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-panel">
            <div className="mobile-nav-header">
              <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
                <div className="logo-icon"><Briefcase size={18} /></div>
                <span className="logo-text">Job<span>Connect</span></span>
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
              <NavLink to="/about"   className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About</NavLink>
              <NavLink to="/contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Contact</NavLink>
            </div>

            <div className="mobile-nav-actions">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" fullWidth>Log In</Button>
              </Link>
              <Link to="/register/candidate" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" fullWidth>Get Started</Button>
              </Link>
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
