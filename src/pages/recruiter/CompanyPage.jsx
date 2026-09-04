import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Globe, Mail, Phone, MapPin, Users, FileText,
  Edit2, Save, X, ShieldCheck, AlertCircle, UploadCloud, Trash2,
  ExternalLink, Sparkles, Briefcase, GraduationCap
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { StatusBadge } from '../../components/ui/Badge';
import { useRecruiter } from '../../context/RecruiterContext';
import { useToast } from '../../context/ToastContext';

export default function RecruiterCompanyPage() {
  const { recruiter, updateCompanyProfile } = useRecruiter();
  const { addToast } = useToast();

  const company = recruiter?.company || {
    name: 'ABC Technologies Pvt Ltd',
    tagline: 'Leading enterprise cloud modernization, DevOps & digital transformation engineering.',
    description: 'ABC Technologies is a premier enterprise IT software solutions provider.',
    industry: 'Information Technology',
    size: '1000-5000 employees',
    employeesCount: '2,400+',
    foundedYear: '2015',
    website: 'https://abctechnologies.example.com',
    email: 'careers@abctechnologies.example.com',
    phone: '+91 80 4920 1000',
    location: 'Bengaluru, Karnataka',
    address: 'Block B, RMZ Ecospace, Outer Ring Road, Bellandur, Bengaluru 560103',
    cinNumber: 'U72200KA2015PTC078912',
    gstNumber: '29ABCDE1234F1Z5',
    verified: true,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...company });

  const activeJobs = recruiter?.jobs?.filter(j => j.status === 'PUBLISHED') || [];
  const internships = recruiter?.internships || [];

  const handleSave = (e) => {
    e.preventDefault();
    updateCompanyProfile(editForm);
    setIsEditing(false);
    addToast('Company Profile updated successfully.', 'success');
  };

  return (
    <div className="portal-page">
      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Building2 size={22} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Company Profile & Verification</h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)', margin: 0 }}>
              Manage public brand details, verified registration data, and hiring postings for {company.name}.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button variant="primary" size="sm" icon={<Edit2 size={14} />} onClick={() => { setEditForm({ ...company }); setIsEditing(true); }}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Company Identity & Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Company Identity & Verification Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--color-primary-600), #7c3aed)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800
            }}>
              {company.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-gray-900)' }}>
                  {company.name}
                </h2>
                {company.verified && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: '#ecfdf5',
                    color: '#059669',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '12px',
                    border: '1px solid #a7f3d0'
                  }}>
                    <ShieldCheck size={14} /> Verified Employer
                  </span>
                )}
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-gray-600)' }}>
                {company.industry} • Founded {company.foundedYear}
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {company.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-gray-200)', fontSize: '0.825rem' }}>
            <div>
              <span style={{ color: 'var(--color-gray-500)', display: 'block' }}>Company Size</span>
              <strong>{company.size} ({company.employeesCount})</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-gray-500)', display: 'block' }}>Location</span>
              <strong>{company.location}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-gray-500)', display: 'block' }}>Corporate CIN</span>
              <strong style={{ fontFamily: 'monospace' }}>{company.cinNumber}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-gray-500)', display: 'block' }}>GST Number</span>
              <strong style={{ fontFamily: 'monospace' }}>{company.gstNumber}</strong>
            </div>
          </div>
        </div>

        {/* Official Channels & Contact Card */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--color-gray-900)' }}>
              Official Channels & Verification Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gray-700)' }}>
                <Globe size={18} color="var(--color-primary-600)" style={{ flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Official Website</span>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 600 }}>
                    {company.website}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gray-700)' }}>
                <Mail size={18} color="var(--color-primary-600)" style={{ flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Careers Email</span>
                  <span style={{ fontWeight: 600 }}>{company.email}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gray-700)' }}>
                <Phone size={18} color="var(--color-primary-600)" style={{ flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Contact Phone</span>
                  <span style={{ fontWeight: 600 }}>{company.phone}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--color-gray-700)' }}>
                <MapPin size={18} color="var(--color-primary-600)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Registered Office Address</span>
                  <span style={{ fontWeight: 500 }}>{company.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            background: 'var(--color-primary-50)',
            borderRadius: '8px',
            border: '1px solid var(--color-primary-100)',
            fontSize: '0.8rem',
            color: 'var(--color-primary-900)'
          }}>
            ✓ Enterprise verified profile with NTR Vikasa Skill & Placement Mission.
          </div>
        </div>
      </div>

      {/* Edit Form Modal/Drawer when isEditing is true */}
      {isEditing && (
        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-2xl)', border: '2px solid var(--color-primary-400)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-gray-900)' }}>
            Edit Company Details
          </h2>

          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <FormField label="Company Legal Name *" required>
              <Input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Industry / Sector *" required>
              <Input
                type="text"
                value={editForm.industry}
                onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Tagline">
              <Input
                type="text"
                value={editForm.tagline}
                onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
              />
            </FormField>

            <FormField label="Official Website">
              <Input
                type="url"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
              />
            </FormField>

            <FormField label="Official Careers Email">
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </FormField>

            <FormField label="Contact Phone">
              <Input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </FormField>

            <FormField label="Company Size">
              <Input
                type="text"
                value={editForm.size}
                onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
              />
            </FormField>

            <FormField label="Registered Office Address" style={{ gridColumn: '1 / -1' }}>
              <Input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </FormField>

            <FormField label="About Company (Overview)" style={{ gridColumn: '1 / -1' }}>
              <Textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </FormField>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon={<Save size={16} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
