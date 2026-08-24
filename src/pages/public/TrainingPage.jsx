import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Award, CheckCircle2, Clock, MapPin,
  Users, ArrowRight, Sparkles, Search, Filter, Phone, Mail, Send
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useToast } from '../../context/ToastContext';

const TRAINING_PROGRAMS = [
  {
    id: 'TR-01',
    title: 'Full Stack Web Development & Cloud Computing',
    sector: 'Information Technology',
    duration: '3 Months (Full-Time)',
    mode: 'Hybrid (Classroom + Labs)',
    location: 'Vijayawada / Visakhapatnam',
    eligibility: 'Any Graduate / Diploma (B.Tech / B.Sc / BCA)',
    certification: 'NSDC & Industry Certified',
    description: 'Comprehensive hands-on training covering HTML, CSS, JavaScript, React, Node.js, SQL, and AWS Cloud foundations with live capstone projects.',
    skills: ['React.js', 'Node.js', 'PostgreSQL', 'AWS Cloud', 'Git & CI/CD'],
    seats: 40,
    placementAssistance: true,
  },
  {
    id: 'TR-02',
    title: 'Data Analytics & Business Intelligence',
    sector: 'Data & AI',
    duration: '10 Weeks',
    mode: 'Online Live Interactive',
    location: 'Statewide Virtual Lab',
    eligibility: 'Graduates with basic math/computing background',
    certification: 'Govt. Recognized Certification',
    description: 'Learn data analysis, dashboarding with Power BI, Python for Data Science, and SQL data modeling with real-world enterprise datasets.',
    skills: ['Python', 'SQL', 'Power BI', 'Excel Advanced', 'Statistical Modeling'],
    seats: 50,
    placementAssistance: true,
  },
  {
    id: 'TR-03',
    title: 'Banking, Financial Services & Insurance (BFSI) Operations',
    sector: 'Banking & Finance',
    duration: '6 Weeks',
    mode: 'Classroom Training',
    location: 'Guntur / Tirupati / Kurnool',
    eligibility: 'B.Com / BBA / Any Commerce Graduate',
    certification: 'BFSI Sector Skill Council Certified',
    description: 'Specialized training in retail banking operations, credit appraisal, mutual funds, insurance regulatory norms, and financial CRM software.',
    skills: ['Retail Banking', 'Tally Prime', 'KYC/AML', 'Financial Products', 'Customer Relations'],
    seats: 60,
    placementAssistance: true,
  },
  {
    id: 'TR-04',
    title: 'Advanced Industrial Electrician & PLC Automation',
    sector: 'Core Engineering',
    duration: '2 Months',
    mode: 'Hands-on Workshop',
    location: 'Industrial Training Center, Sri City',
    eligibility: 'ITI / Diploma in Electrical or Mechanical',
    certification: 'National Skill Qualification Framework (NSQF)',
    description: 'Practical training on PLC programming, industrial wiring, circuit breakers, solar panel maintenance, and industrial safety standards.',
    skills: ['PLC Programming', 'SCADA', 'Industrial Wiring', 'Safety Audits', 'Automation'],
    seats: 30,
    placementAssistance: true,
  },
  {
    id: 'TR-05',
    title: 'Healthcare & Hospital Administration Assistant',
    sector: 'Healthcare',
    duration: '8 Weeks',
    mode: 'Classroom + Hospital Internship',
    location: 'Vijayawada / Kakinada',
    eligibility: '12th Pass / Any Graduate',
    certification: 'Healthcare Sector Skill Council',
    description: 'Prepare for administrative and patient coordination roles in multispecialty hospitals, electronic medical records (EMR), and billing systems.',
    skills: ['EMR Systems', 'Patient Management', 'Medical Billing', 'First Aid', 'Hospital SOPs'],
    seats: 45,
    placementAssistance: true,
  },
  {
    id: 'TR-06',
    title: 'Digital Marketing & E-Commerce Management',
    sector: 'Marketing & Sales',
    duration: '6 Weeks',
    mode: 'Hybrid',
    location: 'Visakhapatnam',
    eligibility: '12th Pass / Graduates',
    certification: 'Industry Recognized Certificate',
    description: 'Master SEO, Google Ads, Meta Ads, content marketing, Shopify/Amazon seller management, and social media branding strategies.',
    skills: ['SEO', 'Google Ads', 'Social Media', 'Content Creation', 'Shopify'],
    seats: 50,
    placementAssistance: true,
  },
];

