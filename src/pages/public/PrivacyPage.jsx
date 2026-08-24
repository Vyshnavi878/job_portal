import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';

export default function PrivacyPage() {
  return (
    <div className="privacy-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-20)' }}>
      {/* Top Breadcrumb Header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
        </div>
      </div>

      <div className="container" style={{ maxWidth: 880, paddingTop: 'var(--space-8)' }}>
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)' }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div className="badge badge-primary" style={{ marginBottom: 'var(--space-2)' }}>
              <ShieldCheck size={12} style={{ marginRight: 4 }} /> Data Protection & Trust
            </div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>Privacy Policy</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
              Last Updated: August 24, 2026 • Compliant with the Digital Personal Data Protection (DPDP) Act, 2023
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
                1. Information We Collect
              </h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                NTR VIKASA Job Portal collects information necessary to provide career discovery, resume parsing, job application forwarding, and Job Mela event admission:
              </p>
              <ul style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', color: 'var(--color-text-muted)' }}>
                <li><strong>Candidate Data:</strong> Name, email address, phone number, location, educational qualifications, work experience, uploaded resumes, and applied job preferences.</li>
                <li><strong>Recruiter & Company Data:</strong> Recruiter name, corporate email, phone, corporate designation, Company Identification Number (CIN), GST documents, company address, and posted job descriptions.</li>
                <li><strong>Usage & Event Data:</strong> Job Mela registration tokens, attendance timestamps, application status milestones, and platform telemetry for performance optimization.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
                2. How We Use Your Personal Data
              </h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Your data is strictly utilized for authorized career facilitation purposes:
              </p>
              <ul style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', color: 'var(--color-text-muted)' }}>
                <li>Transmitting your job and internship applications directly to verified recruiting employers.</li>
                <li>Generating digital QR entry badges for Job Melas and Career Expo venues.</li>
                <li>Providing real-time notifications on application status changes (Shortlisted, Interview, Offer).</li>
                <li>Detecting and preventing recruitment fraud, identity impersonation, and fraudulent listings.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
                3. Resume & Personal Data Sharing Policy
              </h2>
              <p style={{ color: 'var(--color-text-muted)' }}>
                We <strong>NEVER sell or rent</strong> your personal phone numbers, emails, or resumes to unauthorized third-party telemarketers or external ad networks. Your profile and resume are shared <em>only with employers to whom you explicitly submit an application</em> or recruiters participating in a Job Mela you registered for.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
                4. Data Security & Storage Standards
              </h2>
              <p style={{ color: 'var(--color-text-muted)' }}>
                All sensitive user communications and resume storage are secured using 256-bit TLS encryption in transit and AES-256 encryption at rest within secure ISO 27001-certified data centers in India.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
                5. Your Rights as a Data Principal
              </h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Under applicable Indian data protection laws, you retain the right to:
              </p>
              <ul style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', color: 'var(--color-text-muted)' }}>
                <li>Access, review, or export a complete copy of your submitted profile data.</li>
                <li>Request permanent deletion of your candidate account and uploaded resumes at any time.</li>
                <li>Withdraw consent for optional communication newsletters or marketing alerts.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
                6. Grievance Officer Contact
              </h2>
              <p style={{ color: 'var(--color-text-muted)' }}>
                In accordance with the Information Technology Act and DPDP Rules, for privacy inquiries or grievance redressal, please contact our designated Grievance Officer:
              </p>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginTop: 'var(--space-2)' }}>
                <p><strong>Grievance Officer:</strong> Mr. Vikram K. Singhania</p>
                <p><strong>Email:</strong> <a href="mailto:privacy-grievance@jobconnect.example.com" style={{ color: 'var(--color-primary-600)' }}>privacy-grievance@jobconnect.example.com</a></p>
                <p><strong>Address:</strong> NTR VIKASA Job Portal Legal Cell, Level 4, Prestige Tech Park, Bengaluru, Karnataka 560103</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
