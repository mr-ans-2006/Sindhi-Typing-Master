import { getSindhiRatio } from './sindhi-validator.js';

/**
 * Multi-source Sindhi text fetcher with cascade strategy:
 *  1. Wikipedia REST API (summaries)
 *  2. Wikipedia Action API (TextExtracts)
 *  3. Hardcoded Sindhi corpus (always available)
 *
 * All fetched texts are cached in a circular buffer.
 */

// ── Hardcoded fallback corpus (15 curated sentences) ──
const FALLBACK_TEXTS = [
  'سنڌ جي ثقافت تمام پراڻي ۽ مالا مال آهي۔',
  'سنڌي ٻولي هڪ قديم ٻولي آهي جنهن جو پنهنجو ادب آهي۔',
  'موهن جو دڙو سنڌ جي تاريخ جو هڪ اهم حصو آهي۔',
  'سنڌ ۾ مختلف قسم جا ماڻهو رهن ٿا جيڪي مختلف ٻوليون ڳالهائين ٿا۔',
  'سنڌي ماڻهو مهمان نوازيءَ لاءِ مشهور آهن۔',
  'سنڌو درياهه سنڌ جي زندگي جو ساهه آهي۔',
  'شاهه عبداللطيف ڀٽائي سنڌ جو عظيم شاعر هو۔',
  'سنڌ جا ماڻهو پنهنجي روايتن ۽ رسمن تي فخر ڪن ٿا۔',
  'اسلام سنڌ ۾ محمد بن قاسم ذريعي آيو۔',
  'ٺٽو هڪ تاريخي شهر آهي جيڪو سنڌ ۾ واقع آهي۔',
  'سنڌي ادب ۾ شاعري جو هڪ خاص مقام آهي۔',
  'تعليم هر انسان جو بنيادي حق آهي۔',
  'ڪتاب پڙهڻ سان علم ۾ اضافو ٿيندو آهي۔',
  'سنڌ جي ماڻهن جي ثقافت ۾ موسيقي جو اهم ڪردار آهي۔',
  'سنڌي ٻولي ۾ لکڻ ۽ پڙهڻ هر سنڌي جي ذميواري آهي۔',
];

// ── Client-side text cache (circular buffer) ──
const TEXT_CACHE = [];
const MAX_CACHE = 8;
let cacheIndex = 0;
let lastUsedFallbackIndex = -1;

/**
 * Fetch with timeout using AbortController.
 */
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Clean and process raw text into typing-test-ready sentences.
 * - Strips parenthetical Latin content like (انگريزي: English Text)
 * - Splits on Sindhi sentence-ending punctuation
 * - Picks sentences totaling ~15-60 words based on mode needs
 */
function processText(rawText, targetWordCount = 25) {
  if (!rawText || rawText.trim().length === 0) return null;

  // Strip parenthetical content containing Latin characters
  let cleaned = rawText.replace(/\([^)]*[a-zA-Z][^)]*\)/g, '');
  
  // Remove any remaining Latin characters and digits
  cleaned = cleaned.replace(/[a-zA-Z0-9]/g, '');
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Split on sentence-ending punctuation (۔ or .)
  const sentences = cleaned
    .split(/[۔.]/)
    .map(s => s.trim())
    .filter(s => s.length > 3); // Remove tiny fragments

  if (sentences.length === 0) return null;

  // Pick sentences until we reach target word count
  let result = '';
  let wordCount = 0;

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).filter(w => w.length > 0);
    if (wordCount + words.length > targetWordCount * 1.5 && wordCount > 0) break;
    
    result += (result ? ' ' : '') + sentence + '۔';
    wordCount += words.length;
    
    if (wordCount >= targetWordCount) break;
  }

  // Validate that the result is mostly Sindhi
  if (getSindhiRatio(result) < 0.7) return null;
  if (wordCount < 5) return null;

  return result.trim();
}

/**
 * Source 1: Wikipedia REST API
 * Fetches a random article summary.
 */
async function fetchFromRestApi(targetWords = 25) {
  const url = 'https://sd.wikipedia.org/api/rest_v1/page/random/summary';
  const data = await fetchWithTimeout(url);
  
  if (!data.extract) throw new Error('No extract field');
  
  const processed = processText(data.extract, targetWords);
  if (!processed) throw new Error('Text not suitable');
  
  return { text: processed, source: 'ويڪيپيڊيا' };
}

