import { useEffect, useRef } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { base44 } from '@/api/base44Client';
import WidgetPanel from '@/components/WidgetPanel';
import { Video } from 'lucide-react';

/**
 * D-ID Visual AI Agent — wrapped in a slide-out WidgetPanel.
 * After the D-ID script injects its widget element, we port it into
 * the panel's content container so it slides with the panel.
 */
export default function DIdAgent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const contentRef = useRef(null);
  const configRef = useRef(null);
  const observerRef = useRef(null);

  // Fetch client key + agent ID from backend, then inject the D-ID script
  useEffect(() => {
    let cancelled = false;
    base44.functions.invoke('getDIdClientKey', {})
      .then(res => {
        if (cancelled) return;
        const data = res.data || res;
        if (data?.client_key) {
          configRef.current = data;
          loadScript();
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const tryMoveWidget = () => {
    if (!contentRef.current) return;
    const widget = document.querySelector('[data-name="did-agent"]');
    if (widget && widget.parentElement !== contentRef.current) {
      contentRef.current.appendChild(widget);
      widget.style.setProperty('position', 'relative', 'important');
      widget.style.setProperty('width', '100%', 'important');
      widget.style.setProperty('height', '100%', 'important');
      widget.style.setProperty('inset', 'auto', 'important');
      widget.style.setProperty('margin', '0', 'important');
    }
  };

  const loadScript = () => {
    const config = configRef.current;
    if (!config) return;

    // Observe for the widget element and move it into our panel
    if (!observerRef.current) {
      observerRef.current = new MutationObserver(() => tryMoveWidget());
      observerRef.current.observe(document.body, { childList: true, subtree: true });
    }
    tryMoveWidget();

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
    script.setAttribute('data-open-mode', 'compact');
    script.setAttribute('data-show-chat-toggle', 'false');
    script.setAttribute('data-auto-connect', 'true');
    script.setAttribute('data-d-id-loaded', 'true');
    document.body.appendChild(script);
  };

  return (
    <WidgetPanel
      label="Avatar"
      icon={Video}
      topOffset="180px"
      panelWidth={96}
      panelHeight={120}
      isDark={isDark}
      contentRef={contentRef}
    />
  );
}