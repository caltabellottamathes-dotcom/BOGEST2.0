import { useEffect } from 'react';

/**
 * D-ID Visual AI Agent — hardcoded widget script.
 * The Bogèst agent (VraagHetBogest) is the brain; this widget is the visual avatar.
 */
export default function DIdAgent() {
  useEffect(() => {
    if (document.querySelector('script[data-d-id-loaded="true"]')) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v2/index.js';
    script.async = true;
    script.setAttribute('data-mode', 'fabio');
    script.setAttribute('data-client-key', 'ck_B9rjjvkJFcHGVq2VnIl9Z');
    script.setAttribute('data-agent-id', 'v2_agt_FA7pkt1L');
    script.setAttribute('data-name', 'did-agent');
    script.setAttribute('data-monitor', 'true');
    script.setAttribute('data-orientation', 'horizontal');
    script.setAttribute('data-position', 'right');
    script.setAttribute('data-open-mode', 'compact');
    script.setAttribute('data-d-id-loaded', 'true');
    document.body.appendChild(script);
  }, []);

  return null;
}