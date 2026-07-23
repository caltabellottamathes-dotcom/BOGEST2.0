import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const LABELS = {
  nl: {
    header: '--- HUIDIG MENU (uit database) ---',
    pairing: 'Pairing',
    popular: '[POPULAIR]',
    new: '[NIEUW]',
  },
  fr: {
    header: '--- MENU ACTUEL (depuis la base de données) ---',
    pairing: 'Accord',
    popular: '[POPULAIRE]',
    new: '[NOUVEAU]',
  },
  en: {
    header: '--- CURRENT MENU (from database) ---',
    pairing: 'Pairing',
    popular: '[POPULAR]',
    new: '[NEW]',
  },
};

// Fetch menu items from the MenuKnowledge entity and build a context string
// for the digital host's system prompt — this keeps the LLM's knowledge
// in sync with the database automatically.
export function useMenuKnowledge(lang = 'nl') {
  const [menuContext, setMenuContext] = useState('');
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    base44.entities.MenuKnowledge.list('sort_order', 100)
      .then(items => {
        if (!items || items.length === 0) return;
        const l = LABELS[lang] || LABELS.nl;

        // Group by category
        const grouped = {};
        items.forEach(item => {
          const cat = item.category || 'other';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(item);
        });

        // Build context string
        const lines = [l.header];
        Object.entries(grouped).forEach(([cat, catItems]) => {
          lines.push(`\n${cat.toUpperCase()}:`);
          catItems.forEach(item => {
            let line = `  - ${item.item_name}: €${item.price} — ${item.description || ''}`;
            if (item.pairing) line += ` | ${l.pairing}: ${item.pairing}`;
            if (item.is_popular) line += ` ${l.popular}`;
            if (item.is_new) line += ` ${l.new}`;
            lines.push(line);
          });
        });
        setMenuContext(lines.join('\n'));

        // Also expose popular items for UI cards
        setPopularItems(items.filter(i => i.is_popular));
      })
      .catch(() => {});
  }, [lang]);

  return { menuContext, popularItems };
}