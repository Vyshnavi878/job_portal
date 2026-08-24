import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Clock, Briefcase, Banknote, Building2, Calendar, Users,
  Share2, Bookmark, BookmarkCheck, ArrowLeft, CheckCircle2, Flag,
  ChevronRight, Sparkles, ExternalLink, Mail, Phone, ShieldCheck,
  Send, AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import FileUpload from '../../components/ui/FileUpload';
import { JobCard } from '../../components/ui/EntityCards';
import { useToast } from '../../context/ToastContext';
import { MOCK_JOBS, MOCK_COMPANIES } from '../../data/mockData';

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { toast } = useToast();

  const [saved, setSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  // Application form fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [coverNote, setCoverNote] = useState('');

  // Report job form fields
  const [reportReason, setReportReason] = useState('Misleading salary or job description');
  const [reportDetails, setReportDetails] = useState('');

  // Locate the job or fallback to first job
  const job = useMemo(() => {
    return MOCK_JOBS.find((j) => j.id === jobId) || MOCK_JOBS[0];
  }, [jobId]);

  // Locate company information
  const company = useMemo(() => {
    return MOCK_COMPANIES.find((c) => c.id === job.companyId) || MOCK_COMPANIES[0];
  }, [job]);

  // Similar jobs (same industry or skills)
  const similarJobs = useMemo(() => {
    return MOCK_JOBS.filter((j) => j.id !== job.id && (j.industry === job.industry || j.type === job.type)).slice(0, 3);
  }, [job]);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setApplied(true);
      setApplyModalOpen(false);
      toast({
        type: 'success',
        title: 'Application Submitted!',
        message: `Your application for ${job.title} at ${job.company} was submitted successfully. Track status in your Candidate Portal.`,
      });
    }, 1200);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setReportModalOpen(false);
      toast({
        type: 'info',
        title: 'Report Received',
        message: 'Thank you for keeping NTR VIKASA Job Portal safe. Our trust & safety team will review this listing within 24 hours.',
      });
    }, 800);
  };

  const handleToggleSave = () => {
    const newState = !saved;
    setSaved(newState);
    toast({
      type: newState ? 'success' : 'info',
      title: newState ? 'Job Saved' : 'Job Removed',
      message: newState ? `Added "${job.title}" to your Saved Jobs.` : `Removed from Saved Jobs.`,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        type: 'info',
        title: 'Link Copied',
        message: 'Job link copied to clipboard!',
      });
    }
  };

  return (
    <div className="job-detail-page" style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 'var(--space-20)' }}>
      {/* Top Breadcrumb navigation */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Jobs', href: '/jobs' }, { label: job.title }]} />
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        {/* Header Hero Card */}
        <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-body" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className="job-card-logo" style={{
                width: 72, height: 72,
                borderRadius: 'var(--radius-2xl)',
                fontSize: 'var(--text-3xl)',
                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
                color: '#fff',
                flexShrink: 0
              }}>
                {job.company?.[0] || 'J'}
              </div>

              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                  <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)' }}>
                    {job.title}
                  </h1>
                  {job.isNew && <Badge variant="success">New</Badge>}
                  {job.isFeatured && <Badge variant="primary">Featured</Badge>}
                  <StatusBadge status={job.status || 'PUBLISHED'} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <Link
                    to={`/companies/${job.companyId}`}
                    style={{ color: 'var(--color-primary-600)', fontWeight: 600, fontSize: 'var(--text-base)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Building2 size={16} /> {job.company}
                  </Link>
                  <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    {job.department || 'Engineering'}
                  </span>
                </div>
              </div>

              {/* Header action buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant={applied ? 'secondary' : 'primary'}
                  size="md"
                  onClick={() => !applied && setApplyModalOpen(true)}
                  disabled={applied}
                >
                  {applied ? '✓ Applied' : 'Apply Now'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  leftIcon={<Share2 size={16} />}
                  onClick={handleShare}
                  aria-label="Share Job"
                  title="Share Job"
                />
                <Button
                  variant={saved ? 'primary' : 'secondary'}
                  size="sm"
                  iconOnly
                  leftIcon={saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  onClick={handleToggleSave}
                  aria-label={saved ? 'Unsave Job' : 'Save Job'}
                  title={saved ? 'Saved' : 'Save Job'}
                />
              </div>
            </div>

            {/* Meta Attributes Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Banknote size={18} />
                </div>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Offered Salary</p>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{job.salary}</p>
                </div>
              </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--color-success-50)', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Location & Mode</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{job.location} ({job.workMode})</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--color-warning-50)', color: 'var(--color-warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Experience</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{job.experience}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--color-info-50)', color: 'var(--color-info-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Job Type</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{job.type}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--color-accent-50)', color: 'var(--color-accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Open Positions</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{job.openings} Vacancies</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-100)', color: 'var(--color-gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Apply Deadline</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                        {new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills Badges */}
                <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-gray-100)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                    Required Technical Skills
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {job.skills?.map((skill) => (
                      <span key={skill} className="badge badge-primary" style={{ padding: '4px 12px', fontSize: 'var(--text-xs)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

        {/* ── Two Column Responsive Layout ── */}
        <div className="responsive-split-detail">

          {/* ── Main Left Column ── */}
          <div>
            {/* 1. Job Description */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)' }}>
              <div className="card-header">
                <h2 className="card-title">Job Description</h2>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text)', whiteSpace: 'pre-line' }}>
                  {job.description}
                </p>
              </div>
            </div>

            {/* 2. Responsibilities */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)' }}>
              <div className="card-header">
                <h2 className="card-title">Key Responsibilities</h2>
              </div>
              <div className="card-body">
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {job.responsibilities?.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--color-success-600)', flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-normal)' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Requirements & Qualifications */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)' }}>
              <div className="card-header">
                <h2 className="card-title">Requirements & Qualifications</h2>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {job.qualifications && (
                  <div style={{ background: 'var(--color-primary-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-primary-200)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary-700)', textTransform: 'uppercase', marginBottom: 2 }}>
                      Educational Qualification
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontWeight: 600 }}>
                      {job.qualifications}
                    </p>
                  </div>
                )}

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {job.requirements?.map((req, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary-600)', flexShrink: 0, marginTop: 7 }} />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-normal)' }}>
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Benefits & Perks */}
            {job.benefits && (
              <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)' }}>
                <div className="card-header">
                  <h2 className="card-title">Perks & Benefits</h2>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                    {job.benefits.map((benefit, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-3)', background: 'var(--color-gray-50)',
                        borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)'
                      }}>
                        <Sparkles size={16} style={{ color: 'var(--color-accent-600)', flexShrink: 0 }} />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. About the Hiring Company */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="card-title">About {company.name}</h2>
                <Link to={`/companies/${company.id}`}>
                  <Button variant="ghost" size="sm" rightIcon={<ExternalLink size={14} />}>
                    View Company Profile
                  </Button>
                </Link>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                  {company.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
                  <span><strong>Industry:</strong> {company.industry}</span>
                  <span><strong>Company Size:</strong> {company.size}</span>
                  <span><strong>Headquarters:</strong> {company.location}</span>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
                      Visit Website <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ── Sticky Right Action Sidebar ── */}
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

            {/* Apply Action Card */}
            <div className="card" style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="card-body" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Total Applications</p>
                  <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary-600)' }}>
                    {job.applicationsCount || 45}+ Applicants
                  </p>
                </div>

                {applied ? (
                  <div style={{
                    background: 'var(--color-success-50)',
                    border: '1px solid var(--color-success-200)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <CheckCircle2 size={28} style={{ color: 'var(--color-success-600)' }} />
                    <p style={{ fontWeight: 700, color: 'var(--color-success-700)', fontSize: 'var(--text-sm)' }}>
                      Application Submitted!
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-700)', marginBottom: 'var(--space-2)' }}>
                      Status: <strong>Applied & Under Review</strong>
                    </p>
                    <Link to="/candidate/applications" style={{ width: '100%' }}>
                      <Button variant="primary" size="sm" fullWidth rightIcon={<ChevronRight size={14} />}>
                        Track on Candidate Portal
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setApplyModalOpen(true)}
                    style={{ marginBottom: 'var(--space-3)' }}
                  >
                    Apply for this Position
                  </Button>
                )}

                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleToggleSave}
                  leftIcon={saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                >
                  {saved ? 'Saved in My Bookmarks' : 'Save for Later'}
                </Button>

                <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      fontSize: 'var(--text-xs)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer'
                    }}
                  >
                    <Flag size={12} /> Report this Job
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Job Summary Info Card */}
            <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 'var(--text-base)' }}>Job Overview</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Posted Date:</span>
                  <strong>{new Date(job.postedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Industry:</span>
                  <strong>{job.industry}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Work Mode:</span>
                  <strong>{job.workMode}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Openings:</span>
                  <strong>{job.openings}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Location:</span>
                  <strong>{job.location}</strong>
                </div>
              </div>
            </div>

            {/* Trust & Safety notice */}
            <div style={{
              background: 'var(--color-gray-100)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)',
              display: 'flex',
              gap: 'var(--space-3)',
              alignItems: 'flex-start'
            }}>
              <ShieldCheck size={20} style={{ color: 'var(--color-success-600)', flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-normal)' }}>
                <strong>NTR VIKASA Job Portal Verified:</strong> This recruiter is verified. NTR VIKASA Job Portal never charges job seekers for interview slots or offer letters.
              </p>
            </div>

          </div>
        </div>

        {/* 6. Similar Jobs Section — Full Width at Bottom */}
        <div style={{ marginTop: 'var(--space-12)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
            Similar Job Openings
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {similarJobs.map((simJob) => (
              <JobCard key={simJob.id} job={simJob} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Apply Bar (Visible only on <= 1024px) ── */}
      <div className="mobile-apply-bar">
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {job.title}
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>
            {job.salary} • {job.company}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button
            variant={applied ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => !applied && setApplyModalOpen(true)}
            disabled={applied}
          >
            {applied ? '✓ Applied' : 'Apply Now'}
          </Button>
          <Button
            variant={saved ? 'primary' : 'secondary'}
            size="sm"
            iconOnly
            leftIcon={saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            onClick={handleToggleSave}
            aria-label={saved ? 'Unsave Job' : 'Save Job'}
          />
        </div>
      </div>

      {/* ── 1. Apply Now Modal ── */}
      <Modal
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
        size="md"
      >
        <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Applying to <strong>{job.company}</strong> ({job.location})
          </p>

          <FormField label="Full Name" htmlFor="applicantName" required>
            <Input
              id="applicantName"
              placeholder="e.g. Priya Sharma"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              required
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <FormField label="Email Address" htmlFor="applicantEmail" required>
              <Input
                id="applicantEmail"
                type="email"
                placeholder="priya@example.com"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Phone Number" htmlFor="applicantPhone" required>
              <Input
                id="applicantPhone"
                type="tel"
                placeholder="+91 98765 43210"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                required
              />
            </FormField>
          </div>

          <FormField label="Attach Resume" required hint="PDF, DOC, DOCX up to 5MB">
            <FileUpload accept=".pdf,.doc,.docx" maxSize="5 MB" />
          </FormField>

          <FormField label="Brief Cover Note / Why are you a good fit?" htmlFor="coverNote">
            <Textarea
              id="coverNote"
              rows={3}
              placeholder="Highlight relevant projects, notice period, and why you're interested..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
            />
          </FormField>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <Button variant="secondary" type="button" onClick={() => setApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={isSubmitting} leftIcon={<Send size={16} />}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── 2. Report Job Modal ── */}
      <Modal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Job Listing"
        size="sm"
      >
        <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Help us maintain a safe community. Reports are reviewed by our trust team.
          </p>

          <FormField label="Reason for Report" htmlFor="reportReason" required>
            <select
              id="reportReason"
              className="select"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="Misleading salary or job description">Misleading salary or job description</option>
              <option value="Asking for money or registration fee">Asking for money or registration fee</option>
              <option value="Suspicious or fake company identity">Suspicious or fake company identity</option>
              <option value="Expired or inactive position">Expired or inactive position</option>
              <option value="Inappropriate or offensive content">Inappropriate or offensive content</option>
            </select>
          </FormField>

          <FormField label="Additional Details" htmlFor="reportDetails">
            <Textarea
              id="reportDetails"
              rows={3}
              placeholder="Provide any additional context or evidence..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            />
          </FormField>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
            <Button variant="secondary" type="button" onClick={() => setReportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" loading={isSubmitting}>
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
