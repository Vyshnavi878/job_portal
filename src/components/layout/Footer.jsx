import { Link as RouterLink } from 'react-router-dom';
import { Briefcase, Globe, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  'For Job Seekers': [
    { label: 'Browse Jobs',           href: '/jobs' },
    { label: 'Internships',           href: '/internships' },
    { label: 'Job Melas',             href: '/job-melas' },
    { label: 'Companies',             href: '/companies' },
    { label: 'Register as Candidate', href: '/register/candidate' },
  ],
  'For Recruiters': [
    { label: 'Post a Job',        href: '/register/recruiter' },
    { label: 'Post Internship',   href: '/register/recruiter' },
    { label: 'Recruiter Login',   href: '/login' },
    { label: 'Pricing',           href: '/about' },
  ],
  'Company': [
    { label: 'About Us',          href: '/about' },
    { label: 'Contact',           href: '/contact' },
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
          <RouterLink to="/" className="logo">
            <div className="logo-icon"><Briefcase size={18} /></div>
            <span className="logo-text">Job<span>Connect</span></span>
          </RouterLink>
          <p className="footer-desc">
            Your gateway to careers, internships, and job fairs. Connecting talent
            with opportunity across India.
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
