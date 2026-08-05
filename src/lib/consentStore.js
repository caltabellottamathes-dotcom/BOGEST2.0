import { useState, useEffect } from 'react';

// Cross-channel consent store for Bogèst.
// Categories:
//  - necessary     (always on, not stored as a choice)
//  - personalization ('Persoonlijke ervaring' — host may remember prefs)
//  - speech        ('Spraakfunctie' — microphone / ElevenLabs voice)
//  - analytics      ('Websiteverbetering' — currently unused, off by default)
//
// Persisted in localStorage; components subscribe via useConsent() so the
// Digital Host and voice entry react instantly when a visitor changes their
// mind in the cookie preferences screen.

const KEY = 'bogest-consent-v1';
const EVT = 'bogest:consent-change';

const DEFAULT = {
  necessary: true,
  personalization: false,
  speech: false,
  analytics: false,
  decided: false,
  decidedAt: null,
};

export function readConsent() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const p = JSON.parse(raw);
    return { ...DEFAULT, ...p, necessary: true };
  } catch {
    return { ...DEFAULT };
  }
}

export function writeConsent(prefs) {
  const data = {
    ...DEFAULT,
    ...prefs,
    necessary: true,
    decided: true,
    decidedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
  window.dispatchEvent(new CustomEvent(EVT, { detail: data }));
  return data;
}

// Reopen the cookie preferences screen from anywhere (e.g. the footer link).
export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent('bogest:open-cookie-preferences'));
}

export function useConsent() {
  const [consent, setConsent] = useState(() => readConsent());
  useEffect(() => {
    const onChange = (e) => setConsent(e.detail || readConsent());
    window.addEventListener(EVT, onChange);
    return () => window.removeEventListener(EVT, onChange);
  }, []);
  return consent;
}