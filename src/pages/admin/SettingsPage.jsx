import { useState } from 'react';
import {
  Settings, ShieldCheck, Lock, Bell, Server, Database,
  Key, Save, AlertTriangle, RefreshCw, CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import { Toggle } from '../../components/ui/FormControls';
import { useToast } from '../../context/ToastContext';

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const [platformName, setPlatformName] = useState('JobConnect Enterprise Portal');
  const [supportEmail, setSupportEmail] = useState('support@jobconnect.example.com');
  const [grievanceEmail, setGrievanceEmail] = useState('grievance@jobconnect.example.com');

  // Security Policy Toggles
  const [requireRecruiterVerification, setRequireRecruiterVerification] = useState(true);
  const [requireJobModeration, setRequireJobModeration] = useState(true);
  const [enforceZeroCandidateFee, setEnforceZeroCandidateFee] = useState(true);
  const [enableMaintenanceMode, setEnableMaintenanceMode] = useState(false);

  const handleSave = () => {
    toast({
      type: 'success',
      title: 'Settings Saved',
      message: 'System configuration and policy settings updated successfully.',
    });
  };

  return (
    <div className="admin-settings-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Settings size={20} style={{ color: 'var(--color-primary-600)' }} />
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>System & Global Platform Settings</h1>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
          Configure enterprise platform parameters, verification policies, and security guardrails
        </p>
      </div>

      {/* ── 1. General Platform Configuration ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Server size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">General Platform Parameters</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 640 }}>
            <FormField label="Platform Display Name" required>
              <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Primary Support Email" required>
                <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
              </FormField>
              <FormField label="Grievance Redressal Email" required>
                <Input value={grievanceEmail} onChange={(e) => setGrievanceEmail(e.target.value)} />
              </FormField>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Moderation & Compliance Policies ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <ShieldCheck size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">Moderation & Regulatory Policies</h2>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Mandatory Recruiter Legal Verification</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Require Admin COI & GST approval before allowing employers to post vacancies</p>
            </div>
            <Toggle checked={requireRecruiterVerification} onChange={(e) => setRequireRecruiterVerification(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Pre-Publish Job Moderation Queue</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Hold new job and internship postings for administrative wage transparency checks</p>
            </div>
            <Toggle checked={requireJobModeration} onChange={(e) => setRequireJobModeration(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Strict Zero-Fee Candidate Rule Enforcement</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Automatically flag any recruiter mentioning registration fees or security deposits</p>
            </div>
            <Toggle checked={enforceZeroCandidateFee} onChange={(e) => setEnforceZeroCandidateFee(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Maintenance Mode</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Temporarily restrict candidate logins for scheduled database migration</p>
            </div>
            <Toggle checked={enableMaintenanceMode} onChange={(e) => setEnableMaintenanceMode(e.target.checked)} />
          </div>

          <div style={{ marginTop: 'var(--space-2)' }}>
            <Button variant="primary" size="sm" leftIcon={<Save size={14} />} onClick={handleSave}>
              Save System Settings
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
