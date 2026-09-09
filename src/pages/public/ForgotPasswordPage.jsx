import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import OtpVerificationView, { maskEmail } from '../../components/ui/OtpVerificationView';
import { useToast } from '../../context/ToastContext';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Workflow steps: 'EMAIL' -> 'OTP' -> 'NEW_PASSWORD' -> 'SUCCESS'
  const [step, setStep] = useState('EMAIL');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP to Email
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast({
        type: 'error',
        title: 'Valid Email Required',
        message: 'Please enter a valid registered email address.',
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
      toast({
        type: 'info',
        title: 'Verification Code Sent',
        message: `A verification OTP has been sent to ${maskEmail(email)}. (Demo code: 123456)`,
      });
    }, 500);
  };

  // Step 2: OTP Verified Callback
  const handleOtpVerified = () => {
    setStep('NEW_PASSWORD');
    toast({
      type: 'success',
      title: 'Email Verified',
      message: 'Please create and confirm your new password.',
    });
  };

  // Step 3: Change Password Submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!newPassword) {
      setPasswordError('Please enter your new password.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
      toast({
        type: 'success',
        title: 'Password Changed Successfully',
        message: 'Your password has been updated. Please sign in with your new credentials.',
      });
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: 'var(--space-6)' }}>
      <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
        
        {/* Logo */}
        <Link to="/" className="logo" style={{ justifyContent: 'center', display: 'inline-flex', marginBottom: 'var(--space-6)', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo_image.png" alt="NTR Vikasa Logo" style={{ height: '48px', objectFit: 'contain' }} />
        </Link>

        {/* ── STEP 1: Enter Email ── */}
        {step === 'EMAIL' && (
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-md)' }}>
            <div className="card-body" style={{ padding: 'var(--space-8)' }}>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
                  Reset Your Password
                </h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  Enter your registered email address.
                </p>
              </div>

              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', textAlign: 'left' }}>
                <FormField label="Email Address" htmlFor="email" required>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={16} />}
                    required
                  />
                </FormField>

                <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: 'var(--space-2)' }}>
                  Send OTP
                </Button>
              </form>
            </div>

            <div className="card-footer" style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-8)' }}>
              <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* ── STEP 2: OTP Verification ── */}
        {step === 'OTP' && (
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-md)' }}>
            <div className="card-body" style={{ padding: 'var(--space-8)' }}>
              <OtpVerificationView
                email={email}
                flowId="forgot_pwd"
                title="Verify Your Email"
                subtitle="We've sent a verification code to your registered email."
                onVerified={handleOtpVerified}
                onChangeEmail={() => setStep('EMAIL')}
                isCardLayout={true}
              />
            </div>

            <div className="card-footer" style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-8)' }}>
              <button
                type="button"
                onClick={() => setStep('EMAIL')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} /> Back to Email
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Create New Password ── */}
        {step === 'NEW_PASSWORD' && (
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-md)' }}>
            <div className="card-body" style={{ padding: 'var(--space-8)' }}>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-50)',
                  color: 'var(--color-primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-3)'
                }}>
                  <KeyRound size={26} />
                </div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>
                  Create New Password
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  Enter and confirm your new secure password.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', textAlign: 'left' }}>
                <FormField label="New Password*" htmlFor="newPassword" hint="Min 8 characters" required>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                    leftIcon={<Lock size={16} />}
                    required
                  />
                </FormField>

                <FormField label="Confirm New Password*" htmlFor="confirmPassword" required>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                    leftIcon={<Lock size={16} />}
                    required
                  />
                </FormField>

                {passwordError && (
                  <p className="form-error" role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger-600)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={13} />
                    <span>{passwordError}</span>
                  </p>
                )}

                <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: 'var(--space-2)' }}>
                  Change Password
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ── STEP 4: Password Changed Successfully ── */}
        {step === 'SUCCESS' && (
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-md)' }}>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-8)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)', background: 'var(--color-success-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-600)' }}>
                <CheckCircle2 size={36} />
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Password Changed Successfully</h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                Your password has been updated. Please sign in with your new password.
              </p>
              <Link to="/login" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                <Button variant="primary" fullWidth rightIcon={<ArrowRight size={16} />}>
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
