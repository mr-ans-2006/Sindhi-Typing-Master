# سنڌي ٽائپ ماسٽر — Sindhi Typing Master

**A typing test for Sindhi.** Practice typing in the Sindhi script on real text pulled live from Sindhi Wikipedia, and track your speed, accuracy and the letters you miss most. It's inspired by the clean, distraction-free feel of MonkeyType.

<!-- Add a screenshot here: ![Sindhi Typing Master](screenshot.png) -->

## Features

- **Four modes**
  - **وقت (Time):** type as much as you can in 15, 30, 60 or 120 seconds
  - **لفظ (Words):** finish 10, 25 or 50 words as fast as you can
  - **آزاد (Zen):** no timer, stop whenever you like
  - **جملو (Sentence):** type the displayed sentences exactly
- **Real Sindhi text:** a random article from [sd.wikipedia.org](https://sd.wikipedia.org) is cleaned into typing-ready sentences. If the Wikipedia REST API fails it falls back to the Action API, and then to a built-in set of Sindhi sentences, so there's always something to type.
- **Script check:** Latin letters are blocked with a warning, so you're actually practising Sindhi. Every keypress goes through one whitelist of Sindhi-Arabic characters.
- **On-screen keyboards:** a desktop layout that maps a physical QWERTY keyboard to Sindhi letters (MBSindhi-style), and an alphabet layout that fits a phone screen.
- **Stats:** live WPM and accuracy, a WPM-over-time graph drawn on canvas, and a heatmap of the characters you get wrong most often.
- **Personal bests and history:** saved in your browser's `localStorage`, per mode.
- **Sindh theme:** glass-style UI over a Sindh landscape background, with toggles for the photo and the blur. Uses Noto Sans Arabic for Sindhi text.
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

## Deploy to GitHub Pages (optional)

It's a fully static site with no backend, so GitHub Pages can host it for free. `vite.config.js` already sets `base: './'`, so the build works from a project URL like `https://mr-ans-2006.github.io/Sindhi-Typing-Master/`.

The simplest way is a GitHub Actions workflow. Go to **Settings → Pages → Source: GitHub Actions** and add `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

If you only want to publish on demand, keep just the `workflow_dispatch:` trigger and run it from the Actions tab.

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
