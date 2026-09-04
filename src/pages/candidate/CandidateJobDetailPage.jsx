import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Briefcase, Banknote, Clock, Building2, CheckCircle2,
  Bookmark, BookmarkCheck, ArrowLeft, Share2, ShieldCheck,
  Zap, Award, Check, ExternalLink, Calendar, Users, Globe
} from 'lucide-react';
import Button from '../../components/ui/Button';
import ApplyModal from '../../components/ui/ApplyModal';
import { useCandidate } from '../../context/CandidateContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_JOBS } from '../../data/mockData';

export default function CandidateJobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { candidate, isJobSaved, saveJob, unsaveJob } = useCandidate();
  const { toast } = useToast();

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Find job from mock data or fallback to first job
  const job = MOCK_JOBS.find(j => String(j.id) === String(id)) || MOCK_JOBS[0];
  const isSaved = isJobSaved(job.id);

  const handleToggleSave = () => {
    if (isSaved) {
      unsaveJob(job.id);
      toast({ type: 'info', title: 'Job Removed', message: 'Job removed from your saved list.' });
    } else {
      saveJob(job.id);
      toast({ type: 'success', title: 'Job Saved', message: 'Job saved to your Saved Jobs workspace.' });
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({ type: 'success', title: 'Link Copied', message: 'Job link copied to clipboard.' });
  };

  const similarJobs = MOCK_JOBS.filter(j => String(j.id) !== String(job.id)).slice(0, 3);

  return (
    <div className="candidate-job-detail-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      
      {/* Back button */}
      <div>
        <Link
          to="/candidate/jobs"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Find Jobs
        </Link>
      </div>

      {/* ── Top Hero Card ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-2xl)',
              background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
              color: '#fff',
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              {job.company?.[0] || 'C'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>{job.title}</h1>
                <span className="badge badge-success" style={{ fontSize: '11px' }}>
                  <ShieldCheck size={12} style={{ marginRight: 2 }} /> Verified Employer
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 4 }}>
                <Link to="/candidate/companies" style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary-600)', textDecoration: 'none' }}>
                  {job.company}
                </Link>
                <span style={{ color: 'var(--color-text-light)' }}>•</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Posted 2 days ago</span>
              </div>

              {/* Meta pills */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {job.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Banknote size={14} /> {job.salary}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {job.experience}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={14} /> {job.type} ({job.mode})</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <Button
              variant="outline"
              size="md"
              leftIcon={isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              onClick={handleToggleSave}
            >
              {isSaved ? 'Saved' : 'Save Job'}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setApplyModalOpen(true)}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* ── 2-Column Details Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: 'var(--space-6)' }}>
        
        {/* Left Column: Description, Responsibilities, Skills, Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Job Description */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              Job Description
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>
              {job.description || `We are looking for an experienced ${job.title} to join our high-performing technology team. You will be responsible for building, optimizing, and deploying mission-critical systems and interfaces supporting millions of users across India.`}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              Key Responsibilities
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingLeft: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
              <li>Design, develop, test, and maintain robust production-grade software applications and services.</li>
              <li>Collaborate closely with cross-functional product managers, UI/UX designers, and QA engineers.</li>
              <li>Participate in architecture reviews, code reviews, and performance benchmarking sessions.</li>
              <li>Ensure high code test coverage, automated CI/CD pipeline compatibility, and documentation.</li>
              <li>Troubleshoot production incidents and optimize database queries and async task pipelines.</li>
            </ul>
          </div>

          {/* Required Skills & Qualifications */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              Required Skills & Qualifications
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
              {(job.tags || ['React.js', 'Python', 'PostgreSQL', 'REST APIs', 'TypeScript', 'Docker']).map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: 'var(--color-primary-50)',
                    color: 'var(--color-primary-700)',
                    border: '1px solid var(--color-primary-200)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Education & Experience:</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingLeft: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
              <li>Bachelor's or Master's degree in Computer Science, Information Technology, or relevant discipline.</li>
              <li>{job.experience} of proven hands-on industry development experience.</li>
              <li>Strong problem solving, data structures, and algorithmic analytical skills.</li>
            </ul>
          </div>

          {/* Salary & Benefits */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              Salary & Benefits
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
              {[
                'Competitive Salary: ' + job.salary,
                'Comprehensive Health & Family Insurance',
                'Hybrid / Remote Work Flexibility',
                'Annual Performance Bonus & Stock Options',
                'Learning & Certification Allowances',
                'Paid Time Off & Wellness Leaves'
              ].map((benefit, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
                  <Check size={14} style={{ color: 'var(--color-success-600)', flexShrink: 0 }} /> {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* About Company */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              About {job.company}
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              {job.company} is an industry-leading technology enterprise building next-generation digital solutions for global organizations. Operating across Andhra Pradesh and major Indian tech corridors with over 10,000+ employees.
            </p>
          </div>
        </div>

        {/* Right Column: Job Overview & Similar Jobs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Job Overview Widget */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              Job Overview
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-100)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Job Title</span>
                <strong style={{ color: 'var(--color-text)' }}>{job.title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-100)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Company</span>
                <strong style={{ color: 'var(--color-text)' }}>{job.company}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-100)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Job Location</span>
                <strong style={{ color: 'var(--color-text)' }}>{job.location}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-100)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Salary Offered</span>
                <strong style={{ color: 'var(--color-success-700)' }}>{job.salary}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-100)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Experience</span>
                <strong style={{ color: 'var(--color-text)' }}>{job.experience}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-100)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Work Mode</span>
                <strong style={{ color: 'var(--color-text)' }}>{job.mode}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Job Type</span>
                <strong style={{ color: 'var(--color-text)' }}>{job.type}</strong>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <Button fullWidth variant="primary" onClick={() => setApplyModalOpen(true)}>
                Apply for this Role
              </Button>
            </div>
          </div>

          {/* Similar Jobs Widget */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              Similar Jobs You May Like
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {similarJobs.map((simJob) => (
                <Link
                  key={simJob.id}
                  to={`/candidate/jobs/${simJob.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-gray-100)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    background: 'var(--color-bg)'
                  }}
                >
                  <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary-600)' }}>
                    {simJob.title}
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{simJob.company} • {simJob.location}</p>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text)' }}>{simJob.salary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={job}
      />
    </div>
  );
}
