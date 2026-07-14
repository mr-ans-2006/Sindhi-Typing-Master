/**
 * Virtual Sindhi Keyboard
 * Renders an on-screen clickable keyboard with RTL layout.
 * All key clicks route through the same handleCharInput() as native input.
 */

/**
 * Standard Sindhi keyboard layout (RTL order within each row).
 * Based on the standard Sindhi keyboard mapping.
 */
const KEYBOARD_LAYOUT = [
  // Row 1 (top)
  ['ق', 'و', 'ع', 'ر', 'ت', 'ي', 'ئ', 'ا', 'پ', 'ٻ', 'ڄ'],
  // Row 2
  ['ل', 'ھ', 'س', 'ڏ', 'گ', 'ه', 'ج', 'ک', 'ب', 'ڃ', 'ڇ'],
  // Row 3
  ['ظ', 'ط', 'ص', 'ض', 'ش', 'غ', 'ف', 'خ', 'ح', 'چ', 'ث'],
  // Row 4
  ['ے', 'ی', 'ز', 'م', 'ن', 'ڻ', 'ڱ', 'ڳ', 'ڪ', 'ڊ', 'ڌ'],
  // Row 5 (bottom special row)
  ['ڈ', 'ذ', 'ژ', 'ڑ', 'د', 'ٹ', 'ڦ', '۽', '۾', '۔', '،'],
];

/**
 * Initialize the virtual keyboard.
 * @param {HTMLElement} container - The DOM element to render the keyboard into
 * @param {function} onKeyPress - Callback when a character key is pressed
 * @param {function} onBackspace - Callback for backspace
 */
export function initKeyboard(container, onKeyPress, onBackspace) {
  if (!container) return;

  container.innerHTML = '';
  container.className = 'virtual-keyboard';

  // Render each row
  KEYBOARD_LAYOUT.forEach((row, rowIndex) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'keyboard-row';

    row.forEach(char => {
      const key = document.createElement('button');
      key.className = 'keyboard-key';
      key.textContent = char;
      key.type = 'button';
      key.dataset.char = char;

      // Prevent focus stealing from the hidden input
      key.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });

      key.addEventListener('click', () => {
        onKeyPress(char);
        // Visual feedback
        key.classList.add('pressed');
        setTimeout(() => key.classList.remove('pressed'), 150);
      });

      rowEl.appendChild(key);
    });

    container.appendChild(rowEl);
  });

  // Special keys row (space + backspace)
  const specialRow = document.createElement('div');
  specialRow.className = 'keyboard-row keyboard-row-special';

  // Backspace
  const backspaceKey = document.createElement('button');
  backspaceKey.className = 'keyboard-key keyboard-key-special keyboard-key-backspace';
  backspaceKey.innerHTML = '⌫';
  backspaceKey.type = 'button';
  backspaceKey.addEventListener('mousedown', (e) => e.preventDefault());
  backspaceKey.addEventListener('click', () => {
    onBackspace();
    backspaceKey.classList.add('pressed');
    setTimeout(() => backspaceKey.classList.remove('pressed'), 150);
  });
  specialRow.appendChild(backspaceKey);

  // Spacebar
  const spaceKey = document.createElement('button');
  spaceKey.className = 'keyboard-key keyboard-key-special keyboard-key-space';
  spaceKey.textContent = 'خالي جاءِ';
  spaceKey.type = 'button';
  spaceKey.addEventListener('mousedown', (e) => e.preventDefault());
  spaceKey.addEventListener('click', () => {
    onKeyPress(' ');
    spaceKey.classList.add('pressed');
    setTimeout(() => spaceKey.classList.remove('pressed'), 150);
  });
  specialRow.appendChild(spaceKey);

  // Question mark
  const questionKey = document.createElement('button');
  questionKey.className = 'keyboard-key keyboard-key-special';
  questionKey.textContent = '؟';
  questionKey.type = 'button';
  questionKey.addEventListener('mousedown', (e) => e.preventDefault());
  questionKey.addEventListener('click', () => {
    onKeyPress('؟');
    questionKey.classList.add('pressed');
    setTimeout(() => questionKey.classList.remove('pressed'), 150);
  });
  specialRow.appendChild(questionKey);

  container.appendChild(specialRow);
}

/**
 * Highlight a key on the virtual keyboard (visual feedback for native typing).
 * @param {HTMLElement} container - The keyboard container
 * @param {string} char - The character to highlight
 */
export function highlightKey(container, char) {
  if (!container) return;
  const key = container.querySelector(`[data-char="${char}"]`);
  if (key) {
    key.classList.add('pressed');
    setTimeout(() => key.classList.remove('pressed'), 150);
  }
}
