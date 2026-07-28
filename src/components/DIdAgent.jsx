import { useEffect } from 'react';

const DID_CLIENT_KEY = 'bWF0dGlhLmRhdXR6ZW5iZXJnQGdtYWlsLmNvbQ:Fv4GZRM6FQpELqMk3a2NI';
const DID_AGENT_ID = 'v2_agt_iXpDI5v1';

/**
 * D-ID Visual AI Agent — injects the D-ID widget script after the React app mounts.
 * The Bogèst agent (VraagHetBogest) is the brain; this widget is just the visual avatar.
 * Chat input is hidden so visitors interact through the digital host, not the D-ID widget directly.
 * The digital host calls window.DID_AGENTS_API.functions.speak() to make this avatar speak.
 */
export default function DIdAgent() {
  useEffect(() => {
    if (document.querySelector('script[data-d-id-loaded="true"]')) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v2/index.js';
    script.async = true;
    script.setAttribute('data-mode', 'fabio');
    script.setAttribute('data-client-key', DID_CLIENT_KEY);
    script.setAttribute('data-agent-id', DID_AGENT_ID);
    script.setAttribute('data-name', 'did-agent');
    script.setAttribute('data-monitor', 'true');
    script.setAttribute('data-orientation', 'horizontal');
    script.setAttribute('data-position', 'right');
    script.setAttribute('data-open-mode', 'compact');
    script.setAttribute('data-show-chat-toggle', 'false');
    script.setAttribute('data-auto-connect', 'true');
    script.setAttribute('data-d-id-loaded', 'true');
    document.body.appendChild(script);

    return () => {
      // Keep the script across route changes — removing it would destroy the widget.
    };
  }, []);

  return null;
}