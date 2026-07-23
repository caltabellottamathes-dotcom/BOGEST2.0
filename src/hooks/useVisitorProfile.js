import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

// Generate or retrieve a persistent anonymous visitor ID from localStorage
function getVisitorId() {
  try {
    let id = localStorage.getItem('bogest-visitor-id');
    if (!id) {
      id = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('bogest-visitor-id', id);
    }
    return id;
  } catch {
    return 'v_anon_' + Date.now().toString(36);
  }
}

export function useVisitorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const visitorIdRef = useRef(null);

  useEffect(() => {
    const visitorId = getVisitorId();
    visitorIdRef.current = visitorId;

    // Touch the profile (increments visit count, updates last_visit)
    base44.functions.invoke('visitorProfile', { visitor_id: visitorId, action: 'touch' })
      .then(res => {
        setProfile(res.data?.profile || null);
      })
      .catch(() => {
        // Fail silently — the host still works without persistence
      })
      .finally(() => setLoading(false));
  }, []);

  const updateProfile = async (data) => {
    if (!visitorIdRef.current) return;
    try {
      const res = await base44.functions.invoke('visitorProfile', {
        visitor_id: visitorIdRef.current,
        action: 'update',
        profile_data: data
      });
      if (res.data?.profile) setProfile(res.data.profile);
    } catch {}
  };

  const incrementConversation = async () => {
    if (!visitorIdRef.current) return;
    try {
      const res = await base44.functions.invoke('visitorProfile', {
        visitor_id: visitorIdRef.current,
        action: 'increment_conversation'
      });
      if (res.data?.profile) setProfile(res.data.profile);
    } catch {}
  };

  return { profile, loading, updateProfile, incrementConversation, visitorId: visitorIdRef.current };
}