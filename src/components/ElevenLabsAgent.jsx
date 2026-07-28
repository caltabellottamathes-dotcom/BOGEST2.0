import { useEffect } from 'react';

/**
 * ElevenLabs Conversational AI Widget — loads the embed script and renders
 * the <elevenlabs-convai> custom element. Positioned to float on the left
 * so it doesn't overlap the existing "Vraag het aan Bogèst" host (right).
 */
export default function ElevenLabsAgent() {
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
    <elevenlabs-convai agent-id="agent_6201kymxj69zfzs9zffss5gk0d3j"></elevenlabs-convai>
  );
}