/**
 * Personal Best tracking via localStorage.
 * Saves best WPM and accuracy per mode+config combination.
 */

const STORAGE_KEY = 'sindhi-typemaster-bests';

/**
 * Load all personal bests from localStorage.
 * @returns {object} Map of "mode-config" → { wpm, accuracy, date }
 */
function loadBests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save all personal bests to localStorage.
 */
function saveBests(bests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bests));
  } catch {
    // localStorage might be full or disabled
  }
}

/**
 * Build the storage key for a mode+config combination.
 * @param {string} mode - 'time' | 'words' | 'zen' | 'sentence'
 * @param {number|string} config - e.g., 60 (seconds), 25 (words)
 * @returns {string} e.g., "time-60", "words-25"
 */
function buildKey(mode, config) {
  return `${mode}-${config}`;
}

/**
 * Get the personal best for a specific mode+config.
 * @param {string} mode
 * @param {number|string} config
 * @returns {{ wpm: number, accuracy: number, date: string } | null}
 */
export function getBest(mode, config) {
  const bests = loadBests();
  const key = buildKey(mode, config);
  return bests[key] || null;
}

/**
 * Attempt to save a new personal best.
 * Only saves if the new WPM is higher than the existing best.
 *
 * @param {string} mode
 * @param {number|string} config
 * @param {{ wpm: number, accuracy: number }} metrics
 * @returns {boolean} true if this was a new personal best
 */
export function saveBest(mode, config, metrics) {
  const bests = loadBests();
  const key = buildKey(mode, config);
  const existing = bests[key];

  if (!existing || metrics.wpm > existing.wpm) {
    bests[key] = {
      wpm: Math.round(metrics.wpm * 10) / 10,
      accuracy: Math.round(metrics.accuracy * 10) / 10,
      date: new Date().toISOString(),
    };
    saveBests(bests);
    return true;
  }

  return false;
}

/**
 * Get all personal bests (for potential future stats page).
 * @returns {object}
 */
export function getAllBests() {
  return loadBests();
}

// ── Recent history (last 10 tests, newest first) ──

const HISTORY_KEY = 'sindhi-typemaster-history';
const HISTORY_LIMIT = 10;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Prepend a finished test to the history, keeping only the last 10.
 */
export function saveHistory(metrics) {
  try {
    const history = loadHistory();
    history.unshift({
      wpm: Math.round(metrics.wpm * 10) / 10,
      cpm: Math.round((metrics.cpm ?? 0) * 10) / 10,
      accuracy: Math.round(metrics.accuracy * 10) / 10,
      mode: metrics.mode,
      modeValue: metrics.modeValue,
      date: new Date().toISOString(),
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
  } catch {
    // localStorage might be full or disabled
  }
}

/**
 * @returns {Array} Newest-first list of recent tests (max 10).
 */
export function getHistory() {
  return loadHistory();
}

/**
 * Clear all personal bests.
 */
export function clearAllBests() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
