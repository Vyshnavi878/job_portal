import { useState, useEffect, useRef } from 'react';
import {
  User, Mail, ShieldCheck, Camera, Trash2, UploadCloud,
  CheckCircle2, AlertCircle, Info, Building2, BadgeCheck,
  Edit2, Save, X, Phone
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';

export default function AdminProfilePage() {
  const { currentAdmin } = useAdmin();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // Local state for profile data
  const [profileData, setProfileData] = useState(() => {
    try {
      const stored = localStorage.getItem('ntr_admin_custom_profile');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return {
      name: currentAdmin?.name || 'Admin User',
      role: currentAdmin?.title || 'Platform Administrator',
      email: currentAdmin?.email || 'admin1@ntrvikasa.com',
      designation: currentAdmin?.designation || 'State Operations Lead',
      phone: '+91 98765 43210',
      department: 'State Employment & Skill Development Authority',
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const [formErrors, setFormErrors] = useState({});

  // Local state for profile avatar
  const [avatarImage, setAvatarImage] = useState(() => {
    try {
      return localStorage.getItem('ntr_admin_custom_avatar') || null;
    } catch (e) {
      return null;
    }
  });

  const [imageError, setImageError] = useState('');

  const adminName = profileData.name;
  const adminRole = profileData.role;
  const adminEmail = profileData.email;
  const adminDesignation = profileData.designation;
  const initialLetter = currentAdmin?.avatar || adminName[0]?.toUpperCase() || 'A';

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, GIF, WEBP).');
      addToast('Invalid file format. Please upload an image file.', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size exceeds 2MB limit. Please choose a smaller file.');
      addToast('Image size should be less than 2MB.', 'error');
      return;
    }

    setImageError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setAvatarImage(result);
      try {
        localStorage.setItem('ntr_admin_custom_avatar', result);
        window.dispatchEvent(new Event('admin_avatar_updated'));
      } catch (err) {
        // Handle localStorage quota or private browsing
      }
      addToast('Profile image preview updated.', 'info');
    };
    reader.readAsDataURL(file);
  };

  // Handle remove photo
  const handleRemoveImage = () => {
    setAvatarImage(null);
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    try {
      localStorage.removeItem('ntr_admin_custom_avatar');
      window.dispatchEvent(new Event('admin_avatar_updated'));
    } catch (err) {
      // Ignore
    }
    addToast('Profile image removed. Displaying default avatar.', 'info');
  };

  const handleStartEdit = () => {
    setFormData(profileData);
    setFormErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(profileData);
    setFormErrors({});
    setIsEditing(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setProfileData(formData);
    try {
      localStorage.setItem('ntr_admin_custom_profile', JSON.stringify(formData));
      window.dispatchEvent(new Event('admin_profile_updated'));
    } catch (err) {
      // Ignore
    }

    setIsEditing(false);
    setFormErrors({});
    addToast('Administrator profile updated successfully.', 'success');
  };

  return (
    <div className="admin-profile-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      {/* ── Page Header ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <User size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0, color: 'var(--color-gray-900)' }}>
              Admin Profile
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
              Personal administrator account details and profile photo management
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 'var(--space-6)' }}>
        {/* ── 1. Profile Information ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-primary-600)' }} />
              <h2 className="card-title">Profile Information</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit2 size={14} />}
                  onClick={handleStartEdit}
                >
                  Edit Profile
                </Button>
              )}
              <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <BadgeCheck size={12} /> Active Administrator
              </span>
            </div>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Identity Summary Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-gray-50)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-gray-200)'
            }}>
              <div
                className="sidebar-user-avatar"
                style={{
                  width: 64,
                  height: 64,
                  fontSize: 'var(--text-xl)',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)',
                  border: '2px solid #fff'
                }}
              >
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt={adminName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  initialLetter
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--color-gray-900)' }}>
                    {adminName}
                  </h3>
                  <span className="badge badge-primary" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    {adminRole}
                  </span>
                </div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {adminDesignation}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Mail size={12} /> {adminEmail}
                </span>
              </div>
            </div>

            {/* Profile Form Fields */}
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <FormField label="Full Name" required={isEditing} error={formErrors.name}>
                  <Input
                    value={isEditing ? formData.name : adminName}
                    disabled={!isEditing}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{ backgroundColor: isEditing ? '#fff' : 'var(--color-gray-50)' }}
                  />
                </FormField>
                <FormField label="Role / Control Level">
                  <Input
                    value={isEditing ? formData.role : adminRole}
                    disabled={!isEditing}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    style={{ backgroundColor: isEditing ? '#fff' : 'var(--color-gray-50)' }}
                  />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <FormField label="Official Email Address" required={isEditing} error={formErrors.email}>
                  <Input
                    value={isEditing ? formData.email : adminEmail}
                    disabled={!isEditing}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    style={{ backgroundColor: isEditing ? '#fff' : 'var(--color-gray-50)' }}
                  />
                </FormField>
                <FormField label="Designation">
                  <Input
                    value={isEditing ? formData.designation : adminDesignation}
                    disabled={!isEditing}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    style={{ backgroundColor: isEditing ? '#fff' : 'var(--color-gray-50)' }}
                  />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <FormField label="Contact Phone">
                  <Input
                    value={isEditing ? formData.phone : profileData.phone}
                    disabled={!isEditing}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ backgroundColor: isEditing ? '#fff' : 'var(--color-gray-50)' }}
                  />
                </FormField>
                <FormField label="Department / Authority">
                  <Input
                    value={isEditing ? formData.department : profileData.department}
                    disabled={!isEditing}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    style={{ backgroundColor: isEditing ? '#fff' : 'var(--color-gray-50)' }}
                  />
                </FormField>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  <Button type="button" variant="outline" size="sm" leftIcon={<X size={14} />} onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" leftIcon={<Save size={14} />}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-primary-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-primary-100)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-primary-800)'
                }}>
                  <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    Click <strong>Edit Profile</strong> to modify your administrator display name, designation, official email, or contact details.
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* ── 2. Change Profile Image ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Camera size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title">Change Profile Image</h2>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', flex: 1 }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Upload or update your administrator avatar image. Changes are previewed immediately across the header and profile menu.
            </p>

            {/* Avatar Preview Canvas */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-gray-50)',
              borderRadius: 'var(--radius-xl)',
              border: '2px dashed var(--color-gray-200)',
              gap: 'var(--space-4)'
            }}>
              <div
                className="sidebar-user-avatar"
                style={{
                  width: 96,
                  height: 96,
                  fontSize: 'var(--text-3xl)',
                  boxShadow: 'var(--shadow-md)',
                  border: '3px solid #fff'
                }}
              >
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  initialLetter
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-800)', margin: 0 }}>
                  {avatarImage ? 'Custom Photo Active' : 'Default Initial Avatar'}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                  {avatarImage ? 'Click Change Photo to replace or Remove Photo to reset' : 'Upload an image to personalize your profile'}
                </p>
              </div>

              {imageError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--color-danger-600)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500
                }}>
                  <AlertCircle size={14} />
                  <span>{imageError}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="admin-profile-photo-input"
              />

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  style={{ flex: 1 }}
                  leftIcon={<UploadCloud size={16} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarImage ? 'Change Photo' : 'Upload Photo'}
                </Button>

                {avatarImage && (
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="md"
                    leftIcon={<Trash2 size={16} />}
                    onClick={handleRemoveImage}
                  >
                    Remove Photo
                  </Button>
                )}
              </div>

              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                PNG, JPG, or WEBP up to 2MB. Stored locally in your session.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
