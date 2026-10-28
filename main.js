/**
 * SINDHI TYPEMASTER — Main Entry Point
 * =====================================
 * Initializes all modules, wires event listeners, manages app state.
 */

import './style.css';
import './theme.css';
import { isValidSindhiChar } from './src/sindhi-validator.js';
import { getNextText, prefillCache } from './src/text-fetcher.js';
import { TypingEngine } from './src/typing-engine.js';
import { initKeyboard } from './src/keyboard.js';

import {
  initDisplay,
  renderTargetText,
  updateMetrics,
  updateTimer,
  showWarning,
  showResults,
  hideResults,
  updateSourceBadge,
  setLoading,
  setActiveMode,
  resetTextDisplay,
} from './src/display.js';

// ── App State ──
const state = {
  mode: 'time',       // 'time' | 'words' | 'zen' | 'sentence'
  modeValue: 15,      // duration (s) or word count
  targetText: '',
  textSource: '',
};

// ── Modules ──
const engine = new TypingEngine();
const hiddenInput = document.getElementById('hidden-input');

// ══════════════════════════════════
//  Initialization
// ══════════════════════════════════

async function init() {
  // Initialize display module (cache DOM refs)
  initDisplay();

  // Set up mode selector
  setupModeSelector();

  // Initialize physical virtual keyboard
  initKeyboard(
    (char) => handleInput(char),
    () => handleBackspace(),
    () => {
      if (engine.isRunning && !engine.isFinished) {
        engine.finishTest();
      }
    }
  );

  // Set up native input handling
  setupNativeInput();

  // Set up action buttons
  setupActionButtons();

  // Set up look settings (background photo / glass blur toggles)
  setupThemeToggles();

  // Load initial text
  await loadNewText();

  // Prefill cache in background
  prefillCache().catch(() => {});

  // Focus the hidden input
  focusInput();
}

// ══════════════════════════════════
//  Text Loading
// ══════════════════════════════════

async function loadNewText() {
  setLoading(true);
  resetTextDisplay();

  try {
    const result = await getNextText({
      mode: state.mode,
      value: state.modeValue,
    });

    state.targetText = result.text;
    state.textSource = result.source;

    // Reset engine with new text
    engine.reset({
      targetText: state.targetText,
      mode: state.mode,
      value: state.modeValue,
    });

    // Wire engine callbacks
    wireEngineCallbacks();

    // Render the text
    renderTargetText(state.targetText, [], 0);
    updateSourceBadge(state.textSource);
    updateMetrics(0, 100, state.mode === 'time' ? state.modeValue : '0', 0, 0);

  } catch (err) {
    console.error('Failed to load text:', err);
    // Use a simple fallback
    state.targetText = 'سنڌي ٻولي هڪ قديم ٻولي آهي۔';
    state.textSource = 'مقامي ذخيرو';
    engine.reset({
      targetText: state.targetText,
      mode: state.mode,
      value: state.modeValue,
    });
    wireEngineCallbacks();
    renderTargetText(state.targetText, [], 0);
    updateSourceBadge(state.textSource);
  }

  setLoading(false);
  focusInput();
}

// ══════════════════════════════════
//  Engine Callbacks
// ══════════════════════════════════

function wireEngineCallbacks() {
  engine.onUpdate = () => {
    // Re-render text display
    renderTargetText(state.targetText, engine.typedChars, engine.cursorPos);

    // Update live metrics (WPM label reads "live" because this is a
    // momentary pace; the results screen shows the whole-test average)
    updateMetrics(
      engine.getWPM(),
      engine.getAccuracy(),
      engine.getTimerDisplay(),
      engine.errorCount,
      engine.getCPM(),
    );
  };

  engine.onWarning = (message) => {
    showWarning(message);
  };

  engine.onComplete = (metrics) => {
    showResults(metrics, state.targetText);
  };

  engine.onTick = (timerDisplay) => {
    updateTimer(timerDisplay);
  };

  let isFetchingMoreText = false;
  engine.onNeedMoreText = async () => {
    if (isFetchingMoreText) return;
    isFetchingMoreText = true;
    setLoading(true);

    try {
      const result = await getNextText({
        mode: state.mode,
        value: state.modeValue,
      });

      // Append new text with a space
      state.targetText += ' ' + result.text;
      engine.targetText = state.targetText;

      // Re-render immediately
      renderTargetText(state.targetText, engine.typedChars, engine.cursorPos);
    } catch (err) {
      console.error('Failed to load more text:', err);
      // Fallback
      state.targetText += ' سنڌي ٻولي هڪ قديم ٻولي آهي۔';
      engine.targetText = state.targetText;
      renderTargetText(state.targetText, engine.typedChars, engine.cursorPos);
    }

    setLoading(false);
    isFetchingMoreText = false;
    focusInput();
  };
}

// ══════════════════════════════════
//  Input Handling
// ══════════════════════════════════

/**
 * UNIFIED INPUT HANDLER
 * Called by both native keyboard and virtual keyboard.
 * Routes through the typing engine's handleCharInput().
 */
function handleInput(char) {
  engine.handleCharInput(char);

  // Keep hidden input focused
  focusInput();
}

