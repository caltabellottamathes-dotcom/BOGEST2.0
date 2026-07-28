import { useEffect } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import WidgetPanel from '@/components/WidgetPanel';
import { Mic } from 'lucide-react';

/**
 * ElevenLabs Conversational AI Widget — wrapped in a slide-out WidgetPanel.
 * The <elevenlabs-convai> custom element renders inside the panel's content area.
 */
export default function ElevenLabsAgent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (document.querySelector('script[data-elevenlabs-loaded="true"]')) return;

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    script.setAttribute('data-elevenlabs-loaded', 'true');
    document.body.appendChild(script);

    return () => {
      // Keep the script across route changes — removing it would destroy the widget.
    };
  }, []);

  return (
    <WidgetPanel
      label="Voice"
      icon={Mic}
      topOffset="90px"
      panelWidth={76}
      panelHeight={76}
      isDark={isDark}
    >
      <elevenlabs-convai
        agent-id="agent_6601kyn1xnn8ebm9m9ahk52ghmr5"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </WidgetPanel>
  );
}