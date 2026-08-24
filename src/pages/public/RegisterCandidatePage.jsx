import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, Mail, Phone, Lock, MapPin, GraduationCap, CheckCircle2, ArrowRight, ArrowLeft, CreditCard } from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FileUpload from '../../components/ui/FileUpload';
import { useToast } from '../../context/ToastContext';
import { EDUCATION_LEVELS, LOCATIONS } from '../../data/mockData';

const STEPS = ['Personal & Contact Info', 'Education & Profile', 'Resume & Security'];

export default function RegisterCandidatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    aadhaarNumber: '',
    location: '',
    education: '',
    college: '',
    experience: 'Fresher (0-1 yr)',
    skills: '',
    password: '',
    confirmPassword: '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleNext = (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
        toast({
          type: 'error',
          title: 'Password Mismatch',
          message: 'Password and Confirm Password do not match. Please verify.',
        });
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast({
          type: 'success',
          title: 'Account Created Successfully!',
          message: 'Welcome to NTR VIKASA Job Portal! You can now explore jobs and track applications.',
        });
        navigate('/candidate/dashboard');
      }, 1400);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: 'var(--space-8) var(--space-4)', position: 'relative' }}>
      
      {/* Back to Home Link */}
      <div className="back-to-home">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Home
        </Link>
      </div>

      <div style={{ width: '100%', maxWidth: 620 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <Link to="/" className="logo" style={{ justifyContent: 'center', display: 'inline-flex', marginBottom: 'var(--space-4)', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo_image.png" alt="NTR Vikasa Logo" style={{ height: '48px', objectFit: 'contain' }} />
          </Link>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>
            Create Your Candidate Account
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>

        {/* Progress Step Bar */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{
                height: 4,
                borderRadius: 'var(--radius-full)',
                background: i <= step ? 'var(--color-primary-600)' : 'var(--color-gray-200)',
                transition: 'background var(--transition-slow)',
                marginBottom: 'var(--space-2)'
              }} />
              <p style={{ fontSize: 'var(--text-xs)', color: i <= step ? 'var(--color-primary-600)' : 'var(--color-text-muted)', fontWeight: i === step ? 700 : 500 }}>
                {i + 1}. {s}
              </p>
            </div>
          ))}
        </div>

        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleNext}>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-8)' }}>

              {/* STEP 1: Personal & Contact Details */}
              {step === 0 && (
                <>
                  <div className="form-row">
                    <FormField label="Full Name" htmlFor="fullName" required>
                      <Input
                        id="fullName"
                        placeholder="e.g. Priya Sharma"
                        value={form.fullName}
                        onChange={set('fullName')}
                        leftIcon={<User size={16} />}
                        required
                      />
                    </FormField>

                    <FormField label="Email Address" htmlFor="email" required>
                      <Input
                        id="email"
                        type="email"
                        placeholder="priya@example.com"
                        value={form.email}
                        onChange={set('email')}
                        leftIcon={<Mail size={16} />}
                        required
                      />
                    </FormField>
                  </div>

                  <div className="form-row">
                    <FormField label="Aadhaar Number" htmlFor="aadhaarNumber" required>
                      <Input
                        id="aadhaarNumber"
                        type="text"
                        placeholder="e.g. 1234 5678 9012"
                        value={form.aadhaarNumber}
                        onChange={set('aadhaarNumber')}
                        leftIcon={<CreditCard size={16} />}
                        pattern="[0-9\s]{12,14}"
                        required
                      />
                    </FormField>

                    <FormField label="Mobile Phone Number" htmlFor="phone" required>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={set('phone')}
                        leftIcon={<Phone size={16} />}
                        required
                      />
                    </FormField>
                  </div>

                  <FormField label="Current City / Location" htmlFor="location" required>
                    <Select
                      id="location"
                      options={LOCATIONS.filter(l => l !== 'All Locations')}
                      placeholder="Select your district"
                      value={form.location}
                      onChange={set('location')}
                    />
                  </FormField>
                </>
              )}

              {/* STEP 2: Education & Skills Profile */}
              {step === 1 && (
                <>
                  <FormField label="Highest Education Level" htmlFor="education" required>
                    <Select
                      id="education"
                      options={EDUCATION_LEVELS.filter(e => e !== 'All Qualifications')}
                      placeholder="Select highest qualification"
                      value={form.education}
                      onChange={set('education')}
                    />
                  </FormField>

                  <FormField label="College / University Name" htmlFor="college">
                    <Input
                      id="college"
                      placeholder="e.g. Bangalore University / IIT / NIT"
                      value={form.college}
                      onChange={set('college')}
                      leftIcon={<GraduationCap size={16} />}
                    />
                  </FormField>

                  <FormField label="Total Work Experience" htmlFor="experience" required>
                    <Select
                      id="experience"
                      options={['Fresher (0-1 yr)', '1-3 years', '3-5 years', '5-8 years', '8+ years']}
                      value={form.experience}
                      onChange={set('experience')}
                    />
                  </FormField>

                  <FormField label="Key Technical Skills" htmlFor="skills" hint="Comma-separated skills (e.g. React, JavaScript, Node.js)">
                    <Input
                      id="skills"
                      placeholder="React, TypeScript, SQL, Python..."
                      value={form.skills}
                      onChange={set('skills')}
                    />
                  </FormField>
                </>
              )}

              {/* STEP 3: Security & Resume */}
              {step === 2 && (
                <>
                  <FormField label="Upload Resume / CV" required hint="PDF, DOC, DOCX up to 5 MB">
                    <FileUpload accept=".pdf,.doc,.docx" maxSize="5 MB" />
                  </FormField>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <FormField label="Create Password" htmlFor="password" required hint="Min 8 characters">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create strong password"
                        value={form.password}
                        onChange={set('password')}
                        required
                      />
                    </FormField>

                    <FormField label="Confirm Password" htmlFor="confirmPassword" required>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={set('confirmPassword')}
                        required
                      />
                    </FormField>
                  </div>

                  <div style={{ background: 'var(--color-success-50)', border: '1px solid var(--color-success-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--color-success-600)', flexShrink: 0 }} />
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-700)', lineHeight: 'var(--leading-normal)' }}>
                      Free registration. NTR VIKASA Job Portal never charges job seekers for applications or interviews.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-8)' }}>
              {step > 0 ? (
                <Button variant="secondary" type="button" onClick={() => setStep((s) => s - 1)}>
                  ← Previous Step
                </Button>
              ) : <div />}

              <Button variant="primary" type="submit" loading={loading} rightIcon={<ArrowRight size={16} />}>
                {step < STEPS.length - 1 ? 'Continue to Next Step' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
