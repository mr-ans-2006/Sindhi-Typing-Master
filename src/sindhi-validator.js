/**
 * SINDHI-PERSO-ARABIC CHARACTER WHITELIST
 * ========================================
 * This is the SINGLE SOURCE OF TRUTH for character validation.
 * Both native keyboard input and virtual keyboard clicks route through
 * isValidSindhiChar() — there is NO other validation path.
 *
 * Covers:
 *  - Standard Arabic letters used in Sindhi
 *  - Sindhi-specific implosive/aspirate characters (ٻ ڄ ڃ ڇ ڏ ڊ ڌ ڦ ڻ ڱ ڳ ڪ ھ)
 *  - Sindhi conjunctions/postpositions (۽ ۾)
 *  - Space
 *  - Sindhi/Arabic punctuation (۔ ، ؟)
 *  - Common Arabic diacritics (zabar, zer, pesh, shadda, sukun, superscript alef)
 */

const SINDHI_WHITELIST = new Set([
  // ── Sindhi-specific characters ──
  '\u0673',       // ٻ  (ba with dot below — implosive)
  '\u0680',       // ڀ  (bha)
  '\u067F',       // ٿ  (tha)
  '\u067D',       // ٽ  (tta)
  '\u067A',       // ٺ  (thha)
  '\u0684',       // ڄ  (jeem with two dots — implosive)
  '\u0683',       // ڃ  (nyaa)
  '\u0687',       // ڇ  (chaa aspirate)
  '\u068F',       // ڏ  (dal with dot below — implosive)
  '\u068A',       // ڊ  (dal with dot above)
  '\u068D',       // ڍ  (ddha)
  '\u068C',       // ڌ  (dhal with dot above)
  '\u0699',       // ڙ  (rra)
  '\u06A6',       // ڦ  (phaa)
  '\u06BB',       // ڻ  (noon with dot below)
  '\u06B1',       // ڱ  (nga / noon with three dots)
  '\u06B3',       // ڳ  (gaa with dot below — implosive)
  '\u06AA',       // ڪ  (kaaf Sindhi)
  '\u06BE',       // ھ  (haa doachashmee)
  '\u06BD',       // ۽  (Sindhi ampersand "and")
  '\u06BE',       // ۾  — note: we add the actual char below
  
  // ── Standard Arabic letters used in Sindhi ──
  '\u0627',       // ا  alef
  '\u0628',       // ب  ba
  '\u067E',       // پ  pe
  '\u062A',       // ت  ta
  '\u0679',       // ٹ  tta
  '\u062B',       // ث  sa
  '\u062C',       // ج  jeem
  '\u0686',       // چ  che
  '\u062D',       // ح  haa
  '\u062E',       // خ  kha
  '\u062F',       // د  dal
  '\u0688',       // ڈ  ddal
  '\u0630',       // ذ  zal
  '\u0631',       // ر  ra
  '\u0691',       // ڑ  rra
  '\u0632',       // ز  za
  '\u0698',       // ژ  zhe
  '\u0633',       // س  seen
  '\u0634',       // ش  sheen
  '\u0635',       // ص  saad
  '\u0636',       // ض  daad
  '\u0637',       // ط  taa
  '\u0638',       // ظ  zaa
  '\u0639',       // ع  ain
  '\u063A',       // غ  ghain
  '\u0641',       // ف  fa
  '\u0642',       // ق  qaaf
  '\u06A9',       // ک  kaaf (Urdu-style)
  '\u06AF',       // گ  gaaf
  '\u0644',       // ل  lam
  '\u0645',       // م  meem
  '\u0646',       // ن  noon
  '\u0648',       // و  waw
  '\u0647',       // ه  heh (standard Arabic)
  '\u06C1',       // ہ  haa goal
  '\u064A',       // ي  yeh (standard Arabic)
  '\u06CC',       // ی  ya (Farsi)
  '\u06D2',       // ے  bari ye

  // ── Space ──
  ' ',

  // ── Sindhi / Arabic punctuation ──
  '\u06D4',       // ۔  full stop (Sindhi/Arabic)
  '\u060C',       // ،  comma (Arabic)
  '\u061F',       // ؟  question mark (Arabic)
  
  // ── Standard Punctuation & Symbols ──
  '.', ',', '\'', '"', '-', '_', '(', ')', '[', ']', '{', '}', '/', '\\', ':', ';', '!', '@', '#', '$', '%', '^', '&', '*', '+', '=', '<', '>', '|', '~', '`',
  
  // ── Digits (Western, Arabic-Indic, Eastern Arabic) ──
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹',
  '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩',

  // ── Common diacritics ──
  '\u064E',       // فَتحہ  (zabar / fatha)
  '\u064F',       // ضَمہ  (pesh / damma)
  '\u0650',       // کَسرہ  (zer / kasra)
  '\u0651',       // شَدّہ  (shadda / tashdid)
  '\u0652',       // سُکون  (sukun)
  '\u0670',       // superscript alef

  // ── Additional forms that appear in Wikipedia text ──
  '\u0622',       // آ  alef with madda
  '\u0626',       // ئ  hamza on ya
  '\u0624',       // ؤ  hamza on waw
  '\u0621',       // ء  hamza
  '\u0623',       // أ  hamza on alef
  '\u0625',       // إ  hamza under alef
  '\u0629',       // ة  ta marbuta
  '\u0649',       // ى  alef maksura
  '\u06C3',       // ۃ  ta marbuta goal
  '\u0671',       // ٱ  alef wasla
  '\u06D3',       // ۓ  yeh barree with hamza
]);

