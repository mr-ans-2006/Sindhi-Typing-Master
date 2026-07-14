import { isValidSindhiChar } from './sindhi-validator.js';

/**
 * Core typing engine — mode-aware.
 * Manages all typing state, metrics, and completion logic.
 * 
 * The handleCharInput() method is the UNIFIED entry point
 * for both native keyboard and virtual keyboard input.
 */

export class TypingEngine {
  constructor() {
    this.reset();
  }

  /**
   * Reset all state for a new test.
   * @param {object} options
   * @param {string} options.targetText - The text to type
   * @param {string} options.mode - 'time' | 'words' | 'zen' | 'sentence'
   * @param {number} options.value - Duration (s) or word count
   */
  reset(options = {}) {
    this.targetText = options.targetText || '';
    this.mode = options.mode || 'time';
    this.modeValue = options.value || 60;

    // Typing state
    this.typedChars = [];
    this.cursorPos = 0;
    this.correctCount = 0;
    this.errorCount = 0;
    this.totalValidKeystrokes = 0;

    // Timer state
    this.startTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.elapsed = 0;
    this.isRunning = false;
    this.isFinished = false;

    // Analytics
    this.wpmHistory = [];       // { time: seconds, wpm: number }
    this.mistakeMap = {};       // char → error count
    this.wpmSampleInterval = null;

    // Callbacks (set by main.js)
    this.onUpdate = null;       // Called after each keystroke
    this.onWarning = null;      // Called when invalid char is typed
    this.onComplete = null;     // Called when test is finished
    this.onTick = null;         // Called every second (timer update)
  }

  /**
   * Start the timer. Called on first accepted keystroke.
   */
  startTimer() {
    if (this.isRunning) return;
    
    this.startTime = Date.now();
    this.isRunning = true;

    // Update elapsed time every 100ms for smooth display
    this.timerInterval = setInterval(() => {
      this.elapsed = (Date.now() - this.startTime) / 1000;

      // Time mode: check if duration expired
      if (this.mode === 'time' && this.elapsed >= this.modeValue) {
        this.finishTest();
        return;
      }

      if (this.onTick) this.onTick(this.getTimerDisplay());
    }, 100);

    // Sample WPM every second for the graph
    this.wpmSampleInterval = setInterval(() => {
      if (!this.isFinished) {
        const elapsed = (Date.now() - this.startTime) / 1000;
        const wpm = elapsed > 0 ? (this.correctCount / 5) / (elapsed / 60) : 0;
        this.wpmHistory.push({
          time: Math.round(elapsed),
          wpm: Math.round(wpm * 10) / 10,
        });
      }
    }, 1000);
  }

  /**
   * Stop the timer and mark test as finished.
   */
  finishTest() {
    if (this.isFinished) return;
    
    this.isFinished = true;
    this.isRunning = false;
    this.endTime = Date.now();
    this.elapsed = (this.endTime - this.startTime) / 1000;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.wpmSampleInterval) {
      clearInterval(this.wpmSampleInterval);
      this.wpmSampleInterval = null;
    }

    // Final WPM sample
    const wpm = this.elapsed > 0 ? (this.correctCount / 5) / (this.elapsed / 60) : 0;
    this.wpmHistory.push({
      time: Math.round(this.elapsed),
      wpm: Math.round(wpm * 10) / 10,
    });

