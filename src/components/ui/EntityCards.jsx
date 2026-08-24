import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, Banknote, Bookmark, BookmarkCheck, Building2 } from 'lucide-react';
import { Badge, StatusBadge } from './Badge';
import Button from './Button';
import { JobCardSkeleton } from './Skeleton';

/**
 * JobCard — displays a job listing
 * @param {Object}   job
 * @param {boolean}  saved
 * @param {Function} onSave
 * @param {boolean}  loading
 * @param {boolean}  showStatus
 */
export function JobCard({ job, saved = false, onSave, loading = false, showStatus = false }) {
  if (loading) return <JobCardSkeleton />;

  const {
    id, title, company, companyLogo, location, type, salary,
    experience, deadline, status, tags = [], isNew, isFeatured,
  } = job;

  const timeLeft = deadline ? getTimeLeft(deadline) : null;

  return (
    <div className="job-card fade-in">
      <div className="job-card-header">
        <div className="job-card-logo">
          {companyLogo ? (
            <img src={companyLogo} alt={`${company} logo`} />
          ) : (
            <span>{company?.[0] || 'J'}</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Link to={`/jobs/${id}`} className="job-card-title" style={{ textDecoration: 'none', color: 'inherit' }}>
              {title}
            </Link>
            {isNew && <Badge variant="success">New</Badge>}
            {isFeatured && <Badge variant="primary">Featured</Badge>}
          </div>
          <Link to={`/companies/${job.companyId}`} className="job-card-company">{company}</Link>
        </div>
        {onSave && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onSave(id); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? 'var(--color-primary-600)' : 'var(--color-text-light)', flexShrink: 0 }}
            aria-label={saved ? 'Unsave job' : 'Save job'}
          >
            {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        )}
      </div>

      <div className="job-card-meta">
        {location && (
          <span className="job-card-meta-item">
            <MapPin size={13} />{location}
          </span>
        )}
        {type && (
          <span className="job-card-meta-item">
            <Briefcase size={13} />{type}
          </span>
        )}
        {salary && (
          <span className="job-card-meta-item">
            <Banknote size={13} />{salary}
          </span>
        )}
        {experience && (
          <span className="job-card-meta-item">
            <Clock size={13} />{experience}
          </span>
        )}
      </div>

      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="gray">{tag}</Badge>
          ))}
          {tags.length > 3 && <Badge variant="gray">+{tags.length - 3}</Badge>}
        </div>
      )}

      <div className="job-card-footer">
        <div>
          {showStatus && status && <StatusBadge status={status} />}
          {timeLeft && !showStatus && (
            <span className="job-card-deadline">
              <Clock size={12} style={{ display: 'inline', marginRight: 3 }} />
              {timeLeft}
            </span>
          )}
        </div>
        <Link to={`/jobs/${id}`}>
          <Button size="sm" variant="outline">View Job</Button>
        </Link>
      </div>
    </div>
  );
}

function getTimeLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  if (diff < 0) return 'Expired';
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Closes today';
  if (days === 1) return '1 day left';
  if (days <= 30) return `${days} days left`;
  const weeks = Math.ceil(days / 7);
  return `${weeks} week${weeks > 1 ? 's' : ''} left`;
}


/**
 * CompanyCard
 */
