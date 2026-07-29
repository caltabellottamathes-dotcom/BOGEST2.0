import { websiteAction } from './websiteDispatcher';
import { collapseElevenLabsWidget } from './elevenLabsWidget';

/**
 * Proactive, deterministic website navigation driven by the ElevenLabs agent's
 * spoken text.
 *
 * The ElevenLabs widget renders the agent's transcript in its (open) shadow DOM
 * when the sheet is expanded. We observe that transcript, read the latest
 * agent message, match it against a multilingual topic table, and — without
 * waiting for the visitor to ask — navigate to / highlight the relevant page,
 * dish, location or feature, then minimize the widget so the visitor can
 * immediately see the content while the agent keeps speaking.
 */

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Intent table — ordered by specificity; first match wins.
 *  - action 'highlight' → navigate to `page`, then highlight `target`
 *  - action 'navigate'  → navigate to `target`
 */
const INTENTS = [
  // Signature dishes → menu + highlight (menu items carry data-highlight slugs)
  { re: /dry[-\s]?aged ribeye|ribeye|rib eye/i, action: 'highlight', page: '/menu', target: 'rib-eye' },
  { re: /c[oô]te\s?[àa]?\s*l'?os|cote a l'?os/i, action: 'highlight', page: '/menu', target: 'cote' },
  { re: /chateaubriand/i, action: 'highlight', page: '/menu', target: 'chateaubriand' },
  { re: /filet pur/i, action: 'highlight', page: '/menu', target: 'filet-pur' },
  { re: /spare?\s*ribs|spareribs/i, action: 'highlight', page: '/menu', target: 'spare-ribs' },
  { re: /entremisu/i, action: 'highlight', page: '/menu', target: 'entremisu' },
  { re: /stoofvlees|carbonnade|carbonade/i, action: 'highlight', page: '/menu', target: 'stoofvlees' },
  { re: /boulet|bouletten|luikse bal/i, action: 'highlight', page: '/menu', target: 'boulet' },
  { re: /godina/i, action: 'highlight', page: '/menu', target: 'godina' },
  // Specific locations
  { re: /\bhasselt\b/i, action: 'navigate', target: '/locations/hasselt' },
  { re: /\bborgloon\b/i, action: 'navigate', target: '/locations/borgloon' },
  { re: /\b(heusden[-\s]?zolder|heusden|zolder)\b/i, action: 'navigate', target: '/locations/heusden-zolder' },
  // Features / pages
  { re: /reserv(eren|atie|ering|ation|er)|reserveer|boek een tafel|tafel reserver|book a table/i, action: 'navigate', target: '/reserve' },
  { re: /cadeau(bon|nnen)?|gift card|giftcards/i, action: 'navigate', target: '/gift-cards' },
  { re: /afhalen|afhaal|take[-\s]?away/i, action: 'navigate', target: '/takeaway' },
  { re: /groep(en)?|groups?|events?|bedrijfsfeest|teambuilding|groepsreserv/i, action: 'navigate', target: '/groups' },
  { re: /contact(eer|formulier)?\b/i, action: 'navigate', target: '/contact' },
  { re: /instagram|sfeerbeeld|sfeerbeelden|onze foto|foto's/i, action: 'navigate', target: '/instagram' },
  { re: /\bverhaal\b|filosofie|philosophy|over bogèst|het verhaal|ons verhaal/i, action: 'navigate', target: '/about' },
  { re: /vacature|vacatures|jobs|werken bij/i, action: 'navigate', target: '/jobs' },
  // Generic menu
  { re: /\bmenu\b|kaart|spijskaart|gerechten|dish|dishes|\bvlees\b|steak|dessert|wijn|sauzen|eten/i, action: 'navigate', target: '/menu' },
  // Generic locations
  { re: /vestigingen|locaties|locations|welke vestiging|onze vestigingen|drie vestigingen/i, action: 'navigate', target: '/locations' },
];

function detectIntent(text) {
  for (const intent of INTENTS) {
    if (intent.re.test(text)) return intent;
  }
  return null;
}

function norm(path) {
  const p = (path || '/').replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

async function runIntent(text) {
  const intent = detectIntent(text);
  if (!intent) return;

  if (intent.action === 'highlight') {
    if (norm(window.location.pathname) !== norm(intent.page)) {
      await websiteAction({ action: 'navigate', target: intent.page });
      await wait(900); // let the menu panel render
    }
    await websiteAction({ action: 'highlight', target: intent.target });
  } else {
    if (norm(window.location.pathname) === norm(intent.target)) return;
    await websiteAction({ action: 'navigate', target: intent.target });
  }

  collapseElevenLabsWidget();
}

// Text that the widget shows in a "pr-8" bubble but is NOT an agent message
// (typing indicator / tool-call status). Used to skip non-content bubbles.
const NON_CONTENT_RE = /^(typing|assistant is typing|typen|bezig|agent working|agent done|agent error|voltooid|fout|\.{2,})$/i;

/**
 * Start watching the widget's shadow-DOM transcript for new agent messages and
 * proactively navigate. Returns a cleanup function.
 */
export function startProactiveNavigation(widget) {
  if (!widget) return () => {};

  let lastHandled = '';
  let settleTimer = null;

  function readLatestAgentText() {
    const root = widget.shadowRoot;
    if (!root) return '';
    // Agent voice/text bubbles are wrapped in <div class="pr-8">. User bubbles
    // use a different layout, so this reliably targets the agent's messages.
    const bubbles = root.querySelectorAll('div.pr-8');
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const t = (bubbles[i].textContent || '').trim();
      if (t.length > 8 && !NON_CONTENT_RE.test(t)) return t;
    }
    return '';
  }

  function tick() {
    const text = readLatestAgentText();
    if (!text || text === lastHandled) return;
    lastHandled = text;
    // Debounce so streamed / partial messages settle before we act.
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      try { runIntent(text); } catch (e) { /* never let the scanner throw */ }
    }, 500);
  }

  const observer = new MutationObserver(tick);

  const attach = () => {
    if (widget.shadowRoot) {
      observer.observe(widget.shadowRoot, { childList: true, subtree: true, characterData: true });
      tick();
    } else {
      setTimeout(attach, 300);
    }
  };
  attach();

  return () => {
    observer.disconnect();
    clearTimeout(settleTimer);
  };
}