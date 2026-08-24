import { useState } from 'react';
import {
  Mail, Phone, MapPin, Clock, Send, MessageSquare,
  HelpCircle, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../context/ToastContext';

const FAQS = [
  {
    q: 'Are job applications completely free for job seekers?',
    a: 'Yes, 100%. JobConnect is completely free for all job seekers. We strictly prohibit any employer or agency from asking for money, registration charges, or training fees for job applications or interview slots.'
  },
  {
    q: 'How do I participate in upcoming Job Melas?',
    a: 'Simply browse the Job Mela section, choose an event in your city or region, and click "Register for Free Entry". You will receive a digital Fast-Track QR pass in your candidate portal. Print and bring your resume copies to the venue on the event date.'
  },
  {
    q: 'How long does employer recruiter account verification take?',
    a: 'Recruiter verification takes between 24 to 48 business hours. Our compliance team verifies your corporate CIN/GST and official identification documents to ensure high platform integrity.'
  },
  {
    q: 'Can I track the status of my submitted applications?',
    a: 'Yes. Once logged into your Candidate Dashboard, navigate to "My Applications". You will see real-time updates for each submission across our 20 visual status badges (Applied, Under Review, Shortlisted, Interview, Selected, etc.).'
  },
  {
    q: 'How can our company sponsor or participate in an upcoming Job Mela?',
    a: 'Registered recruiters can apply directly from the Recruiter Portal under "Job Mela" or contact our Employer Relations team at employers@jobconnect.example.com.'
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Candidate Support',
    subject: '',
    message: '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        type: 'success',
        title: 'Message Sent Successfully',
        message: 'Thank you for reaching out! Our support team will reply within 24 hours.',
      });
      setForm({ name: '', email: '', phone: '', category: 'General Candidate Support', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="contact-page" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 'var(--space-20)' }}>
      {/* ── Top Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        color: '#ffffff',
        padding: 'var(--space-16) var(--space-6)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.15)', color: '#c7d2fe', marginBottom: 'var(--space-3)' }}>
            <MessageSquare size={12} style={{ marginRight: 4 }} /> Help Desk & Support
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: 'var(--space-3)', color: '#ffffff' }}>
            We're Here to Help You
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: '#cbd5e1', lineHeight: 'var(--leading-relaxed)' }}>
            Have questions regarding job listings, recruiter account approval, or Job Mela registrations? Send us a message or reach our helpline.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--space-12)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>

          {/* ── Left Column: Contact Form ── */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              Send Us a Message
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
              Fill out the form below and our dedicated support specialist will respond via email.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <FormField label="Full Name" htmlFor="name" required>
                  <Input
                    id="name"
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </FormField>

                <FormField label="Email Address" htmlFor="email" required>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set('email')}
                    required
                  />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <FormField label="Mobile Number" htmlFor="phone">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={set('phone')}
                  />
                </FormField>

                <FormField label="Inquiry Category" htmlFor="category" required>
                  <select
                    id="category"
                    className="select"
                    value={form.category}
                    onChange={set('category')}
                  >
                    <option>General Candidate Support</option>
                    <option>Recruiter Verification & Onboarding</option>
                    <option>Job Mela Event Registration</option>
                    <option>Report Fraudulent Posting</option>
                    <option>Partnership & Sponsorship</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Subject" htmlFor="subject" required>
                <Input
                  id="subject"
                  placeholder="Brief summary of your question"
                  value={form.subject}
                  onChange={set('subject')}
                  required
                />
              </FormField>

              <FormField label="Message Details" htmlFor="message" required>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Please describe your query in detail..."
                  value={form.message}
                  onChange={set('message')}
                  required
                />
              </FormField>

              <Button type="submit" variant="primary" size="lg" loading={loading} leftIcon={<Send size={16} />}>
                Submit Inquiry
              </Button>
            </form>
          </div>

          {/* ── Right Column: Direct Contact Info & Hours ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Contact Channels */}
            <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                Direct Contact Channels
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Email Support</p>
                    <a href="mailto:support@jobconnect.example.com" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary-600)', textDecoration: 'none' }}>
                      support@jobconnect.example.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--color-success-50)', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Toll-Free Helpline (Mon-Sat)</p>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>1800-419-5622</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>+91 80 4920 8800 (HQ Desk)</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--color-warning-50)', color: 'var(--color-warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Operational Hours</p>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Monday – Saturday: 09:00 AM – 06:30 PM IST</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--color-info-50)', color: 'var(--color-info-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Headquarters</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
                      JobConnect Digital Solutions Pvt Ltd<br />
                      Level 4, Prestige Tech Park, Outer Ring Road, Kadubeesanahalli, Bengaluru, Karnataka 560103
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust & Safety Assurance */}
            <div style={{
              background: 'var(--color-success-50)',
              border: '1px solid var(--color-success-200)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              display: 'flex',
              gap: 'var(--space-3)',
              alignItems: 'flex-start'
            }}>
              <ShieldCheck size={24} style={{ color: 'var(--color-success-600)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-success-900)' }}>
                  Fraud Protection Hotline
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-700)', marginTop: 2, lineHeight: 1.4 }}>
                  If any recruiter asks for fees or deposits, report immediately to <strong>fraud-alert@jobconnect.example.com</strong> for swift blacklisting.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── FAQ Section Accordion ── */}
        <section style={{ marginTop: 'var(--space-16)' }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto var(--space-10)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Quick answers to common questions regarding jobs, applications, and employer verification.
            </p>
          </div>

          <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)'
                }}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div style={{
                  padding: 'var(--space-4) var(--space-6)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)' }}>
                    {faq.q}
                  </h3>
                  {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {openFaq === idx && (
                  <div style={{
                    padding: '0 var(--space-6) var(--space-5)',
                    borderTop: '1px solid var(--color-gray-100)',
                    paddingTop: 'var(--space-3)'
                  }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