export default function TrainingPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [district, setDistrict] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectors = ['All Sectors', 'Information Technology', 'Data & AI', 'Banking & Finance', 'Core Engineering', 'Healthcare', 'Marketing & Sales'];

  const filteredCourses = TRAINING_PROGRAMS.filter((p) => {
    if (selectedSector !== 'All Sectors' && p.sector !== selectedSector) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchSkill = p.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSkill) return false;
    }
    return true;
  });

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEnrollModalOpen(false);
      toast({
        type: 'success',
        title: 'Enrollment Inquiry Received!',
        message: `Thank you, ${fullName}. Our skill development counselor will contact you at ${phone} regarding ${selectedCourse?.title}.`,
      });
      setFullName('');
      setEmail('');
      setPhone('');
      setQualification('');
      setDistrict('');
    }, 1200);
  };

  return (
    <div className="training-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-16)' }}>
      {/* ── Top Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
        color: '#ffffff',
        padding: 'var(--space-16) var(--space-6)',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: 860, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            marginBottom: 'var(--space-4)',
            color: '#e0e7ff'
          }}>
            <Sparkles size={14} style={{ color: '#fbbf24' }} />
            NTR VIKASA • Skill Development & Employment Generation
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 'var(--space-4)' }}>
            Skill Development & Training Programs
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: '#cbd5e1', lineHeight: 'var(--leading-relaxed)', maxWidth: 720, margin: '0 auto' }}>
            Empowering job seekers with government-certified, industry-aligned training programs, practical laboratory sessions, and 100% placement assistance across Andhra Pradesh.
          </p>
        </div>
      </div>

      {/* ── Key Highlights Strip ── */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-xl)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={22} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-text)' }}>Govt. Recognized</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>NSDC & NSQF Certified</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-xl)', background: 'var(--color-success-50)', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-text)' }}>Placement Support</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Job Mela Fast-Track Access</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-xl)', background: 'var(--color-info-50)', color: 'var(--color-info-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={22} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-text)' }}>Practical Curriculum</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Hands-on Industry Labs</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-xl)', background: 'var(--color-accent-50)', color: 'var(--color-accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-text)' }}>Expert Mentors</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Experienced Professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Section ── */}
      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div style={{ flex: '1 1 300px', maxWidth: 450 }}>
            <div className="input-wrapper">
              <span className="input-icon-left"><Search size={16} /></span>
              <input
                className="input has-icon-left"
                placeholder="Search training program by technology or sector..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {sectors.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSector(sec)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  border: selectedSector === sec ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                  background: selectedSector === sec ? 'var(--color-primary-600)' : 'var(--color-surface)',
                  color: selectedSector === sec ? '#ffffff' : 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* ── Course Grid ── */}
        <div className="responsive-card-grid">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="card card-hoverable"
              style={{
                borderRadius: 'var(--radius-2xl)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'var(--space-6)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <Badge variant="primary">{course.sector}</Badge>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-700)', fontWeight: 700, background: 'var(--color-success-50)', padding: '2px 8px', borderRadius: 'var(--radius-md)' }}>
                    {course.seats} Seats
                  </span>
                </div>

                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: 'var(--space-2)', color: 'var(--color-text)', lineHeight: 1.3 }}>
                  {course.title}
                </h2>

                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                  {course.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} style={{ color: 'var(--color-primary-600)' }} /> <strong>Duration:</strong> {course.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} style={{ color: 'var(--color-primary-600)' }} /> <strong>Location:</strong> {course.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GraduationCap size={13} style={{ color: 'var(--color-primary-600)' }} /> <strong>Eligibility:</strong> {course.eligibility}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
                  {course.skills.map((skill) => (
                    <span key={skill} style={{ fontSize: '10px', background: 'var(--color-gray-100)', color: 'var(--color-text)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-700)', fontWeight: 700 }}>
                  Free / Govt. Sponsored
                </span>
                <Button size="sm" variant="primary" onClick={() => handleEnrollClick(course)}>
                  Enroll / Inquire
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Enrollment Inquiry Modal ── */}
      <Modal
        open={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title={`Enroll in: ${selectedCourse?.title}`}
        size="md"
      >
        <form onSubmit={handleEnrollSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Submit your details to receive full syllabus information, batch schedules, and scholarship assistance.
          </p>

          <FormField label="Full Name" htmlFor="enrollName" required>
            <Input
              id="enrollName"
              placeholder="e.g. Priya Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </FormField>

          <div className="form-row">
            <FormField label="Email Address" htmlFor="enrollEmail" required>
              <Input
                id="enrollEmail"
                type="email"
                placeholder="priya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Mobile Phone Number" htmlFor="enrollPhone" required>
              <Input
                id="enrollPhone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </FormField>
          </div>

          <div className="form-row">
            <FormField label="Highest Qualification" htmlFor="enrollQual" required>
              <Input
                id="enrollQual"
                placeholder="e.g. B.Tech (ECE) / B.Com / Intermediate"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                required
              />
            </FormField>

            <FormField label="District / City" htmlFor="enrollDistrict" required>
              <Input
                id="enrollDistrict"
                placeholder="e.g. Vijayawada, NTR District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <Button variant="secondary" type="button" onClick={() => setEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={isSubmitting} leftIcon={<Send size={16} />}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