function handleBackspace() {
  engine.handleBackspace();
  focusInput();
}

/**
 * Set up native keyboard input handling.
 * Uses 'beforeinput' event for pre-insertion validation.
 */
function setupNativeInput() {
  if (!hiddenInput) return;

  // Handle character input via beforeinput
  hiddenInput.addEventListener('beforeinput', (e) => {
    // Always prevent default — we manage the input ourselves
    e.preventDefault();

    if (e.inputType === 'insertText' && e.data) {
      // Process each character in the input data
      for (const char of e.data) {
        handleInput(char);
      }
    } else if (e.inputType === 'deleteContentBackward') {
      handleBackspace();
    }
  });

  // Fallback: also handle keydown for backspace
  // (some browsers/IMEs don't fire beforeinput for backspace)
  hiddenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    }
    // End test on Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      if (engine.isRunning && !engine.isFinished) {
        engine.finishTest();
      }
    }
    // Prevent Tab from leaving
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  });

  // Re-focus on click anywhere in the text display area
  const textWrapper = document.querySelector('.text-display-wrapper');
  if (textWrapper) {
    textWrapper.addEventListener('click', () => {
      focusInput();
      // On phones the system keyboard resizes the viewport; keep the
      // passage visible above it instead of letting it get covered.
      textWrapper.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }

  // Also re-focus on any click in the main content
  document.querySelector('.main-content')?.addEventListener('click', (e) => {
    // Don't steal focus from buttons
    if (e.target.closest('button')) return;
    focusInput();
  });
}

function focusInput() {
  if (hiddenInput && !engine.isFinished) {
    hiddenInput.focus();
  }
}

// ══════════════════════════════════
//  Mode Selector
// ══════════════════════════════════

function setupModeSelector() {
  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newMode = btn.dataset.mode;
      
      // Set default values for each mode
      const defaults = {
        time: 15,
        words: 10,
        zen: 0,
        sentence: 0,
      };

      state.mode = newMode;
      state.modeValue = defaults[newMode];

      setActiveMode(state.mode, state.modeValue);
      loadNewText();
    });
  });

  // Sub-option buttons (time durations, word counts)
  document.querySelectorAll('.sub-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.modeValue = parseInt(btn.dataset.value, 10);
      setActiveMode(state.mode, state.modeValue);
      loadNewText();
    });
  });

  // Set initial active state
  setActiveMode(state.mode, state.modeValue);
}

// ══════════════════════════════════
//  Action Buttons
// ══════════════════════════════════

function setupActionButtons() {
  // New test button
  const newTestBtn = document.getElementById('new-test-btn');
  if (newTestBtn) {
    newTestBtn.addEventListener('click', () => {
      engine.destroy();
      loadNewText();
    });
  }

  // Try again button (in results overlay)
  const tryAgainBtn = document.getElementById('try-again-btn');
  if (tryAgainBtn) {
    tryAgainBtn.addEventListener('click', () => {
      hideResults();
      engine.destroy();
      loadNewText();
    });
  }

  // Zen finish button
  const zenFinishBtn = document.getElementById('zen-finish-btn');
  if (zenFinishBtn) {
    zenFinishBtn.addEventListener('click', () => {
      if (state.mode === 'zen' && engine.isRunning) {
        engine.finishTest();
      }
    });
  }

  // Keyboard shortcut: Escape to reset, Tab+Enter to restart
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close results if open, or reset current test
      if (document.getElementById('results-overlay')?.classList.contains('visible')) {
        hideResults();
        engine.destroy();
        loadNewText();
      }
    }
  });
}

// ══════════════════════════════════
//  Look settings (background photo / glass blur)
//  Both default ON and persist in localStorage. Turning the photo off
//  restores the plain dark background; turning blur off makes panels
//  fully solid (zero GPU blur cost on low-end phones).
// ══════════════════════════════════

function setupThemeToggles() {
  const bgCb = document.getElementById('bg-toggle-cb');
  const blurCb = document.getElementById('blur-toggle-cb');

  const apply = () => {
    document.body.classList.toggle('no-bg', bgCb && !bgCb.checked);
    document.body.classList.toggle('no-blur', blurCb && !blurCb.checked);
  };

  try {
    const savedBg = localStorage.getItem('stm-bg');
    const savedBlur = localStorage.getItem('stm-blur');
    if (bgCb && savedBg !== null) bgCb.checked = savedBg === '1';
    if (blurCb && savedBlur !== null) blurCb.checked = savedBlur === '1';
  } catch {
    // localStorage unavailable: defaults (both on) stand
  }

  if (bgCb) {
    bgCb.addEventListener('change', () => {
      try { localStorage.setItem('stm-bg', bgCb.checked ? '1' : '0'); } catch { /* ignore */ }
      apply();
    });
  }
  if (blurCb) {
    blurCb.addEventListener('change', () => {
      try { localStorage.setItem('stm-blur', blurCb.checked ? '1' : '0'); } catch { /* ignore */ }
      apply();
    });
  }

  apply();
}

// ══════════════════════════════════
//  Start the app
// ══════════════════════════════════

document.addEventListener('DOMContentLoaded', init);
