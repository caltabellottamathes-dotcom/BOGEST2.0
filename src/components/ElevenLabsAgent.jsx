import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
// Ensures all website actions are registered and window.websiteAction is set.
import '@/lib/websiteActions';
import { minimizeElevenLabsWidget } from '@/lib/elevenLabsWidget';
import {
  handleWebsiteActionToolCall,
  startWebsiteSyncEngine,
} from '@/lib/websiteSyncEngine';

// Shared, persistent visitor id — the SAME id the website Digital Host uses,
// so both hosts read/write the same Guest Profile through memoryTools.
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

// websiteAction actions that route to the shared Guest Profile (memoryTools)
// instead of the website navigation engine. Fire-and-forget writes — the
// voice host keeps talking while the profile is updated in the background.
const MEMORY_ACTIONS = new Set([
  'requestConsent', 'setPreference', 'updateIdentity',
  'addInsight', 'recordBehaviour', 'forget', 'getGuestProfile',
]);

/**
 * ElevenLabs Conversational AI Widget. At call start it injects the shared
 * Guest Profile as dynamic variables (so the voice host recognises returning
 * guests and resumes context), and routes memory writes through the same
 * memoryTools API the website host uses — one guest, one profile, one memory.
 */
export default function ElevenLabsAgent() {
  const widgetRef = useRef(null);
  const profileRef = useRef(null);
  const [hidden, setHidden] = useState(
    () => typeof document !== 'undefined' && document.body.classList.contains('bogest-entry-active')
  );

  useEffect(() => {
    const handler = (e) => setHidden(e.detail?.open === true);
    window.addEventListener('bogest:popup-visibility', handler);
    return () => window.removeEventListener('bogest:popup-visibility', handler);
  }, []);

  // Pre-fetch the shared Guest Profile once, BEFORE any call starts. The
  // widget's "call" event reads the config SYNCHRONOUSLY — awaiting inside the
  // handler would register client tools too late and break all navigation. The
  // cached profile is injected as dynamic variables the instant a call begins.
  useEffect(() => {
    base44.functions.invoke('memoryTools', { action: 'getGuestProfile', visitor_id: getVisitorId() })
      .then((res) => { profileRef.current = res?.data || null; })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const injectScript = () => {
      if (document.querySelector('script[data-elevenlabs-loaded="true"]')) return;
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      script.setAttribute('data-elevenlabs-loaded', 'true');
      document.body.appendChild(script);
    };
    if (window.requestIdleCallback) {
      window.requestIdleCallback(injectScript, { timeout: 1500 });
    } else {
      setTimeout(injectScript, 500);
    }

    const el = widgetRef.current;
    if (!el) return;

    // The widget reads event.detail.config SYNCHRONOUSLY when a call starts, so
    // the websiteAction client tool MUST be registered before any await in this
    // handler — otherwise the session starts without the tool and navigation
    // silently never fires. Guest-profile dynamic variables are injected from
    // the pre-fetched cache so a returning guest is recognised immediately.
    const onCall = (event) => {
      if (!event?.detail?.config) return;
      startWebsiteSyncEngine();
      const cfg = event.detail.config;

      // 1) Register the websiteAction client tool SYNCHRONOUSLY.
      cfg.clientTools = {
        websiteAction: async (params = {}) => {
          const a = String(params.action || 'go').toLowerCase();

          // Memory actions → shared Guest Profile (memoryTools). Fire-and-forget;
          // never collapse the widget for these.
          if (MEMORY_ACTIONS.has(a)) {
            try {
              const r = await base44.functions.invoke('memoryTools', { ...params, visitor_id: getVisitorId() });
              return r?.data || { ok: true };
            } catch {
              return { ok: false };
            }
          }

          const result = await handleWebsiteActionToolCall(params);
          if (result?.success) {
            if (a !== 'close' && a !== 'search' && a !== 'showbeeldbankphoto' && a !== 'showphoto') {
              setTimeout(() => {
                try { minimizeElevenLabsWidget(); } catch { /* ignore */ }
              }, 700);
            }
          }
          return result;
        },
      };

      // 2) Inject the shared Guest Profile as dynamic variables from the
      //    pre-fetched cache (synchronous, so it applies to this call).
      try {
        const data = profileRef.current || {};
        const p = data.profile || {};
        const prefs = data.preferences || [];
        cfg.dynamic_variables = {
          guest_first_name: p.first_name || p.preferred_name || '',
          guest_is_returning: data.is_returning ? 'true' : 'false',
          guest_last_topic: p.last_topic || '',
          guest_last_channel: p.last_channel || '',
          guest_consent_state: p.consent_state || 'none',
          guest_preferred_location: p.preferred_location || '',
          guest_favorite_dish: p.favorite_dish || '',
          guest_visit_count: String(p.visit_count || 0),
          guest_preferences: prefs.map((x) => `${x.key}=${x.value}`).slice(0, 15).join('|'),
          guest_visitor_id: getVisitorId(),
        };
      } catch { /* fail silently — voice host still works without persistence */ }
    };
    el.addEventListener('elevenlabs-convai:call', onCall);

    return () => {
      el.removeEventListener('elevenlabs-convai:call', onCall);
    };
  }, []);

  return (
    <elevenlabs-convai
      ref={widgetRef}
      agent-id="agent_6601kyn1xnn8ebm9m9ahk52ghmr5"
      dismissible="true"
      placement="bottom-right"
      style={{ display: hidden ? 'none' : undefined }}
    ></elevenlabs-convai>
  );
}