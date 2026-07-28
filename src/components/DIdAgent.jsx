import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * D-ID Visual AI Agent — fetches a client key from the backend function,
 * then injects the D-ID widget script.
 * The Bogèst agent (VraagHetBogest) is the brain; this widget is just the visual avatar.
 * Chat input is hidden so visitors interact through the digital host, not the D-ID widget directly.
 * The digital host calls window.DID_AGENTS_API.functions.speak() to make this avatar speak.
 */
export default function DIdAgent() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    let cancelled = false;
    base44.functions.invoke('getDIdClientKey', {})
      .then(res => {
        if (cancelled) return;
        const data = res.data || res;
        if (data?.client_key) {
          setConfig({ clientKey: data.client_key, agentId: data.agent_id });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!config) return;
    if (document.querySelector('script[data-d-id-loaded="true"]')) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v2/index.js';
    script.async = true;
    script.setAttribute('data-mode', 'fabio');
    script.setAttribute('data-client-key', config.clientKey);
    script.setAttribute('data-agent-id', config.agentId);
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
  }, [config]);

  return null;
}