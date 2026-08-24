import { Link } from 'react-router-dom';
import { FileText, ShieldAlert, CheckCircle2, Scale } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';

export default function TermsPage() {
  return (
    <div className="terms-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-20)' }}>
      {/* Breadcrumb Bar */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Terms of Service' }]} />
        </div>
      </div>

      <div className="container" style={{ maxWidth: 880, paddingTop: 'var(--space-8)' }}>
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)' }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div className="badge badge-primary" style={{ marginBottom: 'var(--space-2)' }}>
              <Scale size={12} style={{ marginRight: 4 }} /> User Agreement & Terms
            </div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>Terms of Service</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
              Effective Date: August 24, 2026 • Governed by the Laws of the Republic of India
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                1. Acceptance of Terms
              </h2>
              <p style={{ color: 'var(--color-text-muted)' }}>
                By accessing, registering, or utilizing the NTR VIKASA Job Portal portal, mobile interfaces, and Job Mela events, you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, you must discontinue platform use immediately.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                2. Zero-Fee Policy for Job Seekers (Strict Rule)
              </h2>
              <div style={{ background: 'var(--color-success-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-success-200)', marginBottom: 'var(--space-2)' }}>
                <p style={{ fontWeight: 700, color: 'var(--color-success-800)' }}>
                  NTR VIKASA Job Portal is 100% Free for Candidates:
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-700)', marginTop: 2 }}>
                  Under no circumstance may any recruiter or hiring company demand processing fees, test charges, uniform deposits, or interview fees from candidates. Violation results in immediate employer account termination, forfeiture of fees, and legal blacklisting.
                </p>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                3. Candidate Obligations & Representations
              </h2>
              <ul style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', color: 'var(--color-text-muted)' }}>
                <li>Candidates agree to provide truthful, authentic information regarding academic degrees, employment history, and skills.</li>
                <li>Impersonating another person or submitting forged documents constitutes grounds for permanent disqualification.</li>
                <li>Candidates attending Job Melas must adhere to venue guidelines, safety codes, and decorum.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                4. Recruiter & Employer Responsibilities
              </h2>
              <ul style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', color: 'var(--color-text-muted)' }}>
                <li>Recruiters must represent a legitimate registered business entity with valid CIN/GST documentation.</li>
                <li>All posted job listings must represent genuine, active employment vacancies with accurate salary and location descriptions.</li>
                <li>Recruiters agree not to discriminate based on gender, caste, religion, or disability for roles where such factors are non-essential.</li>
                <li>Recruiter accounts remain subject to manual Admin approval before publishing access is granted.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                5. Prohibited Activities
              </h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                The following actions are strictly prohibited on NTR VIKASA Job Portal:
              </p>
              <ul style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', color: 'var(--color-text-muted)' }}>
                <li>Posting multi-level marketing (MLM), pyramid schemes, or pay-to-work schemes.</li>
                <li>Scraping candidate resumes or company details using automated crawlers without written authorization.</li>
                <li>Posting misleading, obscene, harassing, or defamatory listings.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                6. Limitation of Liability & Dispute Resolution
              </h2>
              <p style={{ color: 'var(--color-text-muted)' }}>
                NTR VIKASA Job Portal functions as an intermediary platform connecting candidates with hiring employers. While we rigorously verify employers, the final employment contract is directly between the employer and the candidate. Any legal disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts in <strong>Bengaluru, Karnataka, India</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
