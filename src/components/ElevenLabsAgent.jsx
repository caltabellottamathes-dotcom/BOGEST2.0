import { useEffect, useRef } from 'react';
// Ensures all website actions are registered and window.websiteAction is set.
import '@/lib/websiteActions';

/**
 * ElevenLabs Conversational AI Widget.
 *
 * Loads the official embed script and renders the <elevenlabs-convai> element.
 * Wires the widget's Client Tools to the central website dispatcher: the
 * agent calls a single "websiteAction" client tool with { action, target, data }
 * and the dispatcher routes it to the right handler (navigate / scroll /
 * open / highlight / ...).
 *
 * The client tool named "websiteAction" must also be configured in the
 * ElevenLabs agent dashboard for the agent to invoke it.
 */
export default function ElevenLabsAgent() {
  const widgetRef = useRef(null);

  useEffect(() => {
    // Inject the widget embed script once.
    if (!document.querySelector('script[data-elevenlabs-loaded="true"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      script.setAttribute('data-elevenlabs-loaded', 'true');
      document.body.appendChild(script);
    }

    const el = widgetRef.current;
    if (!el) return;

    // The widget fires "elevenlabs-convai:call" when it needs client-tool
    // handlers. We register one universal tool that delegates to the
    // central dispatcher (window.websiteAction).
    const onCall = (event) => {
      if (!event?.detail?.config) return;
      event.detail.config.clientTools = {
        websiteAction: async (params = {}) => {
          if (typeof window.websiteAction !== 'function') {
            return { ok: false, error: 'dispatcher_not_ready' };
          }
          return await window.websiteAction(params);
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
    ></elevenlabs-convai>
  );
}