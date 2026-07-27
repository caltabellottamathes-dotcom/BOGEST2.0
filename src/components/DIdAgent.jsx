import { useEffect } from 'react';

/**
 * D-ID Visual AI Agent — injects the D-ID widget script after the React app mounts.
 * Positioned on the right per configuration.
 */
export default function DIdAgent() {
  useEffect(() => {
    if (document.querySelector('script[data-d-id-loaded="true"]')) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v2/index.js';
    script.async = true;
    script.setAttribute('data-mode', 'fabio');
    script.setAttribute('data-client-key', 'ck_3Mk0sR3KvLYvDRQcydK0p');
    script.setAttribute('data-agent-id', 'v2_agt_iXpDI5v1');
    script.setAttribute('data-name', 'did-agent');
    script.setAttribute('data-monitor', 'true');
    script.setAttribute('data-orientation', 'horizontal');
    script.setAttribute('data-position', 'right');
    script.setAttribute('data-open-mode', 'compact');
    script.setAttribute('data-d-id-loaded', 'true');
    document.body.appendChild(script);

    return () => {
      // Keep the script across route changes — removing it would destroy the widget.
    };
  }, []);

  return null;
}