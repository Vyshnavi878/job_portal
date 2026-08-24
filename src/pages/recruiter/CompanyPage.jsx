import { useState } from 'react';
import {
  Building2, Globe, Mail, Phone, MapPin, Users, FileText,
  Edit2, Save, X, ShieldCheck, AlertCircle, UploadCloud, Trash2,
  ExternalLink, Sparkles
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../context/ToastContext';
import { INDUSTRIES, COMPANY_SIZES, LOCATIONS } from '../../data/mockData';

export default function RecruiterCompanyPage() {
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [logo, setLogo] = useState(null); // null means uses fallback avatar

  const [company, setCompany] = useState({
    name: 'TechCorp India Technologies Pvt Ltd',
    tagline: 'Empowering global enterprises through intelligent cloud architecture & AI solutions.',
    description: 'TechCorp India is a premier digital engineering and enterprise cloud consulting firm. With delivery centers in Bengaluru, Hyderabad, and Pune, TechCorp provides cutting-edge digital transformation, DevOps, and cloud migration services to Fortune 500 clients across banking, retail, and healthcare.',
    industry: 'Information Technology',
    size: '1000-5000 employees',
    employeesCount: '3,500+',
    foundedYear: '2012',
    website: 'https://techcorp-india.example.com',
    email: 'careers@techcorp-india.example.com',
    phone: '+91 80 4920 1000',
    location: 'Bengaluru, Karnataka',
    address: 'Level 5, Tower A, Embassy Tech Village, Outer Ring Road, Kadubeesanahalli, Bengaluru 560103',
    cinNumber: 'U72200KA2012PTC064123',
    gstNumber: '29ABCDE1234F1Z5',
    verified: true,
  });

  const [editForm, setEditForm] = useState({ ...company });

  const handleSave = (e) => {
    e.preventDefault();
    setCompany({ ...editForm });
    setIsEditing(false);
    toast({
      type: 'success',
      title: 'Company Profile Updated',
      message: 'Your organization details have been saved successfully.',
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogo(url);
    toast({
      type: 'success',
      title: 'Logo Updated',
      message: 'New company logo uploaded.',
    });
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    toast({
      type: 'info',
      title: 'Logo Removed',
      message: 'Reverted to default monogram logo.',
    });
  };

  return (
    <div className="recruiter-company-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Building2 size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Company Profile & Branding</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Manage your public employer profile, official contact channels, and verification details
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {isEditing ? (
              <>
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="primary" size="sm" leftIcon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button variant="primary" size="sm" leftIcon={<Edit2 size={14} />} onClick={() => { setEditForm({ ...company }); setIsEditing(true); }}>
                Edit Company Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Verification Notice UI ── */}
      <div style={{
        background: 'var(--color-success-50)',
        border: '1px solid var(--color-success-200)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-3)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', background: 'var(--color-success-100)', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success-900)' }}>Verified Employer Account</strong>
              <span className="badge badge-success" style={{ fontSize: '10px' }}>Active & Verified</span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-700)', marginTop: 2 }}>
              CIN: <strong>{company.cinNumber}</strong> • GST: <strong>{company.gstNumber}</strong>
            </p>
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          *Note: Major legal name changes require 24-hr Admin re-verification.
        </div>
      </div>

      {/* ── Logo Management Card ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header">
          <h2 className="card-title">Company Logo & Branding</h2>
        </div>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div style={{
            width: 84,
            height: 84,
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
            color: '#fff',
            fontSize: 'var(--text-3xl)',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            {logo ? <img src={logo} alt="Company logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : company.name[0]}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Upload Official Company Logo</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              PNG, SVG, or JPG format. Square aspect ratio (minimum 400x400px recommended).
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 4 }}>
              <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                <UploadCloud size={14} style={{ marginRight: 4 }} /> Upload New Logo
                <input type="file" accept=".png,.jpg,.jpeg,.svg" style={{ display: 'none' }} onChange={handleLogoUpload} />
              </label>
              {logo && (
                <Button size="sm" variant="secondary" leftIcon={<Trash2 size={14} />} onClick={handleRemoveLogo}>
                  Remove Logo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Company Info Form / View ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header">
          <h2 className="card-title">Corporate Information</h2>
        </div>

        <div className="card-body">
          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-4)' }}>
                <FormField label="Company Name" required>
                  <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                </FormField>
                <FormField label="Website URL" required>
                  <Input value={editForm.website} onChange={(e) => setEditForm({ ...editForm, website: e.target.value })} required />
                </FormField>
              </div>

              <FormField label="Tagline / Headline" required>
                <Input value={editForm.tagline} onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })} required />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                <FormField label="Industry" required>
                  <Select options={INDUSTRIES.filter(i => i !== 'All Industries')} value={editForm.industry} onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })} />
                </FormField>
                <FormField label="Company Size" required>
                  <Select options={COMPANY_SIZES.filter(s => s !== 'All Sizes')} value={editForm.size} onChange={(e) => setEditForm({ ...editForm, size: e.target.value })} />
                </FormField>
                <FormField label="Founded Year">
                  <Input value={editForm.foundedYear} onChange={(e) => setEditForm({ ...editForm, foundedYear: e.target.value })} />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <FormField label="Recruitment Email" required>
                  <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                </FormField>
                <FormField label="Official Phone / Helpline" required>
                  <Input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-4)' }}>
                <FormField label="City / State" required>
                  <Input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} required />
                </FormField>
                <FormField label="Registered Office Address" required>
                  <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} required />
                </FormField>
              </div>

              <FormField label="Company Description & Culture" required>
                <Textarea rows={4} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required />
              </FormField>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                <Button variant="secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="primary" type="submit" leftIcon={<Save size={14} />}>Save Changes</Button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{company.name}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{company.tagline}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Industry</span><strong>{company.industry}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Company Size</span><strong>{company.size} ({company.employeesCount})</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Website</span><a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-600)' }}>{company.website}</a></div>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Recruitment Email</span><strong>{company.email}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Phone</span><strong>{company.phone}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block' }}>Headquarters Location</span><strong>{company.location}</strong></div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block', marginBottom: 2 }}>Registered Office Address</span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{company.address}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block', marginBottom: 2 }}>About Organization</span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>{company.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