export function CompanyCard({ company, loading = false }) {
  if (loading) {
    return (
      <div className="company-card">
        <div className="skeleton skeleton-circle" style={{ width: 72, height: 72, margin: '0 auto var(--space-4)' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0 auto var(--space-2)' }} />
        <div className="skeleton skeleton-text" style={{ width: '40%', margin: '0 auto var(--space-4)', height: 12 }} />
      </div>
    );
  }

  const { id, name, industry, logo, openJobs = 0, employees } = company;

  return (
    <Link to={`/companies/${id}`} className="company-card">
      <div className="company-card-logo">
        {logo ? <img src={logo} alt={`${name} logo`} /> : <span>{name?.[0] || 'C'}</span>}
      </div>
      <h3 className="company-card-name">{name}</h3>
      {industry && <p className="company-card-industry">{industry}</p>}
      <div className="company-card-stats">
        <div className="company-card-stat">
          <p className="company-card-stat-value">{openJobs}</p>
          <p className="company-card-stat-label">Open Jobs</p>
        </div>
        {employees && (
          <div className="company-card-stat">
            <p className="company-card-stat-value">{employees}</p>
            <p className="company-card-stat-label">Employees</p>
          </div>
        )}
      </div>
    </Link>
  );
}


/**
 * InternshipCard — same shape as JobCard, specialized display
 */
export function InternshipCard({ internship, saved = false, onSave, loading = false }) {
  if (loading) return <JobCardSkeleton />;

  const { id, title, company, companyLogo, location, duration, stipend, mode, deadline, tags = [] } = internship;

  return (
    <div className="job-card fade-in">
      <div className="job-card-header">
        <div className="job-card-logo">
          {companyLogo ? <img src={companyLogo} alt={`${company} logo`} /> : <span>{company?.[0] || 'I'}</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to={`/internships/${id}`} className="job-card-title" style={{ textDecoration: 'none', color: 'inherit' }}>
            {title}
          </Link>
          <p className="job-card-company">{company}</p>
        </div>
        {onSave && (
          <button type="button" onClick={() => onSave(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? 'var(--color-primary-600)' : 'var(--color-text-light)' }}>
            {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        )}
      </div>

      <div className="job-card-meta">
        {location && <span className="job-card-meta-item"><MapPin size={13} />{location}</span>}
        {mode && <span className="job-card-meta-item"><Briefcase size={13} />{mode}</span>}
        {duration && <span className="job-card-meta-item"><Clock size={13} />{duration}</span>}
        {stipend && <span className="job-card-meta-item"><Banknote size={13} />{stipend.includes('/ month') || stipend.includes('/mo') ? stipend : `${stipend}/mo`}</span>}
      </div>

      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="gray">{tag}</Badge>
          ))}
        </div>
      )}

      <div className="job-card-footer">
        <span className="job-card-deadline">
          {deadline && `Apply by ${new Date(deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`}
        </span>
        <Link to={`/internships/${id}`}>
          <Button size="sm" variant="outline">View Details</Button>
        </Link>
      </div>
    </div>
  );
}


/**
 * JobMelaCard — Job Fair card
 */
export function JobMelaCard({ event, loading = false }) {
  if (loading) {
    return (
      <div className="jobmela-card">
        <div className="jobmela-card-banner" style={{ background: 'var(--color-gray-200)' }} />
        <div className="jobmela-card-body">
          <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: 'var(--space-3)' }} />
          <div className="skeleton skeleton-text sm" style={{ width: '50%', marginBottom: 'var(--space-2)' }} />
          <div className="skeleton skeleton-text sm" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  const { id, title, date, venue, city, companies = 0, seats, status } = event;

  return (
    <Link to={`/job-melas/${id}`} className="jobmela-card">
      <div className="jobmela-card-banner">
        <StatusBadge status={status} size="sm" />
      </div>
      <div className="jobmela-card-body">
        <h3 className="jobmela-card-title">{title}</h3>
        <div className="jobmela-card-meta">
          {date && (
            <span className="jobmela-card-meta-item">
              <Clock size={14} />
              {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
          {venue && (
            <span className="jobmela-card-meta-item">
              <MapPin size={14} />{venue}, {city}
            </span>
          )}
          {companies > 0 && (
            <span className="jobmela-card-meta-item">
              <Building2 size={14} />{companies} Companies Participating
            </span>
          )}
        </div>
      </div>
      <div className="jobmela-card-footer">
        {seats && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{seats} seats available</span>}
        <Button size="sm" variant="primary" style={{ pointerEvents: 'none' }}>Register</Button>
      </div>
    </Link>
  );
}
