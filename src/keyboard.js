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
export const KEYBOARD_LAYOUT = [
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
    { keycap: '=', sindhiChar: 'ڍ' }, // Ddhal (Sindhi; ڊ is on the '\\' key)
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
 * typed from this keyboard alone.
 *
 * The first five rows are the Sindhi alphabet in its own order
 * (ا ب ٻ ڀ ت ٿ ٽ ٺ پ ث ج ...), so every Sindhi letter sits where a
 * Sindhi reader expects it. These are the Sindhi letters, not the Urdu
 * look-alikes: ٽ (not ٹ), ڙ (not ڑ), ڍ (not ڈ). The digraphs جھ and
 * گھ are typed as the letter followed by ھ.
 *
 * Row 6 holds ء ي plus the other forms that show up in passages (both
 * yeh forms, ے, ہ, ۽ ۾, the hamza forms). Row 7 holds the rarer Arabic
 * forms and the diacritics (zabar, zer, pesh, shadd, sukun, khari
 * zabar), because built-in sentences like "مهمان نوازيءَ لاءِ" use them.
 *
 * Rows are 10 keys wide; the punctuation row holds 3 keys plus a wide
 * Space key and Backspace. Digit row covers years/numbers in text.
 * Run `npm run check:keyboard` after editing these rows.
 */
export const MOBILE_KEYBOARD_ROWS = [
  ['ا', 'ب', 'ٻ', 'ڀ', 'ت', 'ٿ', 'ٽ', 'ٺ', 'پ', 'ث'],
  ['ج', 'ڄ', 'ڃ', 'چ', 'ڇ', 'ح', 'خ', 'د', 'ڌ', 'ڏ'],
  ['ڊ', 'ڍ', 'ذ', 'ر', 'ڙ', 'ز', 'ژ', 'س', 'ش', 'ص'],
  ['ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ڦ', 'ق', 'ڪ', 'ک'],
  ['گ', 'ڳ', 'ڱ', 'ل', 'م', 'ن', 'ڻ', 'و', 'ه', 'ھ'],
  ['ء', 'ي', 'ی', 'ے', 'ہ', '۽', '۾', 'آ', 'ئ', 'ؤ'],
  ['أ', 'إ', 'ة', 'ى', '\u064E', '\u0650', '\u064F', '\u0651', '\u0652', '\u0670'],
  // Special row: punctuation + space + backspace (handled in render)
  ['۔', '،', '؟'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
];

// Diacritics are combining marks: on their own they render as a dotted
// circle, so their keys show them on a tatweel (ـَ). Tapping still types
// only the mark itself.
const DIACRITICS = new Set(['\u064E', '\u0650', '\u064F', '\u0651', '\u0652', '\u0670']);

function keyLabel(ch) {
  return DIACRITICS.has(ch) ? '\u0640' + ch : ch;
}

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
      charEl.textContent = keyLabel(ch);
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
