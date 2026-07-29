import { useEffect, useRef } from 'react';
// Ensures all website actions are registered and window.websiteAction is set.
import '@/lib/websiteActions';
import { minimizeElevenLabsWidget } from '@/lib/elevenLabsWidget';
import {
  startWebsiteSyncEngine,
  stopWebsiteSyncEngine,
  onTranscriptMessage,
  handleWebsiteActionToolCall,
} from '@/lib/websiteSyncEngine';

/**
 * ElevenLabs Conversational AI Widget + Conversational Sync Engine.
 *
 * The agent talks naturally. The sync engine listens to the agent's transcript
 * (via the widget's onMessage hook) and maps what it says to the website
 * content index, driving navigate/scroll/highlight automatically so the page
 * stays in sync with the conversation. The agent may also call the
 * "websiteAction" client tool with { action: "go", target: "<topic>" } to
 * force a sync — both paths feed the same router.
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

    startWebsiteSyncEngine();

    const el = widgetRef.current;
    if (!el) return;

    // The "call" event fires when the widget is about to start a conversation.
    // We hook the conversation config: chain onMessage so the engine can read
    // the agent's speech, and register the websiteAction client tool.
    const onCall = (event) => {
      if (!event?.detail?.config) return;
      const cfg = event.detail.config;

      // Chain onMessage to capture the transcript (agent speech) without
      // breaking the widget's own rendering.
      const origOnMessage = cfg.onMessage;
      cfg.onMessage = (m) => {
        try {
          onTranscriptMessage(m);
        } catch {
          /* keep the widget alive even if the engine throws */
        }
        if (typeof origOnMessage === 'function') return origOnMessage(m);
      };

      cfg.clientTools = {
        websiteAction: async (params = {}) => {
          const result = await handleWebsiteActionToolCall(params);
          // After a successful action that changes the page, collapse the
          // widget so the visitor can see what the host just opened. The
          // agent keeps speaking while minimized.
          if (result?.success) {
            const a = String(params.action || 'go').toLowerCase();
            if (a !== 'close' && a !== 'search') {
              setTimeout(() => {
                try {
                  minimizeElevenLabsWidget();
                } catch {
                  /* ignore */
                }
              }, 800);
            }
          }
          return result;
        },
      };
    };
    el.addEventListener('elevenlabs-convai:call', onCall);

    return () => {
      el.removeEventListener('elevenlabs-convai:call', onCall);
      stopWebsiteSyncEngine();
    };
  }, []);

  return (
    <elevenlabs-convai
      ref={widgetRef}
      agent-id="agent_6601kyn1xnn8ebm9m9ahk52ghmr5"
      dismissible="true"
      placement="bottom-right"
    ></elevenlabs-convai>
  );
}