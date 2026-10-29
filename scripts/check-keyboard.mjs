// Checks that every character of the built-in fallback sentences can be
// typed using only the on-screen phone keyboard, and that every Sindhi
// letter is on it. Also reports which Sindhi letters the desktop QWERTY
// guide shows without Shift.
//
// Run with: npm run check:keyboard
import { MOBILE_KEYBOARD_ROWS, KEYBOARD_LAYOUT } from '../src/keyboard.js';
import { FALLBACK_TEXTS } from '../src/text-fetcher.js';
import { isValidSindhiChar } from '../src/sindhi-validator.js';

const hex = (ch) => 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');

// The Sindhi alphabet (جھ and گھ are typed as ج/گ + ھ).
const SINDHI_LETTERS = [...
  'ا ب ٻ ڀ ت ٿ ٽ ٺ پ ث ج ڄ ڃ چ ڇ ح خ د ڌ ڏ ڊ ڍ ذ ر ڙ ز ژ س ش ص ض ط ظ ع غ ف ڦ ق ڪ ک گ ڳ ڱ ل م ن ڻ و ه ھ ء ي'
    .replace(/ /g, '')];

const mobile = new Set(MOBILE_KEYBOARD_ROWS.flat());
mobile.add(' '); // Space key

let failed = false;

// 1. Every key must be a character the validator accepts.
for (const ch of mobile) {
  if (!isValidSindhiChar(ch)) {
    console.error(`✗ mobile key ${ch} (${hex(ch)}) is rejected by the validator`);
    failed = true;
  }
}

// 2. Every built-in sentence must be typeable on the phone keyboard.
FALLBACK_TEXTS.forEach((text, i) => {
  const missing = [...new Set([...text].filter((ch) => !mobile.has(ch)))];
  if (missing.length) {
    failed = true;
    console.error(`✗ sentence ${i + 1} needs keys not on the phone keyboard: ` +
      missing.map((ch) => `${ch} (${hex(ch)})`).join(', '));
  }
});

// 3. Every Sindhi letter must be on the phone keyboard.
const missingLetters = SINDHI_LETTERS.filter((ch) => !mobile.has(ch));
if (missingLetters.length) {
  failed = true;
  console.error('✗ Sindhi letters missing from the phone keyboard: ' +
    missingLetters.map((ch) => `${ch} (${hex(ch)})`).join(', '));
}

// 4. No duplicate keys.
const all = MOBILE_KEYBOARD_ROWS.flat();
const dupes = all.filter((ch, i) => all.indexOf(ch) !== i);
if (dupes.length) {
  failed = true;
  console.error('✗ duplicate phone keys: ' + dupes.join(' '));
}

// 5. Desktop guide (information only: the on-screen Shift key opens the
//    full alphabet view, which uses the same rows as the phone keyboard).
const desktop = new Set(KEYBOARD_LAYOUT.flat().filter((k) => !k.isAction).map((k) => k.sindhiChar));
const notOnDesktop = SINDHI_LETTERS.filter((ch) => !desktop.has(ch));
console.log(`Desktop QWERTY guide shows ${SINDHI_LETTERS.length - notOnDesktop.length}/${SINDHI_LETTERS.length} Sindhi letters without Shift.`);
if (notOnDesktop.length) {
  console.log('  Reachable through the on-screen Shift (alphabet) view: ' + notOnDesktop.join(' '));
}

if (failed) {
  process.exit(1);
}
console.log(`✓ All ${FALLBACK_TEXTS.length} built-in sentences and all ${SINDHI_LETTERS.length} Sindhi letters can be typed on the phone keyboard (${all.length} keys + Space).`);
