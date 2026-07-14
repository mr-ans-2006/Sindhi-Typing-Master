/**
 * SINDHI TYPEMASTER — Virtual Keyboard
 * =====================================
 * Physical QWERTY to Sindhi glyph mapping.
 * Matches Keyman MBSindhi layout visually.
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
    { keycap: 'Shift', sindhiChar: '⇧', isAction: true },
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
    { keycap: 'Shift', sindhiChar: '⇧', isAction: true }
  ]
];

export function initKeyboard(onKeyPress, onBackspace, onEnter) {
  const container = document.getElementById('virtual-keyboard-container');
  const toggleCb = document.getElementById('keyboard-toggle-cb');
  if (!container) return;

  // Render the keyboard grid
  renderKeyboard(container, onKeyPress, onBackspace, onEnter);

  // Wire toggle
  if (toggleCb) {
    toggleCb.addEventListener('change', (e) => {
      container.style.display = e.target.checked ? 'block' : 'none';
    });
    // Initial state
    container.style.display = toggleCb.checked ? 'block' : 'none';
  }
}

function renderKeyboard(container, onKeyPress, onBackspace, onEnter) {
  container.innerHTML = '';
  
  // The layout must render Left-to-Right to match physical keys
  const keyboardEl = document.createElement('div');
  keyboardEl.className = 'virtual-keyboard';
  keyboardEl.dir = 'ltr';

  KEYBOARD_LAYOUT.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'vk-row';
    
    row.forEach(key => {
      const keyEl = document.createElement('button');
      keyEl.className = 'vk-key';
      
      if (key.isAction) {
        keyEl.classList.add('vk-key-action');
        if (key.keycap === 'Enter') {
          keyEl.classList.add('vk-key-enter');
        }
        if (key.keycap === 'Bksp') {
          keyEl.classList.add('vk-key-bksp');
        }
        if (key.keycap === 'Shift') {
          keyEl.classList.add('vk-key-shift');
        }
        if (key.keycap === 'Tab') {
          keyEl.classList.add('vk-key-tab');
        }
        if (key.keycap === 'Caps') {
          keyEl.classList.add('vk-key-caps');
        }
      }

      // We dual-label: physical keycap + Sindhi glyph
      const labelEl = document.createElement('span');
      labelEl.className = 'vk-keycap';
      labelEl.textContent = key.keycap;
      
      const charEl = document.createElement('span');
      charEl.className = 'vk-char';
      charEl.textContent = key.sindhiChar;

      keyEl.appendChild(labelEl);
      keyEl.appendChild(charEl);

      // Add event listeners
      keyEl.addEventListener('click', (e) => {
        // Prevent default to avoid stealing focus from the hidden input
        e.preventDefault();
        
        if (key.isAction) {
          if (key.action === 'backspace' && onBackspace) {
            onBackspace();
          } else if (key.action === 'enter' && onEnter) {
            onEnter();
          }
        } else {
          if (onKeyPress) {
            onKeyPress(key.sindhiChar);
          }
        }
      });
      
      // Also prevent mousedown focus stealing
      keyEl.addEventListener('mousedown', (e) => e.preventDefault());

      rowEl.appendChild(keyEl);
    });
    
    keyboardEl.appendChild(rowEl);
  });
  
  // Add spacebar row manually
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

  container.appendChild(keyboardEl);
}
