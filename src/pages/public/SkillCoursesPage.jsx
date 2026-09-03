import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Award, CheckCircle2, Clock, MapPin,
  Users, ArrowRight, Sparkles, Search, Filter, Phone, Mail, Send,
  X, Laptop, ShieldCheck, HelpCircle, ChevronRight, Check
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useToast } from '../../context/ToastContext';
import { SKILL_COURSES, SKILL_CATEGORIES } from '../../data/skillData';

export default function SkillCoursesPage() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSector = searchParams.get('sector') || 'All Sectors';
  const initialQuery = searchParams.get('q') || '';

  const [search, setSearch] = useState(initialQuery);
  const [selectedSector, setSelectedSector] = useState(initialSector);
  const [selectedMode, setSelectedMode] = useState('All Modes');

  // Modals state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [district, setDistrict] = useState('');
  const [preferredMode, setPreferredMode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if search params change
  useEffect(() => {
    const s = searchParams.get('sector');
    if (s) setSelectedSector(s);
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const sectors = [
    'All Sectors',
    'Information Technology',
    'Data & AI',
    'AI & Productivity Tools',
    'Banking & Finance',
    'Office & Accounting',
    'Core Engineering',
    'Healthcare',
    'Marketing & Sales'
  ];

  const modes = ['All Modes', 'Hybrid (Classroom + Labs)', 'Online Live Interactive', 'Classroom Training', 'Hands-on Workshop', 'Classroom + Hospital Internship'];

  const filteredCourses = useMemo(() => {
    return SKILL_COURSES.filter((course) => {
      // Sector filter
      if (selectedSector !== 'All Sectors' && course.sector !== selectedSector) {
        return false;
      }
      // Mode filter
      if (selectedMode !== 'All Modes' && !course.mode.toLowerCase().includes(selectedMode.toLowerCase().split(' ')[0])) {
        return false;
      }
      // Text search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchDesc = course.description.toLowerCase().includes(q);
        const matchSector = course.sector.toLowerCase().includes(q);
        const matchSkills = course.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSector && !matchSkills) {
          return false;
        }
      }
      return true;
    });
  }, [selectedSector, selectedMode, search]);

  const handleOpenDetails = (course) => {
    setSelectedCourse(course);
    setDetailsModalOpen(true);
  };

  const handleOpenEnroll = (course = null) => {
    if (course) {
      setSelectedCourse(course);
      setPreferredMode(course.mode);
    } else if (SKILL_COURSES.length > 0 && !selectedCourse) {
      setSelectedCourse(SKILL_COURSES[0]);
    }
    setDetailsModalOpen(false);
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
        title: 'Enrollment Application Submitted!',
        message: `Thank you, ${fullName}. Our skill development counselor will contact you at ${phone} regarding ${selectedCourse?.title}.`,
      });
      setFullName('');
      setEmail('');
      setPhone('');
      setQualification('');
      setDistrict('');
      setPreferredMode('');
    }, 1000);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedSector('All Sectors');
    setSelectedMode('All Modes');
    setSearchParams({});
  };

  return (
    <div className="skill-courses-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-20)' }}>
      {/* ── 1. Compact Course Discovery Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        color: '#ffffff',
        padding: 'var(--space-12) var(--space-6)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: 860, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 16px',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            marginBottom: 'var(--space-4)',
            color: '#e0e7ff'
          }}>
            <Sparkles size={13} style={{ color: '#fbbf24' }} />
            Skill Development • Course Catalog & Online Enrollment
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 'var(--space-3)',
            color: '#ffffff'
          }}>
            Find the Right Course for Your Career
          </h1>

          <p style={{
            fontSize: 'var(--text-base)',
            color: '#cbd5e1',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: 680,
            margin: '0 auto var(--space-6)'
          }}>
            Explore industry-relevant courses designed to build practical skills and improve employment opportunities.
          </p>

          {/* Prominent Search Bar */}
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div className="input-wrapper" style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-2xl)',
              padding: '4px 6px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ padding: '0 12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                <Search size={20} />
              </span>
              <input
                type="text"
                className="input"
                placeholder="Search courses by name, technology, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  fontSize: 'var(--text-base)',
                  padding: '10px 4px',
                  color: 'var(--color-text)',
                  flex: 1
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', padding: '0 8px', cursor: 'pointer' }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Course Filters Section ── */}
      <section className="container" style={{ paddingTop: 'var(--space-8)' }}>
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
          boxShadow: 'var(--shadow-xs)'
        }}>
          {/* Sector Category Pills */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-2)'
            }}>
              Sector Category:
            </p>
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

          {/* Results meta and active filters indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            borderTop: '1px solid var(--color-gray-100)',
            paddingTop: 'var(--space-4)'
          }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Showing <strong style={{ color: 'var(--color-text)' }}>{filteredCourses.length}</strong> verified courses
              {selectedSector !== 'All Sectors' && ` in ${selectedSector}`}
              {search && ` matching "${search}"`}
            </p>

            {(selectedSector !== 'All Sectors' || search || selectedMode !== 'All Modes') && (
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-600)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <X size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ── 3. Course Cards Grid ── */}
        {filteredCourses.length === 0 ? (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-16) var(--space-6)',
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto'
          }}>
            <Search size={40} style={{ color: 'var(--color-text-muted)', margin: '0 auto var(--space-4)', opacity: 0.5 }} />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>No courses found</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
              We couldn't find any courses matching your search criteria. Try selecting another sector or clearing your search.
            </p>
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Reset All Filters
            </Button>
          </div>
        ) : (
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
                  padding: 'var(--space-6)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <Badge variant="primary">{course.sector}</Badge>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--color-success-700)',
                      fontWeight: 700,
                      background: 'var(--color-success-50)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      {course.seats} Seats / Free
                    </span>
                  </div>

                  <h2 style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 800,
                    marginBottom: 'var(--space-2)',
                    color: 'var(--color-text)',
                    lineHeight: 1.3
                  }}>
                    {course.title}
                  </h2>

                  <p style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                    lineHeight: 'var(--leading-relaxed)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    {course.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-4)',
                    borderTop: '1px solid var(--color-gray-100)',
                    paddingTop: 'var(--space-3)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                      <strong>Duration:</strong> {course.duration}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Laptop size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                      <strong>Mode:</strong> {course.mode}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                      <strong>Location:</strong> {course.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <GraduationCap size={13} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                      <strong>Eligibility:</strong> {course.eligibility}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
                    {course.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontSize: '10px',
                          background: 'var(--color-gray-100)',
                          color: 'var(--color-text)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 600
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid var(--color-gray-100)',
                  paddingTop: 'var(--space-4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenDetails(course)}
                    style={{ fontSize: 'var(--text-xs)', padding: '6px 10px' }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenEnroll(course)}
                    style={{ fontSize: 'var(--text-xs)', padding: '6px 14px', fontWeight: 700 }}
                  >
                    Apply / Enroll
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 4. Bottom Enrollment CTA ── */}
      <section className="container" style={{ paddingTop: 'var(--space-16)' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-900))',
          borderRadius: 'var(--radius-3xl)',
          padding: 'var(--space-12) var(--space-8)',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: 'var(--space-3)', color: '#ffffff' }}>
            Start Your Learning Journey
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: 'var(--text-base)', maxWidth: 640, margin: '0 auto var(--space-8)' }}>
            Choose a course, build practical skills, and take the next step toward your career.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleOpenEnroll(null)}
            style={{ background: '#ffffff', color: 'var(--color-primary-900)', fontWeight: 800, padding: '12px 28px' }}
          >
            Apply / Enroll Now
          </Button>
        </div>
      </section>

      {/* ── Course Details Modal ── */}
      <Modal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={selectedCourse?.title || 'Course Details'}
        size="lg"
      >
        {selectedCourse && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant="primary">{selectedCourse.sector}</Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-700)', fontWeight: 700, background: 'var(--color-success-50)', padding: '2px 8px', borderRadius: 'var(--radius-md)' }}>
                {selectedCourse.seats} Seats Available
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-700)', fontWeight: 700, background: 'var(--color-primary-50)', padding: '2px 8px', borderRadius: 'var(--radius-md)' }}>
                {selectedCourse.fee}
              </span>
            </div>

            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-1)', color: 'var(--color-text)' }}>
                Course Overview
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                {selectedCourse.description}
              </p>
            </div>

            {selectedCourse.whatYouWillLearn && (
              <div style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)'
              }}>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary-700)', marginBottom: 'var(--space-3)' }}>
                  What You Will Learn & Hands-on Practicals
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {selectedCourse.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
                      <Check size={14} style={{ color: 'var(--color-success-600)', flexShrink: 0, marginTop: 2 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-3)',
              fontSize: 'var(--text-xs)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)'
            }}>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Duration:</p>
                <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>{selectedCourse.duration}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Training Mode:</p>
                <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>{selectedCourse.mode}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Location:</p>
                <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>{selectedCourse.location}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Eligibility:</p>
                <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>{selectedCourse.eligibility}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Certification:</p>
                <p style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>{selectedCourse.certification}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Placement Support:</p>
                <p style={{ fontWeight: 700, color: 'var(--color-success-700)' }}>100% Job Mela Fast-Track</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button variant="secondary" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => handleOpenEnroll(selectedCourse)} rightIcon={<ArrowRight size={16} />}>
                Apply / Enroll in this Course
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Enrollment Inquiry Modal ── */}
      <Modal
        open={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title={`Enroll in: ${selectedCourse?.title || 'Skill Development Program'}`}
        size="md"
      >
        <form onSubmit={handleEnrollSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Submit your details to receive syllabus documentation, batch schedule confirmation, and center counseling support.
          </p>

          <FormField label="Selected Course" htmlFor="enrollCourse">
            <Select
              id="enrollCourse"
              value={selectedCourse?.id || ''}
              onChange={(e) => {
                const found = SKILL_COURSES.find(c => c.id === e.target.value);
                if (found) setSelectedCourse(found);
              }}
              options={SKILL_COURSES.map(c => ({ value: c.id, label: `${c.title} (${c.sector})` }))}
            />
          </FormField>

          <FormField label="Full Name" htmlFor="enrollFullName" required>
            <Input
              id="enrollFullName"
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
