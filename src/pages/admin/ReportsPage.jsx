import { useState } from 'react';
import {
  BarChart3, TrendingUp, Users, Building2, Briefcase, FileText,
  CalendarDays, Download, Filter, Layers, PieChart, Activity
} from 'lucide-react';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';

export default function AdminReportsPage() {
  const { toast } = useToast();

  const handleExport = (reportType) => {
    toast({
      type: 'success',
      title: 'Report Exported',
      message: `${reportType} downloaded as CSV spreadsheet.`,
    });
  };

  return (
    <div className="admin-reports-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <BarChart3 size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Platform Intelligence & System Reports</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Comprehensive performance analytics across user demographics, hiring funnels, and Job Mela footprints
            </p>
          </div>

          <Button variant="primary" size="sm" leftIcon={<Download size={14} />} onClick={() => handleExport('Platform Master Analytics Report')}>
            Export Full Analytics CSV
          </Button>
        </div>
      </div>

      {/* ── 1. Top Core Metrics ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <StatCard label="Monthly Job Postings" value="1,840" change="+14.2% MoM" positive icon={<Briefcase size={20} />} iconBg="#eef2ff" iconColor="#4f46e5" />
        <StatCard label="Applications Processed" value="48,900" change="+28.4% MoM" positive icon={<FileText size={20} />} iconBg="#f0fdf4" iconColor="#16a34a" variant="success" />
        <StatCard label="Candidate Placements" value="3,120" change="+18.9% MoM" positive icon={<TrendingUp size={20} />} iconBg="#eff6ff" iconColor="#2563eb" />
        <StatCard label="Job Mela Footfall" value="15,200" change="4 Cities" positive icon={<CalendarDays size={20} />} iconBg="#fff1f2" iconColor="#e11d48" />
      </div>

      {/* ── 2. Detailed Analytic Distributions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>

        {/* Candidate Experience Demographics */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">Candidate Experience Demographics</h2>
            <Button size="xs" variant="ghost" onClick={() => handleExport('Candidate Demographics')}>Export</Button>
          </CardHeader>
          <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { level: '0-2 Years (Freshers & Entry)', count: '4,620 candidates', pct: '37.1%', color: '#6366f1' },
              { level: '3-5 Years (Mid Level)', count: '4,100 candidates', pct: '32.9%', color: '#3b82f6' },
              { level: '6-9 Years (Senior Specialists)', count: '2,480 candidates', pct: '19.9%', color: '#10b981' },
              { level: '10+ Years (Leadership & Staff)', count: '1,250 candidates', pct: '10.1%', color: '#f59e0b' },
            ].map((item) => (
              <div key={item.level}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{item.level}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.count} ({item.pct})</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: item.pct, height: '100%', background: item.color, borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Industry Hiring Share */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">Industry Hiring Breakdown</h2>
            <Button size="xs" variant="ghost" onClick={() => handleExport('Industry Share')}>Export</Button>
          </CardHeader>
          <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { industry: 'Information Technology & Software', vacancies: '2,140 vacancies', pct: '49.5%', color: '#4f46e5' },
              { industry: 'BFSI & Fintech', vacancies: '860 vacancies', pct: '19.9%', color: '#06b6d4' },
              { industry: 'Healthcare & Pharma', vacancies: '540 vacancies', pct: '12.5%', color: '#10b981' },
              { industry: 'E-Commerce & Retail', vacancies: '480 vacancies', pct: '11.1%', color: '#f59e0b' },
              { industry: 'Manufacturing & Automobile', vacancies: '300 vacancies', pct: '7.0%', color: '#ec4899' },
            ].map((item) => (
              <div key={item.industry}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{item.industry}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.vacancies} ({item.pct})</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: item.pct, height: '100%', background: item.color, borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

      </div>

      {/* ── 3. Application Lifecycle Conversion Funnel ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Macro Platform Application Funnel (48,900 Total Submissions)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
          {[
            { step: '1. Applications Sent', value: '48,900', color: '#6366f1', conversion: '100%' },
            { step: '2. Under Review / Screened', value: '31,200', color: '#8b5cf6', conversion: '63.8%' },
            { step: '3. Shortlisted', value: '11,400', color: '#06b6d4', conversion: '23.3%' },
            { step: '4. Interviews Conducted', value: '5,800', color: '#f59e0b', conversion: '11.9%' },
            { step: '5. Offers / Placements', value: '3,120', color: '#10b981', conversion: '6.4%' },
          ].map((item) => (
            <div key={item.step} style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{item.step}</span>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: item.color, margin: '4px 0' }}>{item.value}</p>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{item.conversion} retention rate</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
