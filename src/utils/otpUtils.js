/**
 * otpUtils.js — Shared OTP utilities and daily attempt tracking.
 * Strictly caps OTP generation/resend attempts to a maximum of 3 per flow per day.
 */

export const MAX_DAILY_OTP_ATTEMPTS = 3;

/**
 * Returns today's formatted date string YYYY-MM-DD (local time)
 */
export function getTodayDateStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Key format for daily OTP attempt tracking
 */
export function getDailyOtpStorageKey(flowId = 'auth') {
  return `ntr_otp_limit_${flowId}_${getTodayDateStr()}`;
}

/**
 * Gets current count of OTP attempts made today for the given flow
 * @param {string} flowId - 'candidate_reg' | 'recruiter_reg' | 'forgot_pwd'
 * @returns {number}
 */
export function getDailyOtpAttempts(flowId) {
  try {
    const key = getDailyOtpStorageKey(flowId);
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Checks whether the daily OTP attempt limit has been reached
 * @param {string} flowId
 * @returns {boolean}
 */
export function isDailyOtpLimitReached(flowId) {
  return getDailyOtpAttempts(flowId) >= MAX_DAILY_OTP_ATTEMPTS;
}

/**
 * Records an OTP request / resend attempt for the day.
 * Returns the updated attempt count.
 * @param {string} flowId
 * @returns {number}
 */
export function recordOtpAttempt(flowId) {
  try {
    const key = getDailyOtpStorageKey(flowId);
    const current = getDailyOtpAttempts(flowId);
    const next = Math.min(current + 1, MAX_DAILY_OTP_ATTEMPTS);
    localStorage.setItem(key, String(next));
    return next;
  } catch {
    return 1;
  }
}

/**
 * Partially masks an email address (e.g. priya@example.com -> p***@example.com)
 * @param {string} email
 * @returns {string}
 */
export function maskEmail(email = '') {
  if (!email || !email.includes('@')) return email || 'your email';
  const [user, domain] = email.split('@');
  if (!user) return email;
  return `${user[0]}***@${domain}`;
}
