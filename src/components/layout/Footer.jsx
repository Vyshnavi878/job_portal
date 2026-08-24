import { Link as RouterLink } from 'react-router-dom';
import { Briefcase, Globe, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  'For Job Seekers': [
    { label: 'Browse Jobs',           href: '/jobs' },
    { label: 'Internships',           href: '/internships' },
    { label: 'Job Melas',             href: '/job-melas' },
    { label: 'Training Programs',     href: '/training' },
    { label: 'Companies',             href: '/companies' },
    { label: 'Register as Candidate', href: '/register/candidate' },
  ],
  'For Recruiters': [
    { label: 'Post a Job',        href: '/register/recruiter' },
    { label: 'Post Internship',   href: '/register/recruiter' },
    { label: 'Recruiter Login',   href: '/login' },
    { label: 'Recruiter Registration', href: '/register/recruiter' },
  ],
  'Company': [
    { label: 'About Us',          href: '/about' },
    { label: 'Skill Development', href: '/training' },
    { label: 'Contact & Helpdesk',href: '/contact' },
    { label: 'Privacy Policy',    href: '/privacy' },
    { label: 'Terms of Service',  href: '/terms' },
  ],
};

const SOCIAL_LINKS = [
  { icon: <Globe size={16} />,       href: '#', label: 'Website' },
  { icon: <ExternalLink size={16} />,href: '#', label: 'LinkedIn' },
  { icon: <ExternalLink size={16} />,href: '#', label: 'Twitter' },
  { icon: <ExternalLink size={16} />,href: '#', label: 'GitHub' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <RouterLink to="/" className="logo" style={{ textDecoration: 'none' }}>
            <div className="logo-icon"><Briefcase size={18} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span className="logo-text" style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#fff' }}>
                NTR <span style={{ color: 'var(--color-primary-400)' }}>VIKASA</span>
              </span>
              <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', fontWeight: 600 }}>
                Society for Employment Generation
              </span>
            </div>
          </RouterLink>
          <p className="footer-desc" style={{ marginTop: 'var(--space-3)' }}>
            NTR Vikasa — Society for Employment Generation. Empowering youth with employment opportunities, skill development programs, and Mega Job Melas.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <h3 className="footer-col-title">{col}</h3>
            <ul className="footer-links">
              {links.map((link) => (
                <li key={link.href + link.label}>
                  <RouterLink to={link.href} className="footer-link">{link.label}</RouterLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © {year} JobConnect. All rights reserved.
          </p>
          <div className="footer-social">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} className="footer-social-link" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