/**
 * Source 2: Wikipedia Action API with TextExtracts
 * Uses a different random selection mechanism for variety.
 */
async function fetchFromActionApi(targetWords = 25) {
  const url = 'https://sd.wikipedia.org/w/api.php?' + new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'random',
    grnnamespace: '0',
    prop: 'extracts',
    explaintext: 'true',
    exsentences: '5',
    grnlimit: '1',
    origin: '*',
  });

  const data = await fetchWithTimeout(url);
  
  if (!data.query || !data.query.pages) throw new Error('No pages returned');
  
  // Extract text from the first (only) page
  const pages = Object.values(data.query.pages);
  if (pages.length === 0 || !pages[0].extract) throw new Error('No extract');
  
  const processed = processText(pages[0].extract, targetWords);
  if (!processed) throw new Error('Text not suitable');
  
  return { text: processed, source: 'ويڪيپيڊيا' };
}

/**
 * Source 3: Hardcoded fallback corpus
 * Always succeeds. Picks a random sentence different from last used.
 */
function getFromFallback() {
  let index;
  do {
    index = Math.floor(Math.random() * FALLBACK_TEXTS.length);
  } while (index === lastUsedFallbackIndex && FALLBACK_TEXTS.length > 1);
  
  lastUsedFallbackIndex = index;
  return { text: FALLBACK_TEXTS[index], source: 'مقامي ذخيرو' };
}

/**
 * Add text to the circular cache buffer.
 */
function addToCache(entry) {
  if (TEXT_CACHE.length < MAX_CACHE) {
    TEXT_CACHE.push(entry);
  } else {
    TEXT_CACHE[cacheIndex % MAX_CACHE] = entry;
  }
  cacheIndex++;
}

/**
 * Try to get an unused text from cache.
 */
function getFromCache() {
  if (TEXT_CACHE.length === 0) return null;
  // Pop the last item from cache
  return TEXT_CACHE.pop();
}

/**
 * Main entry point: Get next Sindhi text for the typing test.
 * Tries sources in cascade order, uses cache when available.
 *
 * @param {object} options
 * @param {string} options.mode - 'time' | 'words' | 'zen' | 'sentence'
 * @param {number} options.value - duration in seconds or word count
 * @returns {Promise<{text: string, source: string}>}
 */
export async function getNextText({ mode = 'time', value = 60 } = {}) {
  // Determine target word count based on mode
  let targetWords;
  switch (mode) {
    case 'time':
      // Estimate ~40 WPM for Sindhi, provide enough text
      targetWords = Math.ceil((value / 60) * 50);
      break;
    case 'words':
      targetWords = value;
      break;
    case 'zen':
      targetWords = 30;
      break;
    case 'sentence':
      targetWords = 20;
      break;
    default:
      targetWords = 25;
  }

  // Try cache first
  const cached = getFromCache();
  if (cached) {
    // Refill cache in background (fire and forget)
    fetchNewText(targetWords).catch(() => {});
    return cached;
  }

  // Cascade through sources
  return fetchNewText(targetWords);
}

/**
 * Fetch new text through the source cascade.
 * Tries Source 1, then Source 2, then falls back to hardcoded.
 */
async function fetchNewText(targetWords) {
  // Source 1: REST API (2 retries)
  for (let i = 0; i < 2; i++) {
    try {
      const result = await fetchFromRestApi(targetWords);
      addToCache({ ...result }); // Cache a copy
      return result;
    } catch (e) {
      // Continue to next attempt or source
    }
  }

  // Source 2: Action API (2 retries)
  for (let i = 0; i < 2; i++) {
    try {
      const result = await fetchFromActionApi(targetWords);
      addToCache({ ...result }); // Cache a copy
      return result;
    } catch (e) {
      // Continue to next attempt or source
    }
  }

  // Source 3: Hardcoded fallback (always succeeds)
  return getFromFallback();
}

/**
 * Prefill the cache with multiple texts in the background.
 * Called on app initialization.
 */
export async function prefillCache() {
  const promises = [];
  for (let i = 0; i < 3; i++) {
    promises.push(
      fetchNewText(25).then(result => addToCache(result)).catch(() => {})
    );
  }
  await Promise.allSettled(promises);
}
