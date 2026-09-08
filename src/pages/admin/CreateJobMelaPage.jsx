import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarDays, MapPin, Clock, Users, Building2,
  UploadCloud, Save, Send, ArrowLeft, CheckCircle2, Image,
  Plus, Trash2, Briefcase, Eye, AlertCircle, Sparkles
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

export default function AdminCreateJobMelaPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { companies, createJobMela } = useAdmin();

  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '2026-11-15',
    startTime: '09:00',
    endTime: '18:00',
    venue: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    regStartDate: '2026-10-01',
    regEndDate: '2026-11-10',
    maxCapacity: '5000',
  });

  // Participating Companies State
  const [participatingCompanies, setParticipatingCompanies] = useState([
    {
      id: 'comp-init-1',
      companyId: companies?.[0]?.id || '',
      company: companies?.[0]?.name || '',
      position: '',
      vacancies: '25',
      salary: '₹18,000 - ₹28,000 / month',
      qualification: 'B.Tech / B.E / Diploma / Any Graduate',
      experience: '0-2 Years',
      location: 'Stall A-01 (Hall 1)',
      notes: 'Direct walk-in technical assessment on spot.'
    }
  ]);

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBannerPreview(url);
    toast({ type: 'success', title: 'Banner Uploaded', message: 'Event header banner uploaded.' });
  };

  const handleAddCompany = () => {
    const nextIdx = participatingCompanies.length + 1;
    const defaultCompany = companies?.[(nextIdx - 1) % (companies?.length || 1)] || null;
    setParticipatingCompanies([
      ...participatingCompanies,
      {
        id: `comp-temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        companyId: defaultCompany?.id || '',
        company: defaultCompany?.name || '',
        position: '',
        vacancies: '15',
        salary: '₹20,000 - ₹35,000 / month',
        qualification: 'B.Tech / MCA / Any Graduate',
        experience: '0-2 Years',
        location: `Stall ${String.fromCharCode(64 + Math.min(nextIdx, 26))}-${nextIdx.toString().padStart(2, '0')}`,
        notes: ''
      }
    ]);
  };

  const handleRemoveCompany = (indexToRemove) => {
    if (participatingCompanies.length <= 1) {
      toast({ type: 'info', title: 'Cannot Remove', message: 'At least one company slot should remain, or clear its fields.' });
      return;
    }
    setParticipatingCompanies(participatingCompanies.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCompanyFieldChange = (index, field, value) => {
    setParticipatingCompanies(prev =>
      prev.map((c, idx) => {
        if (idx !== index) return c;
        if (field === 'companyId') {
          if (value === 'CUSTOM') {
            return { ...c, companyId: '', company: '' };
          }
          const matched = companies.find(comp => comp.id === value);
          return {
            ...c,
            companyId: value,
            company: matched ? matched.name : c.company
          };
        }
        return { ...c, [field]: value };
      })
    );
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      toast({ type: 'error', title: 'Event Name Required', message: 'Please enter an event name before saving draft.' });
      return;
    }

    const cleanCompanies = participatingCompanies
      .filter(c => c.company.trim() || c.position.trim())
      .map((c, idx) => ({
        id: `pmc-${Date.now()}-${idx}`,
        companyId: c.companyId || '',
        company: c.company.trim() || 'Participating Company',
        position: c.position.trim() || 'Various Roles',
        vacancies: Number(c.vacancies) || 10,
        applications: 0,
        salary: c.salary.trim() || 'Best in Industry',
        qualification: c.qualification.trim() || 'Any Degree',
        experience: c.experience.trim() || '0-2 Years',
        location: c.location.trim() || 'On-site Pavilion',
        notes: c.notes.trim() || ''
      }));

    const newMela = createJobMela({
      ...formData,
      banner: bannerPreview,
      status: 'UPCOMING',
      participatingCompanies: cleanCompanies,
      companiesCount: cleanCompanies.length
    });

    toast({
      type: 'info',
      title: 'Draft Saved',
      message: `Job Mela "${formData.title}" saved to drafts with ${cleanCompanies.length} companies.`,
    });
    navigate('/admin/job-melas', { state: { openMelaId: newMela.id } });
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.venue.trim()) {
      toast({ type: 'error', title: 'Incomplete Details', message: 'Please complete all required event logistics fields.' });
      return;
    }

    // Filter valid companies
    const validCompanies = participatingCompanies.filter(c => c.company.trim() && c.position.trim());
    if (validCompanies.length === 0) {
      toast({ type: 'error', title: 'Participating Company Required', message: 'Please add at least one participating company with hiring position/role before publishing.' });
      return;
    }

    // Check for duplicate company + position
    const seen = new Set();
    for (const c of validCompanies) {
      const key = `${c.company.trim().toLowerCase()}__${c.position.trim().toLowerCase()}`;
      if (seen.has(key)) {
        toast({ type: 'error', title: 'Duplicate Company & Role', message: `Duplicate entry found for "${c.company}" with position "${c.position}".` });
        return;
      }
      seen.add(key);
    }

    setLoading(true);
    setTimeout(() => {
      const cleanCompanies = validCompanies.map((c, idx) => ({
        id: `pmc-${Date.now()}-${idx}`,
        companyId: c.companyId || '',
        company: c.company.trim(),
        position: c.position.trim(),
        vacancies: Number(c.vacancies) || 10,
        applications: 0,
        salary: c.salary.trim() || 'Best in Industry',
        qualification: c.qualification.trim() || 'Any Degree',
        experience: c.experience.trim() || '0-2 Years',
        location: c.location.trim() || 'On-site Pavilion',
        notes: c.notes.trim() || 'Direct walk-in screening'
      }));

      const newMela = createJobMela({
        ...formData,
        banner: bannerPreview,
        status: 'APPROVED',
        participatingCompanies: cleanCompanies,
        companiesCount: cleanCompanies.length
      });
      setLoading(false);
      toast({
        type: 'success',
        title: 'Job Mela Published',
        message: `Event "${formData.title}" is now published with ${cleanCompanies.length} participating companies!`,
      });
      navigate('/admin/job-melas', { state: { openMelaId: newMela.id } });
    }, 600);
  };

  return (
    <div className="admin-create-job-mela-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <Link to="/admin/job-melas" style={{ textDecoration: 'none', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)' }}>
                <ArrowLeft size={14} /> Back to Job Melas
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <CalendarDays size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Create Mega Job Fair / Career Expo</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Setup multi-company walk-in hiring events, assign corporate booth quotas, and publish candidate fast-track passes
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="secondary" size="sm" leftIcon={<Save size={14} />} onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Send size={14} />} loading={loading} onClick={handlePublish}>
              Publish Event
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

        {/* ── 1. Event Identification & Description ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header">
            <h2 className="card-title">1. Event Name & Overview</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FormField label="Event Name / Title" required hint="e.g. Mumbai Mega Tech & Banking Job Mela 2026">
              <Input
                placeholder="Enter event title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Detailed Description & Candidate Scope" required>
              <Textarea
                rows={3}
                placeholder="Describe participating industries, expected corporate recruiters, spot interview processes, and candidate eligibility..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </FormField>

            {/* Banner upload */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-2)' }}>
                Event Banner / Header Image
              </label>
              <div style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                textAlign: 'center',
                background: 'var(--color-gray-50)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                {bannerPreview ? (
                  <div style={{ width: '100%', maxHeight: 180, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <img src={bannerPreview} alt="Banner preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <UploadCloud size={36} style={{ color: 'var(--color-primary-600)' }} />
                )}
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', marginTop: 'var(--space-2)' }}>
                  {bannerPreview ? 'Replace Image' : 'Upload Banner Image'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerUpload} />
                </label>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Recommended: 1200x400 JPG, PNG (Max 4MB)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Schedule & Registration Windows ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header">
            <h2 className="card-title">2. Schedule & Timeline</h2>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <FormField label="Event Date" required>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Start Time (IST)" required>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </FormField>

            <FormField label="End Time (IST)" required>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Candidate Registration Start" required>
              <Input
                type="date"
                value={formData.regStartDate}
                onChange={(e) => setFormData({ ...formData, regStartDate: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Candidate Registration Deadline" required>
              <Input
                type="date"
                value={formData.regEndDate}
                onChange={(e) => setFormData({ ...formData, regEndDate: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Maximum Candidate Capacity (Seats)" required>
              <Input
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                required
              />
            </FormField>
          </div>
        </div>

        {/* ── 3. Venue & Logistics ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header">
            <h2 className="card-title">3. Venue & Location Details</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Venue Name / Convention Hall" required>
                <Input
                  placeholder="e.g. Bombay Exhibition Centre (NESCO), Hall 4"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="City" required>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="State" required>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField label="Full Street Address & Landmarks" required>
              <Input
                placeholder="e.g. Western Express Highway, Goregaon East, Mumbai 400063"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </FormField>
          </div>
        </div>

        {/* ── 4. Participating Companies & Job Openings Section ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Building2 size={20} style={{ color: 'var(--color-primary-600)' }} />
                4. Participating Companies & Job Openings
                <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                  {participatingCompanies.length} Added
                </span>
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                Add corporate employers, hiring positions, salary ranges, qualifications, and booth allocations.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={handleAddCompany}
            >
              + Add Company
            </Button>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {participatingCompanies.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  background: 'var(--color-gray-50)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-5)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)'
                }}
              >
                {/* Header of Company Card */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{
                      width: 26,
                      height: 26,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-primary-600)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800
                    }}>
                      {idx + 1}
                    </span>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                      {item.company || `Company #${idx + 1}`}
                    </strong>
                    {item.position && (
                      <span className="badge badge-secondary" style={{ fontSize: '10px' }}>
                        {item.position}
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="xs"
                    variant="danger"
                    leftIcon={<Trash2 size={12} />}
                    onClick={() => handleRemoveCompany(idx)}
                    title="Remove this company"
                  >
                    Remove Company
                  </Button>
                </div>

                {/* Company Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {/* Company / Employer Selector */}
                  <FormField label="Company / Employer" required hint="Select from verified platform companies or enter custom name">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <select
                        value={item.companyId || (companies?.some(c => c.name === item.company) ? companies.find(c => c.name === item.company)?.id : 'CUSTOM')}
                        onChange={(e) => handleCompanyFieldChange(idx, 'companyId', e.target.value)}
                        className="form-control"
                        style={{ height: 38, borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                      >
                        <option value="">-- Select from Registered Companies --</option>
                        {companies?.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.industry || 'Corporate'})</option>
                        ))}
                        <option value="CUSTOM">+ Other / Custom Employer Name</option>
                      </select>

                      <Input
                        placeholder="Or enter company / organization name..."
                        value={item.company}
                        onChange={(e) => handleCompanyFieldChange(idx, 'company', e.target.value)}
                        required
                      />
                    </div>
                  </FormField>

                  {/* Position & Vacancies */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-3)' }}>
                    <FormField label="Job Title / Position" required>
                      <Input
                        placeholder="e.g. Mobile Operator, Graduate Engineer Trainee, Software Dev"
                        value={item.position}
                        onChange={(e) => handleCompanyFieldChange(idx, 'position', e.target.value)}
                        required
                      />
                    </FormField>

                    <FormField label="Number of Vacancies" required>
                      <Input
                        type="number"
                        placeholder="e.g. 25"
                        value={item.vacancies}
                        onChange={(e) => handleCompanyFieldChange(idx, 'vacancies', e.target.value)}
                        required
                      />
                    </FormField>
                  </div>

                  {/* Qualification & Experience */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-3)' }}>
                    <FormField label="Eligibility / Qualification" required>
                      <Input
                        placeholder="e.g. ITI / Diploma / B.E / B.Tech / Any Degree"
                        value={item.qualification}
                        onChange={(e) => handleCompanyFieldChange(idx, 'qualification', e.target.value)}
                        required
                      />
                    </FormField>

                    <FormField label="Experience Required" required>
                      <Input
                        placeholder="e.g. Fresher (0-1 yr), 1-3 Years"
                        value={item.experience}
                        onChange={(e) => handleCompanyFieldChange(idx, 'experience', e.target.value)}
                        required
                      />
                    </FormField>
                  </div>

                  {/* Salary & Stall Allocation */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-3)' }}>
                    <FormField label="Salary / Salary Range" required>
                      <Input
                        placeholder="e.g. ₹18,000 - ₹28,000 / month or ₹4.5 - ₹7 LPA"
                        value={item.salary}
                        onChange={(e) => handleCompanyFieldChange(idx, 'salary', e.target.value)}
                        required
                      />
                    </FormField>

                    <FormField label="Location / Stall Allocation">
                      <Input
                        placeholder="e.g. Stall B-14 (Hall 3)"
                        value={item.location}
                        onChange={(e) => handleCompanyFieldChange(idx, 'location', e.target.value)}
                      />
                    </FormField>
                  </div>

                  {/* Notes */}
                  <FormField label="Additional Notes / Job Description">
                    <Input
                      placeholder="e.g. Carry 3 printed resumes & ID proof. Spot offer letters upon clearing round 2."
                      value={item.notes}
                      onChange={(e) => handleCompanyFieldChange(idx, 'notes', e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={handleAddCompany}
              >
                + Add Another Company
              </Button>
            </div>
          </div>
        </div>

        {/* ── 5. Job Mela Live Preview / Summary ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', border: '2px solid var(--color-primary-100)' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Eye size={18} style={{ color: 'var(--color-primary-600)' }} />
              5. Job Mela Live Preview
            </h2>
            <span className="badge badge-info" style={{ fontSize: '10px' }}>
              Real-time Preview
            </span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Live Event Summary Card */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
              color: '#ffffff',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {formData.title || 'Untitled Mega Job Mela 2026'}
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: '#c7d2fe' }}>
                <span>📅 {formData.date ? new Date(formData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Nov 2026'}</span>
                <span>⏰ {formData.startTime || '09:00'} – {formData.endTime || '18:00'} IST</span>
                <span>📍 {formData.city || 'City'}, {formData.state || 'State'}</span>
                <span>🏢 {formData.venue || 'Venue Convention Hall'}</span>
              </div>
            </div>

            {/* Participating Companies Table Preview */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
                  Participating Companies — {participatingCompanies.filter(c => c.company.trim()).length}
                </h4>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 700 }}>
                  Total Vacancies: {participatingCompanies.reduce((sum, c) => sum + (Number(c.vacancies) || 0), 0)} Positions
                </span>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-border)', textAlign: 'left', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontSize: '10px' }}>
                      <th style={{ padding: '8px 12px' }}>Company</th>
                      <th style={{ padding: '8px 12px' }}>Position</th>
                      <th style={{ padding: '8px 12px' }}>Qualification</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Vacancies</th>
                      <th style={{ padding: '8px 12px' }}>Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participatingCompanies.filter(c => c.company.trim() || c.position.trim()).length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          No participating companies entered yet. Use the section above to add employers.
                        </td>
                      </tr>
                    ) : (
                      participatingCompanies.filter(c => c.company.trim() || c.position.trim()).map((c, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--color-text)' }}>
                            {c.company || 'Unnamed Company'}
                          </td>
                          <td style={{ padding: '8px 12px', color: 'var(--color-primary-700)', fontWeight: 600 }}>
                            {c.position || '—'}
                          </td>
                          <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>
                            {c.qualification || 'Any Degree'}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                            <span className="badge badge-success" style={{ fontSize: '10px' }}>
                              {c.vacancies || 0}
                            </span>
                          </td>
                          <td style={{ padding: '8px 12px', fontWeight: 600 }}>
                            {c.salary || 'Best in Industry'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/admin/job-melas">
              <Button variant="ghost" size="sm">Cancel</Button>
            </Link>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button variant="secondary" type="button" leftIcon={<Save size={14} />} onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button variant="primary" type="submit" leftIcon={<Send size={14} />} loading={loading}>
                Publish Event
              </Button>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
