import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText,
  Edit2, Save, X, Plus, Trash2, Download, RefreshCw, CheckCircle2,
  AlertCircle, Sparkles, UploadCloud, ShieldCheck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../context/ToastContext';
import { EDUCATION_LEVELS, LOCATIONS, SKILL_OPTIONS } from '../../data/mockData';

export default function CandidateProfilePage() {
  const { toast } = useToast();

  // Mode: view or editing
  const [editingSection, setEditingSection] = useState(null); // 'personal' | 'professional' | 'education' | 'experience' | 'skills' | 'objective' | null

  // 1. Personal Details State
  const [personal, setPersonal] = useState({
    fullName: 'Priya Sharma',
    headline: 'Senior React & Frontend Developer | 4+ Years Experience',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    bio: 'Passionate frontend engineer specializing in performant React architectures, design systems, TypeScript, and micro-frontend state management.',
  });

  // 2. Professional Details State
  const [professional, setProfessional] = useState({
    currentRole: 'Senior Frontend Engineer',
    currentCompany: 'Infosys Ltd',
    totalExperience: '4.2 Years',
    currentSalary: '₹14,50,000 / year',
    expectedSalary: '₹22,00,000 / year',
    noticePeriod: '30 Days (Negotiable)',
  });

  // 3. Education List State
  const [educationList, setEducationList] = useState([
    { id: '1', degree: "Bachelor's of Technology (B.Tech) in Computer Science", institution: 'Visvesvaraya Technological University (VTU), Bengaluru', year: '2022', score: '8.8 CGPA' },
    { id: '2', degree: 'Higher Secondary School Certificate (Class XII, Science)', institution: 'Delhi Public School, Bengaluru South', year: '2018', score: '94.2%' },
  ]);

  // 4. Work Experience List State
  const [experienceList, setExperienceList] = useState([
    { id: '1', role: 'Senior Frontend Engineer', company: 'Infosys Ltd', duration: 'Jul 2024 - Present (2 yrs)', description: 'Lead UI guild of 6 engineers building cloud microservice dashboards using React 18, TypeScript, and Redux Toolkit.' },
    { id: '2', role: 'Software Engineer - Frontend', company: 'Wipro Technologies', duration: 'Aug 2022 - Jun 2024 (2 yrs)', description: 'Developed customer-facing payment portals and responsive mobile web apps with 99.8% crash-free sessions.' },
  ]);

  // 5. Skills State
  const [skills, setSkills] = useState(['React', 'TypeScript', 'JavaScript', 'Node.js', 'Redux Toolkit', 'Tailwind CSS', 'Figma', 'Jest', 'REST APIs', 'Git']);
  const [newSkillInput, setNewSkillInput] = useState('');

  // 6. Career Objective State
  const [objective, setObjective] = useState(
    'To secure a high-impact Staff or Senior Frontend Engineering role at a product-led tech company where I can architect scalable user interfaces, mentor engineering teams, and drive exceptional customer experience.'
  );

  // 7. Resume State
  const [resume, setResume] = useState({
    fileName: 'Priya_Sharma_Frontend_Lead_Resume_2026.pdf',
    fileSize: '1.4 MB',
    uploadedOn: '18 Aug 2026',
    verified: true,
  });

  const [resumeUploadError, setResumeUploadError] = useState('');

  const handleSaveSection = (sectionName) => {
    setEditingSection(null);
    toast({
      type: 'success',
      title: 'Profile Updated',
      message: `${sectionName} saved successfully!`,
    });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
      toast({ type: 'success', title: 'Skill Added', message: `Added "${newSkillInput.trim()}" to your profile.` });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    toast({ type: 'info', title: 'Skill Removed', message: `Removed "${skillToRemove}".` });
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setResumeUploadError('Invalid format! Please upload PDF, DOC, or DOCX files only.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeUploadError('File size exceeds 5MB limit! Please upload a smaller resume.');
      return;
    }

    setResumeUploadError('');
    setResume({
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedOn: 'Today',
      verified: true,
    });
    toast({
      type: 'success',
      title: 'Resume Replaced',
      message: `Updated resume to "${file.name}"`,
    });
  };

  const handleDownloadResume = () => {
    toast({
      type: 'info',
      title: 'Downloading Resume',
      message: `Downloading "${resume.fileName}"...`,
    });
  };

  return (
    <div className="candidate-profile-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── 1. Top Profile Strength Bar ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', background: 'linear-gradient(135deg, var(--color-surface), var(--color-primary-50))', border: '1px solid var(--color-primary-200)' }}>
        <div className="card-body" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 'var(--text-lg)' }}>
                {personal.fullName[0]}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{personal.fullName}</h2>
                  <span className="badge badge-success" style={{ fontSize: '10px' }}>Profile Verified</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{personal.headline}</p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Sparkles size={16} style={{ color: 'var(--color-warning-600)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>Profile Completion: 92%</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Top tier visibility among recruiters</p>
            </div>
          </div>

          <div style={{ height: 8, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, var(--color-primary-500), var(--color-success-500))', borderRadius: 'var(--radius-full)' }} />
          </div>
        </div>
      </div>

      {/* ── 2. Resume Management (Upload, Download, Replace, Validation) ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FileText size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h3 className="card-title">Manage Resume / CV</h3>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Auto-attached to all job applications</span>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-gray-50)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4) var(--space-6)',
            flexWrap: 'wrap',
            gap: 'var(--space-3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{resume.fileName}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Size: {resume.fileSize} • Uploaded: {resume.uploadedOn}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button size="sm" variant="outline" leftIcon={<Download size={14} />} onClick={handleDownloadResume}>
                Download
              </Button>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                <RefreshCw size={14} style={{ marginRight: 4 }} /> Replace Resume
                <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleResumeFileChange} />
              </label>
            </div>
          </div>

          {resumeUploadError && (
            <div style={{ background: 'var(--color-danger-50)', border: '1px solid var(--color-danger-200)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <AlertCircle size={16} style={{ color: 'var(--color-danger-600)' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger-700)' }}>{resumeUploadError}</span>
            </div>
          )}

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            <strong>Supported formats:</strong> PDF, DOCX, DOC (Maximum file size: 5MB).
          </p>
        </div>
      </div>

      {/* ── 3. Personal Details Section ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <User size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h3 className="card-title">Personal Details</h3>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <FormField label="Full Name" required>
                  <Input value={personal.fullName} onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })} />
                </FormField>
                <FormField label="Professional Headline" required>
                  <Input value={personal.headline} onChange={(e) => setPersonal({ ...personal, headline: e.target.value })} />
                </FormField>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
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
              <FormField label="Short Professional Bio">
                <Textarea rows={3} value={personal.bio} onChange={(e) => setPersonal({ ...personal, bio: e.target.value })} />
              </FormField>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Email Address</span><strong>{personal.email}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Phone Number</span><strong>{personal.phone}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Location</span><strong>{personal.location}</strong></div>
              </div>
              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block', marginBottom: 2 }}>Professional Summary</span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>{personal.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 4. Professional Details Section ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Briefcase size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h3 className="card-title">Professional Details</h3>
          </div>
          {editingSection === 'professional' ? (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button size="xs" variant="secondary" onClick={() => setEditingSection(null)}>Cancel</Button>
              <Button size="xs" variant="primary" leftIcon={<Save size={13} />} onClick={() => handleSaveSection('Professional details')}>Save</Button>
            </div>
          ) : (
            <Button size="xs" variant="ghost" leftIcon={<Edit2 size={13} />} onClick={() => setEditingSection('professional')}>Edit</Button>
          )}
        </div>

        <div className="card-body">
          {editingSection === 'professional' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Current Role">
                <Input value={professional.currentRole} onChange={(e) => setProfessional({ ...professional, currentRole: e.target.value })} />
              </FormField>
              <FormField label="Current Employer">
                <Input value={professional.currentCompany} onChange={(e) => setProfessional({ ...professional, currentCompany: e.target.value })} />
              </FormField>
              <FormField label="Total Experience">
                <Input value={professional.totalExperience} onChange={(e) => setProfessional({ ...professional, totalExperience: e.target.value })} />
              </FormField>
              <FormField label="Current CTC">
                <Input value={professional.currentSalary} onChange={(e) => setProfessional({ ...professional, currentSalary: e.target.value })} />
              </FormField>
              <FormField label="Expected CTC">
                <Input value={professional.expectedSalary} onChange={(e) => setProfessional({ ...professional, expectedSalary: e.target.value })} />
              </FormField>
              <FormField label="Notice Period">
                <Input value={professional.noticePeriod} onChange={(e) => setProfessional({ ...professional, noticePeriod: e.target.value })} />
              </FormField>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
              <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Current Role</span><strong>{professional.currentRole}</strong> ({professional.currentCompany})</div>
              <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Total Experience</span><strong>{professional.totalExperience}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Current Annual Salary</span><strong>{professional.currentSalary}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Expected Annual Salary</span><strong style={{ color: 'var(--color-success-600)' }}>{professional.expectedSalary}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Notice Period</span><strong>{professional.noticePeriod}</strong></div>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Skills Management Section ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Sparkles size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h3 className="card-title">Skills & Competencies ({skills.length})</h3>
          </div>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Add skill form */}
          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: 440 }}>
            <Input
              placeholder="Add skill (e.g. Next.js, Docker, Figma)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
            />
            <Button type="submit" variant="primary" size="sm" leftIcon={<Plus size={14} />}>
              Add
            </Button>
          </form>

          {/* Skill tags */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {skills.map((skill) => (
              <span
                key={skill}
                className="badge badge-primary"
                style={{
                  padding: '6px 12px',
                  fontSize: 'var(--text-xs)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {skill}
                <X
                  size={12}
                  style={{ cursor: 'pointer', opacity: 0.8 }}
                  onClick={() => handleRemoveSkill(skill)}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. Career Objective Section ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FileText size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h3 className="card-title">Career Objective</h3>
          </div>
          {editingSection === 'objective' ? (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button size="xs" variant="secondary" onClick={() => setEditingSection(null)}>Cancel</Button>
              <Button size="xs" variant="primary" leftIcon={<Save size={13} />} onClick={() => handleSaveSection('Career objective')}>Save</Button>
            </div>
          ) : (
            <Button size="xs" variant="ghost" leftIcon={<Edit2 size={13} />} onClick={() => setEditingSection('objective')}>Edit</Button>
          )}
        </div>

        <div className="card-body">
          {editingSection === 'objective' ? (
            <Textarea
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            />
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>
              {objective}
            </p>
          )}
        </div>
      </div>

      {/* ── 7. Work Experience Section ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Briefcase size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h3 className="card-title">Work Experience</h3>
          </div>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {experienceList.map((exp, idx) => (
            <div
              key={exp.id}
              style={{
                padding: 'var(--space-4)',
                background: 'var(--color-gray-50)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <h4 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{exp.role}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600, marginTop: 2 }}>{exp.company} • {exp.duration}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', lineHeight: 1.4 }}>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. Education Section ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <GraduationCap size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h3 className="card-title">Education & Qualifications</h3>
          </div>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {educationList.map((edu) => (
            <div
              key={edu.id}
              style={{
                padding: 'var(--space-4)',
                background: 'var(--color-gray-50)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h4 style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{edu.degree}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{edu.institution}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-info" style={{ fontSize: '10px' }}>Passing: {edu.year}</span>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-success-700)', marginTop: 4 }}>Score: {edu.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
