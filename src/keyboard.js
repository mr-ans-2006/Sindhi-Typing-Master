/**
 * SINDHI TYPEMASTER — Virtual Keyboards
 * ======================================
 * Two on-screen keyboards, one input pipeline:
 *
 * 1. DESKTOP layout — the physical QWERTY → Sindhi glyph mapping
 *    (Keyman MBSindhi-style). This is a visual guide for people typing
 *    on a real keyboard. Tapping Shift switches this view to the
 *    full alphabet layout, so mouse/tap users can reach every letter.
 *
 * 2. ALPHABET layout — every Sindhi letter the app accepts, arranged
 *    in rows that share the row width (flex: 1), so the keyboard fits
 *    a phone screen instead of overflowing it. This is the default
 *    keyboard on small screens. It has no Shift/Tab/Caps keys because
 *    those are meaningless on a phone; every letter is directly tappable.
 *
 * Both layouts call the same onKeyPress / onBackspace / onEnter
 * callbacks, so the typing engine cannot tell them apart.
 */

// The layout mapping based on standard physical QWERTY rows
const KEYBOARD_LAYOUT = [
  // Row 1: Number Row
  [
    { keycap: '`', sindhiChar: '`' },
    { keycap: '1', sindhiChar: '1' },
    { keycap: '2', sindhiChar: '2' },
    { keycap: '3', sindhiChar: '3' },
    { keycap: '4', sindhiChar: '4' },
    { keycap: '5', sindhiChar: '5' },
    { keycap: '6', sindhiChar: '6' },
    { keycap: '7', sindhiChar: '7' },
    { keycap: '8', sindhiChar: '8' },
    { keycap: '9', sindhiChar: '9' },
    { keycap: '0', sindhiChar: '0' },
    { keycap: '-', sindhiChar: 'ڏ' }, // Ddal
    { keycap: '=', sindhiChar: 'ڈ' }, // Ddaal with tah
    { keycap: 'Bksp', sindhiChar: '⌫', isAction: true, action: 'backspace' }
  ],
  // Row 2: Top Letter Row
  [
    { keycap: 'Tab', sindhiChar: '⇥', isAction: true },
    { keycap: 'Q', sindhiChar: 'ق' },
    { keycap: 'W', sindhiChar: 'ص' },
    { keycap: 'E', sindhiChar: 'ي' },
    { keycap: 'R', sindhiChar: 'ر' },
    { keycap: 'T', sindhiChar: 'ت' },
    { keycap: 'Y', sindhiChar: 'ث' },
    { keycap: 'U', sindhiChar: 'ع' },
    { keycap: 'I', sindhiChar: 'ڳ' }, // Gae
    { keycap: 'O', sindhiChar: 'و' },
    { keycap: 'P', sindhiChar: 'پ' },
    { keycap: '[', sindhiChar: 'چ' }, // Che
    { keycap: ']', sindhiChar: 'ڄ' }, // Jje
    { keycap: '\\', sindhiChar: 'ڊ' } // Dal with dot below
  ],
  // Row 3: Home Row
  [
    { keycap: 'Caps', sindhiChar: '⇪', isAction: true },
    { keycap: 'A', sindhiChar: 'ا' },
    { keycap: 'S', sindhiChar: 'س' },
    { keycap: 'D', sindhiChar: 'د' },
    { keycap: 'F', sindhiChar: 'ف' },
    { keycap: 'G', sindhiChar: 'گ' },
    { keycap: 'H', sindhiChar: 'ه' },
    { keycap: 'J', sindhiChar: 'ھ' }, // Haa doachashmee
    { keycap: 'K', sindhiChar: 'ڪ' }, // Keheh
    { keycap: 'L', sindhiChar: 'ل' },
    { keycap: ';', sindhiChar: 'ک' }, // Kheh
    { keycap: '\'', sindhiChar: 'ڱ' }, // Ngeh
    { keycap: 'Enter', sindhiChar: '↵', isAction: true, action: 'enter' }
  ],
  // Row 4: Bottom Row
  [
    { keycap: 'Shift', sindhiChar: '⇧', isAction: true, action: 'shift' },
    { keycap: 'Z', sindhiChar: 'ز' },
    { keycap: 'X', sindhiChar: 'خ' },
    { keycap: 'C', sindhiChar: 'ط' },
    { keycap: 'V', sindhiChar: 'ٻ' }, // Bbe
    { keycap: 'B', sindhiChar: 'ب' },
    { keycap: 'N', sindhiChar: 'ن' },
    { keycap: 'M', sindhiChar: 'م' },
    { keycap: ',', sindhiChar: '،' }, // Arabic comma
    { keycap: '.', sindhiChar: '.' }, // Dot
    { keycap: '/', sindhiChar: 'ئ' }, // Yeh with hamza
    { keycap: 'Shift', sindhiChar: '⇧', isAction: true, action: 'shift' }
  ]
];

