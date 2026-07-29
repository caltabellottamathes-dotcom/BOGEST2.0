/**
 * Auto-registers all built-in action handlers.
 * Import this module once (from the React bridge) to wire every action.
 * Add a new action: create a file here that calls registerAction(...),
 * then import it below.
 */
import './navigate';
import './scroll';
import './highlight';
import './openPanel';
import './closePanel';
import './search';