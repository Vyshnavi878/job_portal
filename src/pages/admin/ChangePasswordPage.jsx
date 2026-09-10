import { useState } from 'react';
import {
  Lock, Key, ShieldCheck, AlertCircle, Info, CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';

export default function AdminChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form error messages
  const [errors, setErrors] = useState({});
  const [submittedMessage, setSubmittedMessage] = useState('');

  const validateForm = () => {
    const errs = {};

    if (!currentPassword.trim()) {
      errs.currentPassword = 'Current password is required.';
    }

    if (!newPassword.trim()) {
      errs.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      errs.newPassword = 'New password must be at least 8 characters long.';
    }

    if (!confirmPassword.trim()) {
      errs.confirmPassword = 'Confirm new password is required.';
    } else if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errs.confirmPassword = 'New Password and Confirm New Password do not match.';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedMessage('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear validation errors
    setErrors({});

    // Frontend validation succeeded. Since backend is not designed yet,
    // show a clean info notice that the UI is prepared for future backend integration
    // without displaying a fake "Password changed successfully" message.
    setSubmittedMessage('Frontend validation passed. The password change form is prepared for future backend API integration.');
  };

  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    setSubmittedMessage('');
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="admin-change-password-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
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
            <Lock size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0, color: 'var(--color-gray-900)' }}>
              Change Password
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
              Update your administrator account password to maintain system security
            </p>
          </div>
        </div>
      </div>

      <div className="admin-password-grid">
        {/* ── Password Change Form ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Key size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title">Password Credentials</h2>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 540, width: '100%', boxSizing: 'border-box' }}>
              {submittedMessage && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-primary-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-primary-200)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-primary-800)'
                }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{submittedMessage}</span>
                </div>
              )}

              {/* Current Password */}
              <FormField
                label="Current Password"
                required
                error={errors.currentPassword}
              >
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={handleInputChange(setCurrentPassword, 'currentPassword')}
                  error={!!errors.currentPassword}
                />
              </FormField>

              {/* New Password */}
              <FormField
                label="New Password"
                required
                hint="Minimum 8 characters containing letters and numbers"
                error={errors.newPassword}
              >
                <Input
                  type="password"
                  placeholder="Enter a strong new password"
                  value={newPassword}
                  onChange={handleInputChange(setNewPassword, 'newPassword')}
                  error={!!errors.newPassword}
                />
              </FormField>

              {/* Confirm New Password */}
              <FormField
                label="Confirm New Password"
                required
                error={errors.confirmPassword}
              >
                <Input
                  type="password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword, 'confirmPassword')}
                  error={!!errors.confirmPassword}
                />
              </FormField>

              <div style={{ paddingTop: 'var(--space-2)' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Key size={16} />}
                  className="admin-change-password-btn"
                >
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Security Guidelines / Requirements ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', alignSelf: 'start', width: '100%', boxSizing: 'border-box' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ShieldCheck size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 className="card-title">Password Security Policy</h2>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              To ensure state governance compliance and prevent unauthorized access, ensure your password meets the following criteria:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <CheckCircle2 size={14} style={{ color: newPassword.length >= 8 ? 'var(--color-success-600)' : 'var(--color-gray-400)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: newPassword.length >= 8 ? 'var(--color-gray-800)' : 'var(--color-gray-600)' }}>
                  At least 8 characters in length
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <CheckCircle2 size={14} style={{ color: /[0-9]/.test(newPassword) ? 'var(--color-success-600)' : 'var(--color-gray-400)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: /[0-9]/.test(newPassword) ? 'var(--color-gray-800)' : 'var(--color-gray-600)' }}>
                  Includes at least one numeric digit (0-9)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <CheckCircle2 size={14} style={{ color: (confirmPassword && newPassword === confirmPassword) ? 'var(--color-success-600)' : 'var(--color-gray-400)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: (confirmPassword && newPassword === confirmPassword) ? 'var(--color-gray-800)' : 'var(--color-gray-600)' }}>
                  Confirm password matches new password exactly
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-gray-50)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-gray-200)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-600)',
              marginTop: 'var(--space-2)'
            }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: 1, color: 'var(--color-primary-600)' }} />
              <span>
                Administrative session activity and password updates are logged in the audit registry for compliance monitoring.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
