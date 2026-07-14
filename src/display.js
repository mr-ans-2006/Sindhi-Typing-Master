/**
 * Display module — all UI rendering logic.
 * Handles text display, metrics, warnings, mode selector, and results overlay.
 */

import { renderWpmGraph } from './wpm-graph.js';
import { renderMistakeHeatmap } from './mistake-heatmap.js';
import { getBest, saveBest } from './personal-best.js';

// ── DOM element references (cached on init) ──
let els = {};

/**
 * Initialize display module — cache all DOM references.
 */
export function initDisplay() {
  els = {
    textDisplay: document.getElementById('text-display'),
    metricsWpm: document.getElementById('metric-wpm'),
    metricsAccuracy: document.getElementById('metric-accuracy'),
    metricsTimer: document.getElementById('metric-timer'),
    metricsErrors: document.getElementById('metric-errors'),
    warningToast: document.getElementById('warning-toast'),
    warningText: document.getElementById('warning-text'),
    resultsOverlay: document.getElementById('results-overlay'),
    resultWpm: document.getElementById('result-wpm'),
    resultAccuracy: document.getElementById('result-accuracy'),
    resultErrors: document.getElementById('result-errors'),
    resultTime: document.getElementById('result-time'),
    resultChars: document.getElementById('result-chars'),
    wpmCanvas: document.getElementById('wpm-canvas'),
    heatmapContainer: document.getElementById('heatmap-container'),
    personalBestBadge: document.getElementById('personal-best-badge'),
    personalBestInfo: document.getElementById('personal-best-info'),
    sourceBadge: document.getElementById('source-badge'),
    modeButtons: document.querySelectorAll('.mode-btn'),
    subOptionButtons: document.querySelectorAll('.sub-option-btn'),
    loadingSpinner: document.getElementById('loading-spinner'),
    zenFinishBtn: document.getElementById('zen-finish-btn'),
  };
}

/**
 * Render the target text with per-character state coloring.
 * @param {string} targetText - Full target text
 * @param {Array} typedChars - Array of { char, isCorrect, targetChar }
 * @param {number} cursorPos - Current cursor position
 */
export function renderTargetText(targetText, typedChars, cursorPos) {
  if (!els.textDisplay) return;

  let html = '';
  for (let i = 0; i < targetText.length; i++) {
    let className = 'char-untyped';
    
    if (i < cursorPos) {
      // Already typed
      className = typedChars[i]?.isCorrect ? 'char-correct' : 'char-incorrect';
    } else if (i === cursorPos) {
      // Current position
      className = 'char-current';
    }

    // Handle space characters visually
    const displayChar = targetText[i] === ' ' ? '\u00A0' : targetText[i];
    html += `<span class="${className}">${displayChar}</span>`;
  }

  els.textDisplay.innerHTML = html;

  // Auto-scroll to keep cursor visible
  const currentChar = els.textDisplay.querySelector('.char-current');
  if (currentChar) {
    currentChar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

/**
 * Update live metrics display.
 */
export function updateMetrics(wpm, accuracy, timer, errors) {
  if (els.metricsWpm) els.metricsWpm.textContent = Math.round(wpm);
  if (els.metricsAccuracy) els.metricsAccuracy.textContent = `${Math.round(accuracy)}%`;
  if (els.metricsTimer) els.metricsTimer.textContent = timer;
  if (els.metricsErrors) els.metricsErrors.textContent = errors;
}

/**
 * Update just the timer display.
 */
export function updateTimer(timerValue) {
  if (els.metricsTimer) els.metricsTimer.textContent = timerValue;
}

/**
 * Show the red warning toast for invalid input.
 * Auto-hides after 2 seconds.
 */
let warningTimeout = null;
export function showWarning(message) {
  if (!els.warningToast) return;

  // Clear any existing timeout
  if (warningTimeout) clearTimeout(warningTimeout);

  els.warningText.textContent = message;
  els.warningToast.classList.add('visible');

  warningTimeout = setTimeout(() => {
    els.warningToast.classList.remove('visible');
  }, 2000);
}

/**
 * Show the results overlay with full metrics.
 */
export function showResults(metrics, targetText) {
  if (!els.resultsOverlay) return;

  // Fill in stats
  if (els.resultWpm) els.resultWpm.textContent = metrics.wpm;
  if (els.resultAccuracy) els.resultAccuracy.textContent = `${metrics.accuracy}%`;
  if (els.resultErrors) els.resultErrors.textContent = metrics.errorCount;
  if (els.resultTime) els.resultTime.textContent = `${metrics.elapsed}s`;
  if (els.resultChars) els.resultChars.textContent = `${metrics.charsTyped}/${metrics.totalChars}`;

  // Render WPM graph
  if (els.wpmCanvas) {
    // Small delay to ensure canvas is visible before rendering
    requestAnimationFrame(() => {
      renderWpmGraph(els.wpmCanvas, metrics.wpmHistory);
    });
  }

  // Render mistake heatmap
  if (els.heatmapContainer) {
    renderMistakeHeatmap(els.heatmapContainer, metrics.mistakeMap, targetText);
  }

  // Check personal best
  const isNewBest = saveBest(metrics.mode, metrics.modeValue, metrics);
  if (els.personalBestBadge) {
    if (isNewBest) {
      els.personalBestBadge.classList.add('visible');
      els.personalBestBadge.textContent = '🏆 نئون ذاتي رڪارڊ!';
    } else {
      els.personalBestBadge.classList.remove('visible');
    }
  }

  // Show existing personal best
  if (els.personalBestInfo) {
    const best = getBest(metrics.mode, metrics.modeValue);
    if (best && !isNewBest) {
      els.personalBestInfo.textContent = `بهترين: ${best.wpm} WPM`;
      els.personalBestInfo.classList.add('visible');
    } else {
      els.personalBestInfo.classList.remove('visible');
    }
  }

  // Show overlay with animation
  els.resultsOverlay.classList.add('visible');
}

/**
 * Hide the results overlay.
 */
export function hideResults() {
  if (els.resultsOverlay) {
    els.resultsOverlay.classList.remove('visible');
  }
  if (els.personalBestBadge) {
    els.personalBestBadge.classList.remove('visible');
  }
}

/**
 * Update the source badge text.
 */
export function updateSourceBadge(source) {
  if (els.sourceBadge) {
    els.sourceBadge.textContent = source;
    els.sourceBadge.classList.add('visible');
  }
}

/**
 * Show/hide loading spinner.
 */
export function setLoading(loading) {
  if (els.loadingSpinner) {
    els.loadingSpinner.classList.toggle('visible', loading);
  }
  if (els.textDisplay) {
    els.textDisplay.classList.toggle('loading', loading);
  }
}

/**
 * Update active mode button styling.
 */
export function setActiveMode(mode, value) {
  // Update mode buttons
  els.modeButtons?.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Update sub-option buttons
  els.subOptionButtons?.forEach(btn => {
    const isRelevant = btn.dataset.mode === mode;
    const isActive = isRelevant && btn.dataset.value === String(value);
    btn.classList.toggle('active', isActive);
    btn.classList.toggle('visible', isRelevant);
  });

  // Show/hide zen finish button
  if (els.zenFinishBtn) {
    els.zenFinishBtn.classList.toggle('visible', mode === 'zen');
  }
}

/**
 * Reset the text display to empty/loading state.
 */
export function resetTextDisplay() {
  if (els.textDisplay) {
    els.textDisplay.innerHTML = '<span class="loading-text">لوڊ ٿي رهيو آهي...</span>';
  }
  updateMetrics(0, 100, '-', 0);
}
