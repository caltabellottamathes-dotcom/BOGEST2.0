import { registerAction } from '../websiteDispatcher';

/**
 * Search or focus specific content. Dispatches a global 'bogest:search' event
 * that any page can listen for to filter / focus its content (menu search,
 * location filter, etc.). Falls back to highlighting a matching element.
 */
registerAction('search', async ({ target, options = {}, data = {} }) => {
  const query = target || data?.query;
  if (!query) return { error: 'missing_query' };
  window.dispatchEvent(new CustomEvent('bogest:search', {
    detail: { query: String(query), options: options || {}, data: data || {} },
  }));
  return { message: `Searched for "${query}"`, query };
});