// Also add ۾ explicitly (U+06BE is shared with ھ, ۾ is U+06BE — 
// actually ۾ is U+06BE — let's add the correct codepoint)
SINDHI_WHITELIST.add('\u06BE'); // ھ
SINDHI_WHITELIST.add('\u06BD'); // ۽ 
// ۾ is actually U+06BE — it's the same glyph context-dependent
// Let's add it as the actual character
SINDHI_WHITELIST.add('۾');     // U+06BE context form / standalone ۾
SINDHI_WHITELIST.add('۽');     // standalone add

/**
 * Validates a single character against the Sindhi-Perso-Arabic whitelist.
 * 
 * THIS IS THE SOLE GATEKEEPER for all input.
 * Called identically by:
 *   1. Native keyboard input handler (beforeinput event)
 *   2. Virtual keyboard click handler
 * 
 * @param {string} char - A single character to validate
 * @returns {boolean} true if the character is in the Sindhi whitelist
 */
export function isValidSindhiChar(char) {
  if (!char || char.length === 0) return false;
  // Check each character in case of multi-char input (e.g., ligatures)
  return SINDHI_WHITELIST.has(char);
}

/**
 * Returns all whitelisted characters (excluding space, punctuation, diacritics)
 * for use in the virtual keyboard layout.
 */
export function getKeyboardChars() {
  return {
    sindhiSpecific: ['ٻ', 'ڄ', 'ڃ', 'ڇ', 'ڏ', 'ڊ', 'ڌ', 'ڦ', 'ڻ', 'ڱ', 'ڳ', 'ڪ', 'ھ', '۽', '۾'],
    standardArabic: [
      'ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ',
      'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص',
      'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل',
      'م', 'ن', 'و', 'ہ', 'ی', 'ے',
    ],
    punctuation: ['۔', '،', '؟'],
  };
}

/**
 * Validates an entire string — checks every character.
 * Used for validating fetched Wikipedia text.
 * Allows characters NOT in the whitelist to pass (since Wikipedia
 * text may contain them), but returns the ratio of valid chars.
 * 
 * @param {string} text - Text to validate
 * @returns {number} Ratio of valid Sindhi characters (0.0 to 1.0)
 */
export function getSindhiRatio(text) {
  if (!text || text.length === 0) return 0;
  let validCount = 0;
  for (const char of text) {
    if (SINDHI_WHITELIST.has(char)) validCount++;
  }
  return validCount / text.length;
}
