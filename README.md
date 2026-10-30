# سنڌي ٽائپ ماسٽر — Sindhi Typing Master

**A typing test for Sindhi.** Practice typing the Sindhi script on real text pulled live from Sindhi Wikipedia, and track your speed, accuracy and the letters you miss most. Inspired by MonkeyType.

## Features

- **Four modes**
  - **وقت (Time):** type as much as you can in 15, 30, 60 or 120 seconds
  - **لفظ (Words):** finish 10, 25 or 50 words as fast as you can
  - **آزاد (Zen):** no timer, stop whenever you like
  - **جملو (Sentence):** type the displayed sentences exactly
- **Real Sindhi text:** a random article from [sd.wikipedia.org](https://sd.wikipedia.org), cleaned into typing-ready sentences, with built-in Sindhi sentences as a fallback when Wikipedia is unreachable.
- **Script check:** Latin letters are blocked with a warning; every keypress goes through one whitelist of Sindhi-Arabic characters.
- **On-screen keyboards:** a desktop layout that maps a QWERTY keyboard to Sindhi letters (MBSindhi-style; `=` is ڍ and `\` is ڊ), and a phone layout with every Sindhi letter in alphabet order (ا ب ٻ ڀ ت ٿ ٽ ٺ ...), using the Sindhi ٽ ڙ ڍ rather than the Urdu ٹ ڑ ڈ, plus a row of diacritics.
- **Stats:** live WPM and accuracy, a WPM-over-time graph drawn on canvas, and a heatmap of the characters you get wrong most often.
- **Personal bests and history:** saved in your browser's `localStorage`, per mode.
- **Sindh theme:** glass-style UI over a Sindh landscape background, with toggles for the photo and the blur.
- **Mobile-friendly:** responsive layout and a phone-sized keyboard.
- **Keyboard shortcuts:** **Enter** ends the test and **Esc** resets.

## Run it locally

You need [Node.js](https://nodejs.org/) (v18 or newer).

```bash
git clone https://github.com/mr-ans-2006/Sindhi-Typing-Master.git
cd Sindhi-Typing-Master
npm install
npm run dev
```

Then open http://localhost:5173.

To make a production build:

```bash
npm run build     # outputs to dist/
npm run preview   # serves dist/ locally
```

To check the on-screen keyboard after changing its layout:

```bash
npm run check:keyboard
```

## Tech stack

- **Vanilla JavaScript** (ES modules), with no framework
- **HTML5 Canvas** for the WPM graph
- **CSS3** (custom properties, flexbox, grid) for the glass theme and responsive layout
- **Vite** for the dev server and build
- **Wikipedia REST and Action APIs** for live text

## Project structure

```
index.html              page layout
main.js                 app state, input handling, mode switching
style.css, theme.css    layout and the Sindh glass theme
src/
  typing-engine.js      timing, WPM (correct chars / 5 per minute), accuracy
  text-fetcher.js       Wikipedia fetch, cleanup and fallback cascade
  sindhi-validator.js   whitelist of allowed Sindhi characters
  keyboard.js           desktop and phone on-screen keyboards
  display.js            rendering text, metrics and results
  wpm-graph.js          canvas WPM chart
  mistake-heatmap.js    per-character error heatmap
  personal-best.js      localStorage bests and history
```

## Author

Made by [Ali Nawaz](https://github.com/mr-ans-2006), a CS student from Tharparkar, Sindh.

## License

[MIT](LICENSE)
