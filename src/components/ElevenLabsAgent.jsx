import { useEffect, useRef, useState } from 'react';
// Ensures all website actions are registered and window.websiteAction is set.
import '@/lib/websiteActions';
import { minimizeElevenLabsWidget } from '@/lib/elevenLabsWidget';
import {
  handleWebsiteActionToolCall,
  startWebsiteSyncEngine,
} from '@/lib/websiteSyncEngine';

/**
 * ElevenLabs Conversational AI Widget — rebuilt around a single, reliable
 * trigger: the agent calls the "websiteAction" CLIENT TOOL the instant it
 * touches a topic. The tool is fire-and-forget (expects_response: false on
 * the ElevenLabs tool config), so the host keeps talking while the page
 * navigates / scrolls / highlights silently in the background.
 *
 * There is NO transcript listening. The earlier onMessage-based proactivity
 * fought the tool path and was unreliable on the embed widget (especially
 * mobile) — it has been removed. Proactivity now comes from the agent's own
 * tool call, driven by its system prompt.
 */
export default function ElevenLabsAgent() {
  const widgetRef = useRef(null);
  const [hidden, setHidden] = useState(
    () => typeof document !== 'undefined' && document.body.classList.contains('bogest-entry-active')
  );

  useEffect(() => {
    const handler = (e) => setHidden(e.detail?.open === true);
    window.addEventListener('bogest:popup-visibility', handler);
    return () => window.removeEventListener('bogest:popup-visibility', handler);
  }, []);

  useEffect(() => {
    // Inject the widget embed script once — deferred until the browser is idle
    // so the external fetch never blocks the site's first paint.
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

    // "call" fires when a conversation is about to start. We hook the
    // conversation config to register the websiteAction client tool and reset
    // the sync dedup state for the fresh conversation.
    const onCall = (event) => {
      if (!event?.detail?.config) return;
      startWebsiteSyncEngine();
      const cfg = event.detail.config;

      cfg.clientTools = {
        websiteAction: async (params = {}) => {
          const result = await handleWebsiteActionToolCall(params);
          // After a content action succeeds, collapse the widget so the
          // visitor sees what just opened. The agent keeps speaking while
          // minimized. Skip for actions that don't take the visitor anywhere.
          if (result?.success) {
            const a = String(params.action || 'go').toLowerCase();
            if (a !== 'close' && a !== 'search' && a !== 'showbeeldbankphoto' && a !== 'showphoto') {
              setTimeout(() => {
                try { minimizeElevenLabsWidget(); } catch { /* ignore */ }
              }, 700);
            }
          }
          return result;
        },
      };
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