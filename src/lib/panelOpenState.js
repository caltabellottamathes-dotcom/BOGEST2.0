// Reference-counted "panel open" body flag. Multiple panels / overlays can
// stack (a route panel with a widget sub-panel on top). The `bogest-panel-open`
// flag stays on the body until the LAST one closes — so the hero video stays
// paused + blurred and the hero text stays hidden for the entire stack, and
// closing a sub-panel never prematurely un-hides the hero behind a parent
// panel that is still open.
let depth = 0;

export function openPanel() {
  depth += 1;
  if (depth === 1) document.body.classList.add('bogest-panel-open');
}

export function closePanel() {
  if (depth > 0) depth -= 1;
  if (depth === 0) document.body.classList.remove('bogest-panel-open');
}