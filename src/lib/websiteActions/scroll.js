import { registerAction } from '../websiteDispatcher';

/**
 * Smooth-scroll to a section/element identified by id, data-section, or
 * data-scroll-target. Falls back to a fuzzy id match.
 */
registerAction('scroll', async ({ target, options = {}, data = {} }) => {
  if (!target) return { error: 'missing_target' };
  const key = String(target).toLowerCase().trim();
  const selector = key
    .replace(/[^a-z0-9-_]/g, '-');
  const el =
    document.getElementById(key) ||
    document.querySelector(`[data-section="${CSS.escape(key)}"]`) ||
    document.querySelector(`[data-scroll-target="${CSS.escape(key)}"]`) ||
    document.querySelector(`[data-section="${CSS.escape(selector)}" i]`) ||
    document.querySelector(`[id*="${CSS.escape(key)}" i]`);
  if (!el) return { error: 'not_found', target };
  const offset = Number.isFinite(options?.offset) ? options.offset
    : Number.isFinite(data?.offset) ? data.offset : 88;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: options?.behavior || 'smooth' });
  return { message: `Scrolled to ${target}`, section: target };
});