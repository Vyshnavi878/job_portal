import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, Video, Building2, MapPin, CheckCircle2,
  ExternalLink, Calendar, ArrowRight, UserCheck, ShieldCheck,
  AlertCircle, Sparkles, MessageSquare, Info, ChevronRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/States';
import { useCandidate } from '../../context/CandidateContext';
import { useToast } from '../../context/ToastContext';

export default function CandidateInterviewsPage() {
  const { candidate } = useCandidate();
  const { toast } = useToast();

  const upcomingInterviews = useMemo(() => {
    return candidate.interviews.filter(i => i.status === 'UPCOMING');
  }, [candidate.interviews]);

  const pastInterviews = useMemo(() => {
    return candidate.interviews.filter(i => i.status === 'COMPLETED');
  }, [candidate.interviews]);

  const handleJoinMeeting = (meetingUrl, company) => {
    toast({
      type: 'info',
      title: 'Connecting to Meeting',
      message: `Opening interview call with ${company}...`,
    });
    window.open(meetingUrl || 'https://meet.google.com', '_blank', 'noopener,noreferrer');
  };

  const handleAddToCalendar = (title, company) => {
    toast({
      type: 'success',
      title: 'Calendar Event Exported',
      message: `Added "${title} with ${company}" to your calendar.`,
    });
  };

  return (
    <div className="candidate-interviews-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      
      {/* ── Top Header ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Video size={22} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Interview Schedule & History</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Manage online video calls, panel assessments, and feedback for {candidate.name}
            </p>
          </div>

          <Link to="/candidate/jobs">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
              Find More Opportunities
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Section 1: Upcoming Interviews ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <Clock size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
            Upcoming Interviews ({upcomingInterviews.length})
          </h2>
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
            <EmptyState
              icon="default"
              title="No upcoming interviews scheduled"
              description="When recruiters shortlist your applications, your interview invitations and video conference links will appear here."
              action={
                <Link to="/candidate/applications">
                  <Button variant="primary">Check Application Status</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {upcomingInterviews.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  borderRadius: 'var(--radius-2xl)',
                  padding: 'var(--space-6)',
                  border: '1px solid var(--color-primary-200)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fcfaff 100%)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  
                  <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: 'var(--radius-xl)',
                      background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                      color: '#fff',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.company?.[0] || 'I'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        <span className="badge badge-warning" style={{ fontSize: '10px' }}>
                          Upcoming • {item.mode || 'Online Interview'}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          Platform: {item.meetingPlatform || 'Google Meet'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)', marginTop: 4 }}>
                        {item.title}
                      </h3>

                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 700, marginTop: 2 }}>
                        {item.role} • {item.company}
                      </p>

                      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarDays size={14} /> {item.date}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {item.time}</span>
                        {item.panel && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><UserCheck size={14} /> Panel: {item.panel}</span>}
                      </div>

                      {item.instructions && (
                        <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', fontSize: '11px', color: 'var(--color-primary-800)' }}>
                          <strong>Preparation Note:</strong> {item.instructions}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Calendar size={14} />}
                      onClick={() => handleAddToCalendar(item.title, item.company)}
                    >
                      Add to Calendar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<ExternalLink size={14} />}
                      onClick={() => handleJoinMeeting(item.meetingUrl, item.company)}
                    >
                      Join Meeting
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 2: Past Interviews ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <CheckCircle2 size={18} style={{ color: 'var(--color-success-600)' }} />
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
            Past Interview History ({pastInterviews.length})
          </h2>
        </div>

        {pastInterviews.length === 0 ? (
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>No completed past interviews on record.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {pastInterviews.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-5)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)'
                }}
              >
                <div>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800 }}>{item.title}</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {item.role} • <strong>{item.company}</strong> ({item.date})
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className="badge badge-success" style={{ fontSize: '11px' }}>
                    {item.result || 'Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
