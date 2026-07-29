import { useEffect, useRef } from 'react';
// Ensures all website actions are registered and window.websiteAction is set.
import '@/lib/websiteActions';
import { minimizeElevenLabsWidget } from '@/lib/elevenLabsWidget';

// Actions that visibly change what's on screen. After a successful one, the
// widget auto-minimizes so the visitor can immediately see the result. Actions
// like `close` / `search` (and any failed action) keep the widget open so the
// agent can continue the conversation.
const MUTATING_ACTIONS = new Set(['navigate', 'scroll', 'highlight', 'open']);

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
          const result = await window.websiteAction(params);
          // After a successful action that changes the page, collapse the widget
          // so the visitor can see the content the AI just opened. The agent's
          // spoken confirmation keeps playing while minimized. Failed actions
          // or non-mutating actions (close/search) leave the widget open so the
          // agent can gather more info from the visitor.
          const action = String(params.action || result?.action || '').toLowerCase();
          if (result?.success && MUTATING_ACTIONS.has(action)) {
            setTimeout(() => { minimizeElevenLabsWidget(); }, 800);
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
      placement="bottom-left"
    ></elevenlabs-convai>
  );
}