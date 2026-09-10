/**
 * Shared Application Utilities
 * Consistent Application Number, Application Type, and Job Mela identification
 * across Candidate, Recruiter, and Admin dashboards.
 */

/**
 * Checks whether an application is a Job Mela application.
 */
export function isJobMelaApplication(app) {
  if (!app) return false;
  return Boolean(
    app.melaId ||
    app.applicationType === 'Job Mela Application' ||
    (app.appNumber && typeof app.appNumber === 'string' && app.appNumber.startsWith('NTR-')) ||
    (app.appId && typeof app.appId === 'string' && app.appId.startsWith('NTR-'))
  );
}

/**
 * Formats/derives the standard Application Number for any application.
 * Uses existing app.appNumber or app.appId as source of truth.
 * Fallbacks follow the exact existing logic from Candidate Dashboard.
 */
export function getApplicationNumber(app) {
  if (!app) return '';
  if (app.appNumber) return app.appNumber;
  if (app.appId) return app.appId;

  const isMela = isJobMelaApplication(app);
  if (isMela) {
    return 'NTR-01-02-0024';
  }

  const rawId = String(app.id || app.jobId || '1').replace(/\D/g, '');
  return `APP-${(rawId || '1').padStart(6, '0')}`;
}

/**
 * Formats/derives the standard Application Type.
 * Distinguishes 'Job Mela Application' vs 'Direct Job Application'.
 */
export function getApplicationType(app) {
  if (!app) return 'Direct Job Application';
  if (app.applicationType) return app.applicationType;
  return isJobMelaApplication(app) ? 'Job Mela Application' : 'Direct Job Application';
}

/**
 * Extracts Job Mela details if the application is a Job Mela application.
 */
export function getJobMelaDetails(app) {
  if (!app || !isJobMelaApplication(app)) return null;

  return {
    melaId: app.melaId || null,
    melaTitle: app.melaTitle || app.melaName || 'AP Mega IT & ITES Job Mela 2026',
    company: app.company || app.companyName || 'Participating Employer',
    position: app.title || app.role || app.jobTitle || 'Job Position',
    eventNumber: app.eventNumber || '01',
    companySequence: app.companySequence || '02',
    applicationSequence: app.applicationSequence || '0024',
    passId: app.passId || app.registrationId || null,
    passStatus: app.passStatus || null,
    melaDate: app.melaDate || null,
    melaVenue: app.melaVenue || null,
  };
}

/**
 * Normalizes any application record to ensure all standard fields are populated.
 */
export function normalizeApplication(app, candidateContext = {}) {
  if (!app) return null;

  const isMela = isJobMelaApplication(app);
  const appNumber = getApplicationNumber(app);
  const applicationType = getApplicationType(app);
  const melaDetails = isMela ? getJobMelaDetails(app) : null;

  const candidateName =
    app.candidateName ||
    app.candidate ||
    candidateContext.name ||
    'Candidate';

  const candidateEmail =
    app.candidateEmail ||
    candidateContext.email ||
    '';

  const candidatePhone =
    app.candidatePhone ||
    app.phone ||
    candidateContext.phone ||
    '';

  const jobTitle =
    app.jobTitle ||
    app.title ||
    app.role ||
    app.job ||
    'Position';

  const company =
    app.company ||
    app.companyName ||
    (melaDetails ? melaDetails.company : 'Company');

  return {
    ...app,
    appNumber,
    applicationType,
    isMela,
    candidateName,
    candidateEmail,
    candidatePhone,
    jobTitle,
    company,
    appliedDate: app.appliedDate || app.appliedAt || 'Just now',
    status: app.status || 'APPLIED',
    melaDetails,
    jobIdFormatted: formatJobId(app.jobId || app.id),
    melaIdFormatted: isMela ? formatMelaId(app.melaId || (melaDetails && melaDetails.melaId) || '1') : null,
    passId: app.passId || (melaDetails && melaDetails.passId) || (isMela ? 'PASS-AP-849201' : null),
  };
}

/**
 * Standardizes display of Job ID across Candidate, Recruiter, and Admin.
 * Handles: 'job-101' -> 'JOB-101', '1' -> 'JOB-0001', 'mela-1-comp-2' -> 'JOB-MELA-01-02'
 */
export function formatJobId(rawId) {
  if (!rawId && rawId !== 0) return '';
  const str = String(rawId).trim();
  if (!str) return '';
  if (str.toUpperCase().startsWith('JOB-')) {
    return str.toUpperCase();
  }
  if (str.toLowerCase().startsWith('job-')) {
    return `JOB-${str.slice(4).toUpperCase()}`;
  }
  if (str.toLowerCase().startsWith('mela-')) {
    const parts = str.split('-');
    if (parts.length >= 4 && parts[2] === 'comp') {
      const eventNum = parts[1].padStart(2, '0');
      const compNum = parts[3].padStart(2, '0');
      return `JOB-MELA-${eventNum}-${compNum}`;
    }
    return `JOB-${str.toUpperCase()}`;
  }
  if (/^\d+$/.test(str)) {
    return `JOB-${str.padStart(4, '0')}`;
  }
  return `JOB-${str.toUpperCase()}`;
}

/**
 * Standardizes display of Internship ID across Candidate, Recruiter, and Admin.
 * Handles: 'int-101' -> 'INT-101', 'intern-1' -> 'INT-0001', '1' -> 'INT-0001'
 */
export function formatInternshipId(rawId) {
  if (!rawId && rawId !== 0) return '';
  const str = String(rawId).trim();
  if (!str) return '';
  if (str.toUpperCase().startsWith('INT-')) {
    return str.toUpperCase();
  }
  if (str.toLowerCase().startsWith('int-')) {
    return `INT-${str.slice(4).toUpperCase()}`;
  }
  if (str.toLowerCase().startsWith('intern-')) {
    const suffix = str.slice(7);
    if (/^\d+$/.test(suffix)) {
      return `INT-${suffix.padStart(4, '0')}`;
    }
    return `INT-${suffix.toUpperCase()}`;
  }
  if (/^\d+$/.test(str)) {
    return `INT-${str.padStart(4, '0')}`;
  }
  return `INT-${str.toUpperCase()}`;
}

/**
 * Standardizes display of Job Mela/Event ID across Candidate, Recruiter, and Admin.
 * Handles: 'mela-1' -> 'MELA-0001', '1' -> 'MELA-0001', 'mela-2' -> 'MELA-0002'
 */
export function formatMelaId(rawId) {
  if (!rawId && rawId !== 0) return '';
  const str = String(rawId).trim();
  if (!str) return '';
  if (str.toUpperCase().startsWith('MELA-')) {
    const suffix = str.slice(5);
    if (/^\d+$/.test(suffix)) {
      return `MELA-${suffix.padStart(4, '0')}`;
    }
    return str.toUpperCase();
  }
  if (str.toLowerCase().startsWith('mela-')) {
    const suffix = str.slice(5);
    if (/^\d+$/.test(suffix)) {
      return `MELA-${suffix.padStart(4, '0')}`;
    }
    return `MELA-${suffix.toUpperCase()}`;
  }
  if (/^\d+$/.test(str)) {
    return `MELA-${str.padStart(4, '0')}`;
  }
  return `MELA-${str.toUpperCase()}`;
}

/**
 * Standardizes display of Registration ID (Pass ID / Entry Token) for Job Mela registrations.
 */
export function formatRegistrationId(regOrId) {
  if (!regOrId) return '';
  if (typeof regOrId === 'string') return regOrId;
  return regOrId.passId || regOrId.registrationId || regOrId.entryToken || regOrId.id || '';
}
