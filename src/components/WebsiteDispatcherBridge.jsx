import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigateFn } from '@/lib/websiteActions/navigate';
// Importing the actions index registers all built-in handlers.
import '@/lib/websiteActions';

/**
 * Bridge between the framework-agnostic dispatcher and React Router.
 * - Wires the router's `navigate` into the navigate action.
 * - Listens for 'bogest:close-panel' (emitted by the close action) and
 *   navigates home, which closes the glass panel system.
 *
 * Mounted once inside Layout so it stays alive across all routes.
 */
export default function WebsiteDispatcherBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFn(navigate);

    const onClosePanel = () => {
      // If we're on a panel route, going home closes it.
      navigate('/');
    };
    window.addEventListener('bogest:close-panel', onClosePanel);

    return () => {
      window.removeEventListener('bogest:close-panel', onClosePanel);
      setNavigateFn(null);
    };
  }, [navigate]);

  return null;
}