/**
 * Full Sindhi alphabet for the mobile layout. Every letter here is a
 * character the validator accepts, so any Wikipedia passage can be
 * typed from this keyboard alone. Both yeh forms (ي / ی) are included
 * because passages use both. Diacritics (zabar/zer/pesh) are left out:
 * they almost never appear in passages and the desktop layout omits
 * them too.
 *
 * Rows are 10 keys wide; the last letter row holds 5 letters plus a
 * wide Space key and Backspace. Digit row covers years/numbers in text.
 */
export const MOBILE_KEYBOARD_ROWS = [
  ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ'],
  ['د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص'],
  ['ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل'],
  ['م', 'ن', 'و', 'ہ', 'ي', 'ی', 'ے', 'ٻ', 'ڄ', 'ڃ'],
  ['ڇ', 'ڏ', 'ڊ', 'ڌ', 'ڦ', 'ڻ', 'ڱ', 'ڳ', 'ڪ', 'ھ'],
  ['۽', '۾', 'آ', 'ئ', 'ؤ', 'ء', 'أ', 'إ', 'ة', 'ى'],
  // Special row: remaining letters + space + backspace (handled in render)
  ['ڀ', 'ه', '۔', '،', '؟'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
];

// Sanity check hook for tests: every letter the validator lists for
// keyboards must exist on the mobile layout (plus digits/punctuation).
export function getMobileKeyboardChars() {
  const chars = new Set();
  for (const row of MOBILE_KEYBOARD_ROWS) {
    for (const ch of row) chars.add(ch);
  }
  chars.add(' ');
  return chars;
}


export function initKeyboard(onKeyPress, onBackspace, onEnter) {
  const container = document.getElementById('virtual-keyboard-container');
  const mobileContainer = document.getElementById('mobile-keyboard-container');
  const toggleCb = document.getElementById('keyboard-toggle-cb');

  let shiftOn = false;
  let desktopEl = null;
  let desktopAlphaEl = null;

  const toggleShiftView = () => {
    shiftOn = !shiftOn;
    if (desktopEl) desktopEl.style.display = shiftOn ? 'none' : 'flex';
    if (desktopAlphaEl) desktopAlphaEl.style.display = shiftOn ? 'flex' : 'none';
    document.querySelectorAll('.vk-key-shift').forEach((el) => {
      el.classList.toggle('vk-shift-on', shiftOn);
    });
  };

  // Desktop container: QWERTY guide + alphabet view behind Shift.
  if (container) {
    const built = renderDesktopKeyboard(container, onKeyPress, onBackspace, onEnter, toggleShiftView);
    desktopEl = built.desktopEl;
    desktopAlphaEl = built.alphaEl;
  }

  // Mobile container: alphabet layout only. Its visibility is ruled
  // purely by CSS media queries — never by the toggle checkbox — so a
  // phone user can never hide their only way to type.
  if (mobileContainer) {
    renderAlphaKeyboard(mobileContainer, onKeyPress, onBackspace);
  }

  // Wire toggle: it only ever hides the DESKTOP guide keyboard.
  if (toggleCb && container) {
    toggleCb.addEventListener('change', (e) => {
      container.style.display = e.target.checked ? 'block' : 'none';
    });
    // Initial state (desktop only; the mobile container is CSS-ruled)
    container.style.display = toggleCb.checked ? 'block' : 'none';
  }
}

function makeKeyButton({ keycap, sindhiChar, isAction, extraClass, onClick }) {
  const keyEl = document.createElement('button');
  keyEl.className = 'vk-key';
  if (isAction) keyEl.classList.add('vk-key-action');
  if (extraClass) keyEl.classList.add(extraClass);

  const labelEl = document.createElement('span');
  labelEl.className = 'vk-keycap';
  labelEl.textContent = keycap;

  const charEl = document.createElement('span');
  charEl.className = 'vk-char';
  charEl.textContent = sindhiChar;

  keyEl.appendChild(labelEl);
  keyEl.appendChild(charEl);

  // Prevent focus stealing from the hidden input (mouse + touch)
  keyEl.addEventListener('mousedown', (e) => e.preventDefault());
  keyEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (onClick) onClick();
  });

  return keyEl;
}

