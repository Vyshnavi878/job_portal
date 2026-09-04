import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Download, UploadCloud, Eye, Trash2, CheckCircle2,
  AlertCircle, Sparkles, RefreshCw, FileCheck, ArrowRight, ShieldCheck,
  Check, ExternalLink, X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useCandidate } from '../../context/CandidateContext';

export default function CandidateResumePage() {
  const { toast } = useToast();
  const { candidate, updateResume } = useCandidate();

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const resume = candidate.resume;

  const handleDownload = () => {
    toast({
      type: 'success',
      title: 'Downloading Resume',
      message: `Downloading "${resume.fileName}" to your local device...`,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setUploadError('Invalid format! Please upload PDF, DOC, or DOCX files only.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit! Please upload a smaller resume file.');
      return;
    }

    setUploadError('');
    updateResume({
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      atsScore: 94
    });

    setReplaceModalOpen(false);
    toast({
      type: 'success',
      title: 'Resume Replaced Successfully',
      message: `Updated your verified candidate resume to "${file.name}".`,
    });
  };

  return (
    <div className="candidate-resume-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      {/* ── Header ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <FileText size={22} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>My Resume & CV Documents</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Active resume attached to your job applications and recruiter searches for {candidate.name}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UploadCloud size={14} />}
              onClick={() => setReplaceModalOpen(true)}
            >
              Replace Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={14} />}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ── Active Resume Card ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', border: '1.5px solid var(--color-primary-200)', background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FileText size={28} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text)' }}>
                  {resume.fileName}
                </h2>
                <span className="badge badge-success" style={{ fontSize: '10px' }}>
                  <ShieldCheck size={11} style={{ marginRight: 2 }} /> Active Default Resume
                </span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <span>Uploaded: <strong>{resume.uploadedDate}</strong></span>
                <span>•</span>
                <span>File Size: <strong>{resume.fileSize}</strong></span>
                <span>•</span>
                <span>Format: <strong>{resume.fileType || 'PDF Document'}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Eye size={14} />}
              onClick={() => setPreviewModalOpen(true)}
            >
              View Preview
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<UploadCloud size={14} />}
              onClick={() => setReplaceModalOpen(true)}
            >
              Replace
            </Button>
          </div>
        </div>
      </div>

      {/* ── ATS Optimization Score Card ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 2fr)', gap: 'var(--space-6)' }}>
        
        {/* Left: Score Gauge */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'conic-gradient(var(--color-primary-600) 0% 88%, var(--color-gray-200) 88% 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-3)'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--color-surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary-700)' }}>
                {resume.atsScore}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>out of 100</span>
            </div>
          </div>

          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>ATS Resume Score</h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Your resume passes 94% of applicant tracking filters used by top recruiters.
          </p>
        </div>

        {/* Right: ATS Checklist */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
            ATS Optimization Checklist & Recommendations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
            {[
              { label: 'Clear standard headings (Experience, Education, Skills)', done: true },
              { label: 'Action verbs and quantifiable metrics included', done: true },
              { label: 'Technical keywords match target job roles (React, TypeScript, Python)', done: true },
              { label: 'Single-column scannable PDF formatting without text frames', done: true },
              { label: 'Valid contact details and LinkedIn URL verified', done: true }
            ].map((check, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-success-600)', flexShrink: 0 }} />
                <span>{check.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Replace Resume Modal ── */}
      {replaceModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)'
          }}
          onClick={() => setReplaceModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl)',
              width: '100%', maxWidth: 480,
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Upload New Resume</h2>
              <button
                type="button"
                onClick={() => setReplaceModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              border: '2px dashed var(--color-primary-300)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8) var(--space-4)',
              textAlign: 'center',
              background: 'var(--color-primary-50)',
              marginBottom: 'var(--space-4)'
            }}>
              <UploadCloud size={36} style={{ color: 'var(--color-primary-600)', margin: '0 auto var(--space-3)' }} />
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary-900)' }}>
                Choose a PDF or DOCX file to upload
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 4 }}>
                Supports PDF, DOC, DOCX up to 5MB
              </p>

              <label style={{
                display: 'inline-block',
                marginTop: 'var(--space-4)',
                background: 'var(--color-primary-600)',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Browse Computer Files
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {uploadError && (
              <p style={{ fontSize: '11px', color: 'var(--color-danger-500)', marginBottom: 'var(--space-3)' }}>
                {uploadError}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button variant="outline" size="sm" onClick={() => setReplaceModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {previewModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)'
          }}
          onClick={() => setPreviewModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl)',
              width: '100%', maxWidth: 560,
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>Resume Preview: {resume.fileName}</h2>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1, fontSize: 'var(--text-xs)', lineHeight: 1.6, background: '#fafafa' }}>
              <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{candidate.name}</h1>
                <p style={{ color: 'var(--color-primary-600)', fontWeight: 700 }}>{candidate.headline}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>{candidate.email} • {candidate.phone} • {candidate.location}</p>

                <hr style={{ margin: 'var(--space-4) 0', borderColor: 'var(--color-gray-200)' }} />

                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Professional Summary</h3>
                <p style={{ marginTop: 4 }}>{candidate.bio}</p>

                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>Technical Skills</h3>
                <p style={{ marginTop: 4 }}>{candidate.skillsPreferences.skills.join(' • ')}</p>

                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>Education & Credentials</h3>
                <p style={{ marginTop: 4 }}>{candidate.skillsPreferences.educationLevel} (Graduated with honors)</p>
              </div>
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button size="sm" variant="outline" onClick={handleDownload} leftIcon={<Download size={14} />}>Download</Button>
              <Button size="sm" variant="primary" onClick={() => setPreviewModalOpen(false)}>Close Preview</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
