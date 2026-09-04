import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarDays, MapPin, Clock, Users, Building2,
  UploadCloud, Save, Send, ArrowLeft, CheckCircle2, Image
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
  const { createJobMela } = useAdmin();

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

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBannerPreview(url);
    toast({ type: 'success', title: 'Banner Uploaded', message: 'Event header banner uploaded.' });
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      toast({ type: 'error', title: 'Event Name Required', message: 'Please enter an event name before saving draft.' });
      return;
    }
    createJobMela({ ...formData, status: 'UPCOMING' });
    toast({
      type: 'info',
      title: 'Draft Saved',
      message: `Job Mela "${formData.title}" saved to drafts.`,
    });
    navigate('/admin/job-melas');
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.venue.trim()) {
      toast({ type: 'error', title: 'Incomplete Details', message: 'Please complete all required event logistics fields.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      createJobMela(formData);
      setLoading(false);
      toast({
        type: 'success',
        title: 'Job Mela Published',
        message: `Event "${formData.title}" is now published and open for employer & candidate registrations!`,
      });
      navigate('/admin/job-melas');
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
              Setup nationwide walk-in hiring events, allocate stall quotas, and publish digital entry passes
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
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
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