function renderDesktopKeyboard(container, onKeyPress, onBackspace, onEnter, onShift) {
  container.innerHTML = '';

  // The layout must render Left-to-Right to match physical keys
  const keyboardEl = document.createElement('div');
  keyboardEl.className = 'virtual-keyboard';
  keyboardEl.dir = 'ltr';

  KEYBOARD_LAYOUT.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'vk-row';

    row.forEach(key => {
      let extraClass = '';
      if (key.keycap === 'Enter') extraClass = 'vk-key-enter';
      if (key.keycap === 'Bksp') extraClass = 'vk-key-bksp';
      if (key.keycap === 'Shift') extraClass = 'vk-key-shift';
      if (key.keycap === 'Tab') extraClass = 'vk-key-tab';
      if (key.keycap === 'Caps') extraClass = 'vk-key-caps';

      const onClick = () => {
        if (!key.isAction) {
          if (onKeyPress) onKeyPress(key.sindhiChar);
        } else if (key.action === 'backspace' && onBackspace) {
          onBackspace();
        } else if (key.action === 'enter' && onEnter) {
          onEnter();
        } else if (key.action === 'shift' && onShift) {
          onShift();
        }
        // Tab / Caps are guide-only on screen: no tap action.
      };

      rowEl.appendChild(makeKeyButton({ ...key, extraClass, onClick }));
    });

    keyboardEl.appendChild(rowEl);
  });

  // Spacebar row
  const spaceRow = document.createElement('div');
  spaceRow.className = 'vk-row vk-row-bottom';
  const spaceBtn = document.createElement('button');
  spaceBtn.className = 'vk-key vk-key-space';
  spaceBtn.innerHTML = '<span class="vk-keycap">Space</span><span class="vk-char"> </span>';
  spaceBtn.addEventListener('mousedown', (e) => e.preventDefault());
  spaceBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (onKeyPress) onKeyPress(' ');
  });
  spaceRow.appendChild(spaceBtn);
  keyboardEl.appendChild(spaceRow);

  // Alphabet view (revealed by tapping Shift on screen)
  const alphaEl = document.createElement('div');
  alphaEl.className = 'virtual-keyboard vk-alpha-view';
  alphaEl.dir = 'ltr';
  alphaEl.style.display = 'none';
  renderAlphaRows(alphaEl, onKeyPress, onBackspace);

  container.appendChild(keyboardEl);
  container.appendChild(alphaEl);

  return { desktopEl: keyboardEl, alphaEl };
}

function renderAlphaKeyboard(container, onKeyPress, onBackspace) {
  container.innerHTML = '';
  const keyboardEl = document.createElement('div');
  keyboardEl.className = 'virtual-keyboard vk-alpha';
  keyboardEl.dir = 'ltr';
  renderAlphaRows(keyboardEl, onKeyPress, onBackspace);
  container.appendChild(keyboardEl);
}

function renderAlphaRows(keyboardEl, onKeyPress, onBackspace) {
  MOBILE_KEYBOARD_ROWS.forEach((row, rowIndex) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'vk-row vk-arow';

    const isSpecialRow = rowIndex === MOBILE_KEYBOARD_ROWS.length - 2;

    row.forEach(ch => {
      const keyEl = document.createElement('button');
      keyEl.className = 'vk-key vk-mkey';
      const charEl = document.createElement('span');
      charEl.className = 'vk-char';
      charEl.textContent = ch;
      keyEl.appendChild(charEl);
      keyEl.addEventListener('mousedown', (e) => e.preventDefault());
          keyEl.addEventListener('click', (e) => {
        e.preventDefault();
        if (onKeyPress) onKeyPress(ch);
      });
      rowEl.appendChild(keyEl);
    });

    // Special row gets a wide Space key and Backspace after its letters
    if (isSpecialRow) {
      const spaceBtn = document.createElement('button');
      spaceBtn.className = 'vk-key vk-mkey vk-mkey-space';
      spaceBtn.innerHTML = '<span class="vk-char"> </span>';
      spaceBtn.addEventListener('mousedown', (e) => e.preventDefault());
          spaceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (onKeyPress) onKeyPress(' ');
      });
      rowEl.appendChild(spaceBtn);

      const bkspBtn = document.createElement('button');
      bkspBtn.className = 'vk-key vk-mkey vk-mkey-bksp';
      bkspBtn.innerHTML = '<span class="vk-char">⌫</span>';
      bkspBtn.addEventListener('mousedown', (e) => e.preventDefault());
      bkspBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (onBackspace) onBackspace();
      });
      rowEl.appendChild(bkspBtn);
    }

    keyboardEl.appendChild(rowEl);
  });
}
