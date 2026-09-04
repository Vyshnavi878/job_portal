import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText,
  Edit2, Save, X, Plus, Trash2, Download, RefreshCw, CheckCircle2,
  AlertCircle, Sparkles, UploadCloud, ShieldCheck, Award, FolderGit2,
  Globe, Languages, Layers, DollarSign, ExternalLink
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../context/ToastContext';
import { useCandidate } from '../../context/CandidateContext';
import { EDUCATION_LEVELS, LOCATIONS, SKILL_OPTIONS } from '../../data/mockData';

export default function CandidateProfilePage() {
  const { toast } = useToast();
  const { candidate, updateProfile } = useCandidate();
  const [editingSection, setEditingSection] = useState(null);

  // 1. Personal Details State
  const [personal, setPersonal] = useState({
    fullName: candidate.name,
    headline: candidate.headline,
    email: candidate.email,
    phone: candidate.phone,
    location: candidate.location,
    bio: candidate.bio,
    linkedin: candidate.linkedin,
    github: candidate.github,
    portfolio: candidate.portfolio
  });

  // 2. Professional Details State
  const [professional, setProfessional] = useState({
    currentRole: candidate.skillsPreferences.preferredRoles[0] || 'Software Engineer',
    currentCompany: 'Tech Corp',
    totalExperience: candidate.skillsPreferences.experience,
    currentSalary: candidate.skillsPreferences.currentSalary,
    expectedSalary: candidate.skillsPreferences.expectedSalary,
    workMode: candidate.skillsPreferences.workMode,
    jobType: candidate.skillsPreferences.jobType
  });

  // Sync if candidate changes
  useEffect(() => {
    setPersonal({
      fullName: candidate.name,
      headline: candidate.headline,
      email: candidate.email,
      phone: candidate.phone,
      location: candidate.location,
      bio: candidate.bio,
      linkedin: candidate.linkedin,
      github: candidate.github,
      portfolio: candidate.portfolio
    });
    setProfessional({
      currentRole: candidate.skillsPreferences.preferredRoles[0] || 'Software Engineer',
      currentCompany: 'Tech Corp',
      totalExperience: candidate.skillsPreferences.experience,
      currentSalary: candidate.skillsPreferences.currentSalary,
      expectedSalary: candidate.skillsPreferences.expectedSalary,
      workMode: candidate.skillsPreferences.workMode,
      jobType: candidate.skillsPreferences.jobType
    });
    setSkills(candidate.skillsPreferences.skills);
  }, [candidate]);

  // 3. Education List State
  const [educationList, setEducationList] = useState(candidate.educationList || [
    { id: '1', degree: "Bachelor's of Technology (B.Tech) in Computer Science", institution: 'Andhra University College of Engineering', year: '2022', score: '8.8 CGPA' }
  ]);

  // 4. Work Experience List State
  const [experienceList, setExperienceList] = useState(candidate.experienceList || [
    { id: '1', role: candidate.headline.split('|')[0].trim(), company: 'Infosys Ltd', duration: 'Jul 2023 - Present (1 yr 2 mos)', description: 'Lead frontend/backend engineering initiatives delivering scalable web architectures.' }
  ]);

  // 5. Skills State
  const [skills, setSkills] = useState(candidate.skillsPreferences.skills);
  const [newSkillInput, setNewSkillInput] = useState('');

  // 6. Certifications State
  const [certifications, setCertifications] = useState(candidate.certificationsList || [
    { id: '1', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
    { id: '2', name: 'Meta Certified Developer', issuer: 'Meta / Coursera', year: '2024' }
  ]);

  // 7. Projects State
  const [projects, setProjects] = useState(candidate.projectsList || [
    { id: '1', title: 'NTR VIKASA Candidate Portal', tech: 'React, TypeScript, CSS Variables', link: 'https://github.com', description: 'Architected high-performance candidate job portal and search application.' }
  ]);

  const handleSaveSection = (sectionName) => {
    setEditingSection(null);
    updateProfile({
      name: personal.fullName,
      headline: personal.headline,
      email: personal.email,
      phone: personal.phone,
      location: personal.location,
      bio: personal.bio,
      linkedin: personal.linkedin,
      github: personal.github,
      portfolio: personal.portfolio
    });
    toast({
      type: 'success',
      title: 'Profile Updated',
      message: `${sectionName} saved successfully!`,
    });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      const updated = [...skills, newSkillInput.trim()];
      setSkills(updated);
      setNewSkillInput('');
      toast({ type: 'success', title: 'Skill Added', message: `Added "${newSkillInput.trim()}".` });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    toast({ type: 'info', title: 'Skill Removed', message: `Removed "${skillToRemove}".` });
  };

  return (
    <div className="candidate-profile-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      {/* ── 1. Top Profile Strength Bar ── */}
      <div className="card" style={{
        borderRadius: 'var(--radius-2xl)',
        background: 'linear-gradient(135deg, var(--color-surface), var(--color-primary-50))',
        border: '1.5px solid var(--color-primary-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="card-body" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-accent-600))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 'var(--text-xl)',
                boxShadow: 'var(--shadow-md)'
              }}>
                {personal.fullName?.[0] || 'C'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>{personal.fullName}</h1>
                  <span className="badge badge-success" style={{ fontSize: '10px' }}>
                    <ShieldCheck size={11} style={{ marginRight: 2 }} /> Verified Candidate Profile
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{personal.headline}</p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                <Sparkles size={16} style={{ color: 'var(--color-primary-600)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-text)' }}>
                  Profile Completion: {candidate.profileCompletion}%
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Strong profile • High visibility among 14,200+ recruiters
              </p>
            </div>
          </div>

          <div style={{ height: 8, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${candidate.profileCompletion}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary-600), var(--color-accent-500))', borderRadius: 'var(--radius-full)' }} />
          </div>
        </div>
      </div>

      {/* ── 2. Personal Information & Social Links ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <User size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title" style={{ fontSize: 'var(--text-base)' }}>Personal Information & Social Links</h2>
          </div>
          {editingSection === 'personal' ? (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button size="xs" variant="secondary" onClick={() => setEditingSection(null)}>Cancel</Button>
              <Button size="xs" variant="primary" leftIcon={<Save size={13} />} onClick={() => handleSaveSection('Personal details')}>Save</Button>
            </div>
          ) : (
            <Button size="xs" variant="ghost" leftIcon={<Edit2 size={13} />} onClick={() => setEditingSection('personal')}>Edit</Button>
          )}
        </div>

        <div className="card-body">
          {editingSection === 'personal' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                <FormField label="Full Name" required>
                  <Input value={personal.fullName} onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })} />
                </FormField>
                <FormField label="Professional Headline" required>
                  <Input value={personal.headline} onChange={(e) => setPersonal({ ...personal, headline: e.target.value })} />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <FormField label="Email" required>
                  <Input type="email" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
                </FormField>
                <FormField label="Phone Number" required>
                  <Input type="tel" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
                </FormField>
                <FormField label="Current Location" required>
                  <Input value={personal.location} onChange={(e) => setPersonal({ ...personal, location: e.target.value })} />
                </FormField>
              </div>

              <FormField label="Professional Summary / Bio">
                <Textarea rows={3} value={personal.bio} onChange={(e) => setPersonal({ ...personal, bio: e.target.value })} />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <FormField label="LinkedIn Profile URL">
                  <Input value={personal.linkedin} onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })} />
                </FormField>
                <FormField label="GitHub Profile URL">
                  <Input value={personal.github} onChange={(e) => setPersonal({ ...personal, github: e.target.value })} />
                </FormField>
                <FormField label="Portfolio Website URL">
                  <Input value={personal.portfolio} onChange={(e) => setPersonal({ ...personal, portfolio: e.target.value })} />
                </FormField>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Email Address</span><strong>{personal.email}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Phone Number</span><strong>{personal.phone}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Location</span><strong>{personal.location}</strong></div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block', marginBottom: 2 }}>Professional Summary</span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>{personal.bio}</p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.46 1.46 0 0 0-1.45-1.46 1.46 1.46 0 0 0-1.46 1.46c0 .8.65 1.45 1.46 1.45m1.39 9.74v-8.37H5.07v8.37h2.78z"/></svg>
                  LinkedIn Profile <ExternalLink size={11} />
                </a>
                <a href={personal.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                  GitHub Repositories <ExternalLink size={11} />
                </a>
                <a href={personal.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <Globe size={14} /> Portfolio Website <ExternalLink size={11} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Career Preferences & Salary ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Briefcase size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title" style={{ fontSize: 'var(--text-base)' }}>Professional & Career Preferences</h2>
          </div>
          <Link to="/candidate/skills-preferences">
            <Button size="xs" variant="outline">Manage Preferences</Button>
          </Link>
        </div>

        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
            <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Total Experience</span><strong>{professional.totalExperience}</strong></div>
            <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Current Salary</span><strong>{professional.currentSalary}</strong></div>
            <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Expected Salary</span><strong style={{ color: 'var(--color-success-700)' }}>{professional.expectedSalary}</strong></div>
            <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Preferred Work Mode</span><strong>{professional.workMode}</strong></div>
          </div>
        </div>
      </div>

      {/* ── 4. Technical Skills Section ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Layers size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title" style={{ fontSize: 'var(--text-base)' }}>Technical Skills ({skills.length})</h2>
          </div>
          <Link to="/candidate/skills-preferences">
            <Button size="xs" variant="outline">Edit in Skills Center</Button>
          </Link>
        </div>

        <div className="card-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  background: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  border: '1px solid var(--color-primary-200)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-500)', padding: 0 }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: 360 }}>
            <Input
              placeholder="Add skill (e.g. Docker, GraphQL)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
            />
            <Button size="sm" variant="primary" type="submit" leftIcon={<Plus size={14} />}>Add</Button>
          </form>
        </div>
      </div>

      {/* ── 5. Work Experience ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Briefcase size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title" style={{ fontSize: 'var(--text-base)' }}>Work Experience</h2>
          </div>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {experienceList.map((exp) => (
            <div key={exp.id} style={{ borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800 }}>{exp.role}</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{exp.duration}</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-600)' }}>{exp.company} • {exp.location}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', marginTop: 4, lineHeight: 1.4 }}>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. Education ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <GraduationCap size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title" style={{ fontSize: 'var(--text-base)' }}>Education</h2>
          </div>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {educationList.map((edu) => (
            <div key={edu.id} style={{ borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800 }}>{edu.degree}</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{edu.duration || edu.year}</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{edu.institution}</p>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary-700)', marginTop: 2 }}>Score: {edu.score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. Certifications & Projects ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Award size={18} style={{ color: 'var(--color-primary-600)' }} />
              <h2 className="card-title" style={{ fontSize: 'var(--text-base)' }}>Certifications</h2>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {certifications.map((c) => (
              <div key={c.id} style={{ padding: 'var(--space-3)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800 }}>{c.name || c.title}</h3>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{c.issuer || c.authority} ({c.year})</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <FolderGit2 size={18} style={{ color: 'var(--color-primary-600)' }} />
              <h2 className="card-title" style={{ fontSize: 'var(--text-base)' }}>Featured Projects</h2>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {projects.map((p) => (
              <div key={p.id} style={{ padding: 'var(--space-3)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-primary-700)' }}>{p.title}</h3>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '2px 0' }}>{p.tech}</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text)' }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
