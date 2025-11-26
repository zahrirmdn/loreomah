// Simple session management utility

const ROLE_SESSION_MINUTES = {
  admin: 120, // 2 jam
  user: 60,   // 1 jam
};

function decodeJwt(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(payload));
    return json;
  } catch (e) {
    return null;
  }
}

export function startSession(role) {
  const token = localStorage.getItem('token');
  const payload = decodeJwt(token);
  const now = Date.now();
  const configuredMs = (ROLE_SESSION_MINUTES[role] || 60) * 60 * 1000;
  let expiresAt = now + configuredMs;
  if (payload?.exp) {
    const jwtExpMs = payload.exp * 1000;
    // Use earlier of configured session and token real exp
    expiresAt = Math.min(jwtExpMs, expiresAt);
  }
  localStorage.setItem('sessionStartedAt', String(now));
  localStorage.setItem('sessionExpiresAt', String(expiresAt));
}

export function endSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('sessionStartedAt');
  localStorage.removeItem('sessionExpiresAt');
}

export function isSessionValid() {
  const expiresAt = Number(localStorage.getItem('sessionExpiresAt'));
  if (!expiresAt) return false;
  return Date.now() < expiresAt;
}

export function getRemainingMs() {
  const expiresAt = Number(localStorage.getItem('sessionExpiresAt'));
  if (!expiresAt) return 0;
  return Math.max(0, expiresAt - Date.now());
}

export function getCurrentUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function getRole() {
  return getCurrentUser()?.role;
}
