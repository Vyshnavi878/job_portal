import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase, Building2, MapPin, DollarSign, Calendar,
  CheckCircle2, ArrowRight, Save, Send, Plus, X, AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../context/ToastContext';
import {
  JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS, SALARY_RANGES,
  LOCATIONS, SKILL_OPTIONS, INDUSTRIES
} from '../../data/mockData';

export default function RecruiterCreateJobPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    openings: '3',
    deadline: '2026-09-30',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    experience: '3-5 years',
    salary: '₹16 - ₹24 LPA',
    description: '',
    responsibilities: '• Architect and implement robust, scalable user interfaces using React, TypeScript, and modern state tooling.\n• Collaborate with product managers, UX designers, and backend engineering teams to deliver delightful end-user experiences.\n• Write automated unit, integration, and end-to-end tests ensuring 90%+ code coverage.\n• Participate in technical design discussions and mentor junior developers.',
    requirements: '• 3+ years of professional software engineering experience with modern React (hooks, context, Suspense).\n• Deep proficiency in TypeScript, JavaScript (ES2023+), HTML5, CSS3, and responsive design systems.\n• Strong grasp of web performance optimization, accessibility (WCAG 2.1), and browser rendering engines.\n• Experience with RESTful APIs, GraphQL, and micro-frontend architectures.',
    qualifications: "• Bachelor's or Master's degree in Computer Science, Information Technology, or equivalent practical experience.",
    skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Redux Toolkit'],
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !formData.skills.includes(newSkillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkillInput.trim()] });
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      toast({ type: 'error', title: 'Job Title Required', message: 'Please enter a title before saving draft.' });
      return;
    }
    toast({
      type: 'info',
      title: 'Draft Saved',
      message: `Job "${formData.title}" has been saved to your drafts.`,
    });
    navigate('/recruiter/jobs');
  };

  const handleSubmitForApproval = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({ type: 'error', title: 'Incomplete Details', message: 'Please fill in all mandatory job information.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        type: 'success',
        title: 'Job Submitted for Review',
        message: `Your job posting "${formData.title}" has been submitted for Admin approval. Status: PENDING.`,
      });
      navigate('/recruiter/jobs');
    }, 1000);
  };

  return (
    <div className="recruiter-create-job-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Briefcase size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Create New Job Opening</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Publish verified career opportunities directly to thousands of qualified candidates
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="secondary" size="sm" leftIcon={<Save size={14} />} onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Send size={14} />} loading={loading} onClick={handleSubmitForApproval}>
              Submit for Approval
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitForApproval} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

        {/* ── 1. Basic Information ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header">
            <h2 className="card-title">1. Job Role & Overview</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Job Title" required hint="e.g. Senior Frontend Engineer, Lead DevOps Specialist">
                <Input
                  placeholder="Enter specific job title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Department / Guild" required>
                <Input
                  placeholder="e.g. Engineering, Product, Design"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Job Type" required>
                <Select
                  options={JOB_TYPES.filter(t => t !== 'All Types')}
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                />
              </FormField>

              <FormField label="Work Mode" required>
                <Select
                  options={WORK_MODES.filter(m => m !== 'All Modes')}
                  value={formData.workMode}
                  onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                />
              </FormField>

              <FormField label="Open Positions" required>
                <Input
                  type="number"
                  min="1"
                  value={formData.openings}
                  onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Application Deadline" required>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* ── 2. Location Details ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header">
            <h2 className="card-title">2. Job Location & Territory</h2>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <FormField label="Country" required>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </FormField>

            <FormField label="State / Region" required>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </FormField>

            <FormField label="City / Delivery Center" required>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </FormField>
          </div>
        </div>

        {/* ── 3. Experience & Compensation ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header">
            <h2 className="card-title">3. Experience & Compensation</h2>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <FormField label="Required Experience Level" required>
              <Select
                options={EXPERIENCE_LEVELS.filter(e => e !== 'All Experience')}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </FormField>

            <FormField label="Offered CTC Range (Annual)" required hint="e.g. ₹15 - ₹22 LPA or ₹18,00,000 / year">
              <Input
                placeholder="e.g. ₹16 - ₹24 LPA"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
              />
            </FormField>
          </div>
        </div>

        {/* ── 4. Job Description & Specifications ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header">
            <h2 className="card-title">4. Job Description & Specifications</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FormField label="Job Summary / About the Role" required hint="Briefly describe what this position entails and team objectives">
              <Textarea
                rows={3}
                placeholder="We are looking for a passionate Senior Frontend Engineer to join our Core UI Architecture team..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Key Responsibilities" required hint="Bulleted list of daily responsibilities">
              <Textarea
                rows={4}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Requirements & Technical Skills" required hint="Core technical criteria and proficiency standards">
              <Textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Minimum Educational Qualifications" required>
              <Input
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                required
              />
            </FormField>

            {/* Skills Tag Management */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-2)' }}>
                Target Skills & Keywords ({formData.skills.length})
              </label>

              <div style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: 460, marginBottom: 'var(--space-3)' }}>
                <Input
                  placeholder="Add required skill (e.g. Next.js, Redux, Docker)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                />
                <Button type="button" variant="primary" size="sm" onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge badge-primary"
                    style={{ padding: '6px 12px', fontSize: 'var(--text-xs)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    {skill}
                    <X size={12} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => handleRemoveSkill(skill)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/recruiter/jobs">
              <Button variant="ghost" size="sm">Cancel & Return</Button>
            </Link>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="secondary" type="button" leftIcon={<Save size={14} />} onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button variant="primary" type="submit" leftIcon={<Send size={14} />} loading={loading}>
                Submit for Approval
              </Button>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