    if (this.onComplete) this.onComplete(this.getMetrics());
  }

  /**
   * UNIFIED CHARACTER INPUT HANDLER
   * ================================
   * This is the SINGLE entry point for ALL character input,
   * whether from native keyboard or virtual keyboard.
   *
   * Flow:
   *  1. Validate character via isValidSindhiChar()
   *  2. If invalid → trigger warning, return false
   *  3. If valid → insert, compare against target, update state
   *
   * @param {string} char - Single character to insert
   * @returns {boolean} true if character was accepted
   */
  handleCharInput(char) {
    // Don't accept input after test is finished
    if (this.isFinished) return false;

    // ── VALIDATION (the critical check) ──
    if (!isValidSindhiChar(char)) {
      if (this.onWarning) this.onWarning('صرف سنڌي ۾ لکو');
      return false;
    }

    // Start timer on first accepted keystroke
    if (!this.isRunning && !this.isFinished) {
      this.startTimer();
    }

    // Don't go past the end of the target text
    if (this.cursorPos >= this.targetText.length) {
      return false;
    }

    // ── INSERT CHARACTER ──
    const targetChar = this.targetText[this.cursorPos];
    const isCorrect = char === targetChar;

    this.typedChars.push({
      char,
      isCorrect,
      targetChar,
    });

    this.totalValidKeystrokes++;

    if (isCorrect) {
      this.correctCount++;
    } else {
      this.errorCount++;
      // Track mistake for heatmap
      this.mistakeMap[targetChar] = (this.mistakeMap[targetChar] || 0) + 1;
    }

    this.cursorPos++;

    // Check completion
    if (this.checkCompletion()) {
      this.finishTest();
    }

    // Notify UI to update
    if (this.onUpdate) this.onUpdate();

    return true;
  }

  /**
   * Handle backspace — remove last typed character.
   * @returns {boolean} true if backspace was applied
   */
  handleBackspace() {
    if (this.isFinished) return false;
    if (this.cursorPos === 0) return false;

    const removed = this.typedChars.pop();
    this.cursorPos--;

    // Adjust counts
    if (removed) {
      this.totalValidKeystrokes--;
      if (removed.isCorrect) {
        this.correctCount--;
      } else {
        this.errorCount--;
        // Reduce mistake count
        if (this.mistakeMap[removed.targetChar]) {
          this.mistakeMap[removed.targetChar]--;
          if (this.mistakeMap[removed.targetChar] <= 0) {
            delete this.mistakeMap[removed.targetChar];
          }
        }
      }
    }

    if (this.onUpdate) this.onUpdate();
    return true;
  }

  /**
   * Check if the test is complete based on current mode.
   */
  checkCompletion() {
    switch (this.mode) {
      case 'time':
        // Time mode completes when timer expires (handled in startTimer)
        return false;
      
      case 'words':
      case 'sentence':
        // Complete when all characters are typed
        return this.cursorPos >= this.targetText.length;
      
      case 'zen':
        // Zen never auto-completes
        return false;
      
      default:
        return this.cursorPos >= this.targetText.length;
    }
  }

  /**
   * Get the timer display string.
   * Time mode: countdown. Others: count-up.
   */
  getTimerDisplay() {
    if (this.mode === 'time') {
      const remaining = Math.max(0, this.modeValue - this.elapsed);
      return Math.ceil(remaining);
    }
    return Math.floor(this.elapsed);
  }

  /**
   * Get current WPM.
   */
  getWPM() {
    if (!this.startTime) return 0;
    const elapsed = this.isFinished
      ? this.elapsed
      : (Date.now() - this.startTime) / 1000;
    if (elapsed <= 0) return 0;
    return (this.correctCount / 5) / (elapsed / 60);
  }

  /**
   * Get current accuracy percentage.
   */
  getAccuracy() {
    if (this.totalValidKeystrokes === 0) return 100;
    return (this.correctCount / this.totalValidKeystrokes) * 100;
  }

  /**
   * Get full metrics object for results screen.
   */
  getMetrics() {
    return {
      wpm: Math.round(this.getWPM() * 10) / 10,
      accuracy: Math.round(this.getAccuracy() * 10) / 10,
      correctCount: this.correctCount,
      errorCount: this.errorCount,
      totalKeystrokes: this.totalValidKeystrokes,
      elapsed: Math.round(this.elapsed * 10) / 10,
      wpmHistory: [...this.wpmHistory],
      mistakeMap: { ...this.mistakeMap },
      mode: this.mode,
      modeValue: this.modeValue,
      charsTyped: this.cursorPos,
      totalChars: this.targetText.length,
    };
  }

  /**
   * Cleanup intervals when destroying.
   */
  destroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.wpmSampleInterval) clearInterval(this.wpmSampleInterval);
  }
}
