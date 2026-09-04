import { useState, useMemo } from 'react';
import {
  Users, Search, Filter, MapPin, Briefcase, GraduationCap,
  Sparkles, FileText, CheckCircle2, CalendarCheck, Eye,
  Download, X, ChevronDown, Check, UserPlus, SlidersHorizontal,
  Mail, Phone, Clock, DollarSign
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { useRecruiter } from '../../context/RecruiterContext';

export default function RecruiterCandidatesPage() {
  const { recruiter, shortlistCandidate, scheduleInterview } = useRecruiter();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedExp, setSelectedExp] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState('ALL');
  const [selectedWorkMode, setSelectedWorkMode] = useState('ALL');

  // Candidate Profile Modal
  const [profileCandidate, setProfileCandidate] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Schedule Interview Modal
  const [interviewCandidate, setInterviewCandidate] = useState(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '2026-09-15',
    time: '11:00 AM IST',
    mode: 'Online (Google Meet)',
    jobTitle: recruiter.jobs[0]?.title || 'Senior Software Engineer',
    notes: 'Please prepare 45 minutes for live coding and architecture discussion.'
  });

  const candidates = recruiter.candidates || [];

  const locationsList = ['ALL', ...new Set(candidates.map(c => c.location.split(',')[0].trim()))];
  const allSkills = ['ALL', 'React.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Kubernetes', 'Docker', 'AWS', 'Figma', 'Java'];

  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesQuery =
          cand.name.toLowerCase().includes(q) ||
          cand.role.toLowerCase().includes(q) ||
          cand.headline.toLowerCase().includes(q) ||
          cand.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      if (selectedLocation !== 'ALL' && !cand.location.includes(selectedLocation)) {
        return false;
      }

      if (selectedSkill !== 'ALL' && !cand.skills.some(s => s.toLowerCase() === selectedSkill.toLowerCase())) {
        return false;
      }

      if (selectedWorkMode !== 'ALL' && !cand.workMode.toLowerCase().includes(selectedWorkMode.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [candidates, search, selectedLocation, selectedSkill, selectedWorkMode]);

  const handleOpenProfile = (candidate) => {
    setProfileCandidate(candidate);
    setProfileModalOpen(true);
  };

  const handleShortlistClick = (candidate) => {
    shortlistCandidate(candidate.id, recruiter.jobs[0]?.id);
    toast({
      type: 'success',
      title: 'Candidate Shortlisted',
      message: `${candidate.name} has been added to your Shortlisted pool.`
    });
  };

  const handleOpenInterview = (candidate) => {
    setInterviewCandidate(candidate);
    setInterviewForm(prev => ({ ...prev, jobTitle: recruiter.jobs[0]?.title || 'Senior Software Engineer' }));
    setInterviewModalOpen(true);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!interviewCandidate) return;
    scheduleInterview({
      candidateId: interviewCandidate.id,
      candidateName: interviewCandidate.name,
      candidateEmail: interviewCandidate.email,
      jobTitle: interviewForm.jobTitle,
      date: interviewForm.date,
      time: interviewForm.time,
      mode: interviewForm.mode,
      interviewer: `${recruiter.name} (Hiring Panel)`,
      meetingLink: 'https://meet.google.com/direct-invite-' + interviewCandidate.id,
      notes: interviewForm.notes
    });
    setInterviewModalOpen(false);
    toast({
      type: 'success',
      title: 'Interview Scheduled',
      message: `Interview scheduled with ${interviewCandidate.name} on ${interviewForm.date} at ${interviewForm.time}.`
    });
  };

  return (
    <div className="recruiter-candidates-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      
      {/* ── 1. Page Header ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Users size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Find Candidates & Talent Pool</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Search, filter, and discover verified candidates matching your company's open positions across Andhra Pradesh & India.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span className="badge badge-primary" style={{ padding: '6px 14px', fontSize: 'var(--text-xs)' }}>
              {filteredCandidates.length} Candidates Available
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <div className="input-wrapper">
            <span className="input-icon-left"><Search size={16} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search by candidate name, skill, title, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            options={locationsList.map(l => l === 'ALL' ? 'All Locations' : l)}
            value={selectedLocation === 'ALL' ? 'All Locations' : selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value === 'All Locations' ? 'ALL' : e.target.value)}
          />

          <Select
            options={allSkills.map(s => s === 'ALL' ? 'All Skills' : s)}
            value={selectedSkill === 'ALL' ? 'All Skills' : selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value === 'All Skills' ? 'ALL' : e.target.value)}
          />

          <Select
            options={['All Work Modes', 'Hybrid', 'Remote', 'On-site']}
            value={selectedWorkMode === 'ALL' ? 'All Work Modes' : selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value === 'All Work Modes' ? 'ALL' : e.target.value)}
          />
        </div>
      </div>

      {/* ── 2. Candidate Cards Grid ── */}
      {filteredCandidates.length === 0 ? (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-12)' }}>
          <EmptyState
            icon="users"
            title="No Candidates Found"
            description="Try loosening your search filters or searching for different technical skills."
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--space-5)' }}>
          {filteredCandidates.map((cand) => (
            <div
              key={cand.id}
              className="card hover-lift"
              style={{
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--space-5)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                background: 'var(--color-surface)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-xl)',
                      background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-accent-600))',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 'var(--text-base)',
                      flexShrink: 0
                    }}>
                      {cand.name[0]}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.2 }}>
                        {cand.name}
                      </h3>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600, marginTop: 2 }}>
                        {cand.role}
                      </p>
                    </div>
                  </div>

                  <span className="badge badge-success" style={{ fontSize: '11px', fontWeight: 800 }}>
                    {cand.matchScore}% Match
                  </span>
                </div>

                {/* Candidate Quick Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Briefcase size={13} style={{ color: 'var(--color-primary-600)' }} />
                    <span><strong>Experience:</strong> {cand.experience}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} style={{ color: 'var(--color-primary-600)' }} />
                    <span><strong>Location:</strong> {cand.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <DollarSign size={13} style={{ color: 'var(--color-success-600)' }} />
                    <span><strong>Expected CTC:</strong> {cand.expectedSalary}</span>
                  </div>
                </div>

                {/* Skills Tags */}
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {cand.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-primary-50)',
                          color: 'var(--color-primary-700)',
                          fontSize: '11px',
                          fontWeight: 600
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {cand.skills.length > 4 && (
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
                        +{cand.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Button
                  size="xs"
                  variant="outline"
                  leftIcon={<Eye size={12} />}
                  onClick={() => handleOpenProfile(cand)}
                >
                  View Profile
                </Button>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button
                    size="xs"
                    variant={cand.shortlisted ? 'secondary' : 'primary'}
                    onClick={() => handleShortlistClick(cand)}
                  >
                    {cand.shortlisted ? 'Shortlisted' : 'Shortlist'}
                  </Button>

                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleOpenInterview(cand)}
                  >
                    Interview
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 3. Candidate Full Profile Modal ── */}
      {profileCandidate && (
        <Modal
          open={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title={`Candidate Profile: ${profileCandidate.name}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            
            {/* Header info */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#ffffff' }}>{profileCandidate.name}</h3>
                  <span className="badge badge-success" style={{ fontSize: '10px' }}>{profileCandidate.matchScore}% Match Score</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: '#c7d2fe', fontWeight: 600 }}>{profileCandidate.headline}</p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: '#cbd5e1' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {profileCandidate.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={12} /> {profileCandidate.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} /> {profileCandidate.phone}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '11px', color: '#cbd5e1' }}>Availability</span>
                <strong style={{ fontSize: 'var(--text-xs)', color: '#fff' }}>{profileCandidate.availability}</strong>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                Professional Summary
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)', background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
                {profileCandidate.summary}
              </p>
            </div>

            {/* Compensation & Experience Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Experience</span>
                <strong>{profileCandidate.experience}</strong>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Current CTC</span>
                <strong>{profileCandidate.currentSalary}</strong>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Expected CTC</span>
                <strong style={{ color: 'var(--color-success-700)' }}>{profileCandidate.expectedSalary}</strong>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Work Mode</span>
                <strong>{profileCandidate.workMode}</strong>
              </div>
            </div>

            {/* Skills Badges */}
            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Validated Technical Skills
              </h4>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {profileCandidate.skills.map((s) => (
                  <span key={s} className="badge badge-primary" style={{ fontSize: 'var(--text-xs)', padding: '4px 10px' }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Education & Certifications */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                  Education
                </h4>
                <p style={{ color: 'var(--color-text)' }}>{profileCandidate.education}</p>
              </div>

              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                  Certifications
                </h4>
                <p style={{ color: 'var(--color-text)' }}>{profileCandidate.certifications?.join(', ')}</p>
              </div>
            </div>

            {/* Resume Download Box */}
            <div style={{
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-200)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <FileText size={22} style={{ color: 'var(--color-primary-600)' }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>{profileCandidate.resumeName}</p>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Verified Candidate Resume (ATS Score: 92/100)</p>
                </div>
              </div>
              <Button size="xs" variant="primary" leftIcon={<Download size={13} />} onClick={() => toast({ type: 'info', title: 'Downloading Resume', message: `Downloading ${profileCandidate.resumeName}` })}>
                Download Resume
              </Button>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <Button variant="ghost" size="sm" onClick={() => setProfileModalOpen(false)}>
                Close
              </Button>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    handleShortlistClick(profileCandidate);
                    setProfileModalOpen(false);
                  }}
                >
                  Shortlist Candidate
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CalendarCheck size={14} />}
                  onClick={() => {
                    setProfileModalOpen(false);
                    handleOpenInterview(profileCandidate);
                  }}
                >
                  Schedule Interview
                </Button>
              </div>
            </div>

          </div>
        </Modal>
      )}

      {/* ── 4. Schedule Interview Modal ── */}
      {interviewCandidate && (
        <Modal
          open={interviewModalOpen}
          onClose={() => setInterviewModalOpen(false)}
          title={`Schedule Interview: ${interviewCandidate.name}`}
          size="md"
        >
          <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FormField label="Target Job Opening" required>
              <Select
                options={recruiter.jobs.map(j => j.title)}
                value={interviewForm.jobTitle}
                onChange={(e) => setInterviewForm({ ...interviewForm, jobTitle: e.target.value })}
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <FormField label="Interview Date" required>
                <Input
                  type="date"
                  value={interviewForm.date}
                  onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Interview Time (IST)" required>
                <Input
                  type="text"
                  placeholder="e.g. 11:00 AM IST"
                  value={interviewForm.time}
                  onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField label="Interview Mode" required>
              <Select
                options={['Online (Google Meet)', 'Online (MS Teams)', 'Online (Zoom)', 'Telephonic Screening', 'On-Site Office Round']}
                value={interviewForm.mode}
                onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
              />
            </FormField>

            <FormField label="Instructions & Preparation Notes">
              <Textarea
                rows={3}
                value={interviewForm.notes}
                onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <Button type="button" variant="secondary" onClick={() => setInterviewModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" leftIcon={<CalendarCheck size={14} />}>Confirm Interview</Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
