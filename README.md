# سنڌي ٽائپ ماسٽر — Sindhi TypeMaster

A feature-rich, minimalist web application for testing and improving your Sindhi typing speed and accuracy. Inspired by the clean aesthetics of MonkeyType, it fetches live Sindhi text from Wikipedia to ensure you are practicing on real, dynamically generated content.

## ✨ Features

- **🎯 Four Typing Modes**:
  - **وقت (Time)**: Type as much as you can before the timer runs out (15s, 30s, 60s, 120s).
  - **لفظ (Words)**: Race to complete a specific number of words (10, 25, 50).
  - **آزاد (Zen)**: Free practice with no timer. Stop whenever you want.
  - **جملو (Sentence)**: Type the exactly displayed sentences.
- **📡 Live Wikipedia Text**: Fetches real Sindhi text dynamically via the Wikipedia API. Features a resilient cascade fallback system to guarantee text is always available.
- **🛡️ Strict Script Enforcement**: Automatically blocks non-Sindhi characters (like English letters or digits) and shows a warning, ensuring pure Sindhi practice.
- **📊 Advanced Analytics**:
  - Live WPM (Words Per Minute) and Accuracy tracking.
  - **WPM Graph**: A beautifully rendered chart showing your speed over the duration of the test.
  - **Mistake Heatmap**: A color-coded grid highlighting exactly which characters you miss the most.
  - **Personal Bests**: Saves your high scores to your browser's local storage.
- **🎨 Minimalist UI**: Dark theme, beautiful Naskh typography (`Noto Sans Arabic`), and distraction-free design.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mr-ans-2006/Sindhi-Typing-Master.git
cd Sindhi-Typing-Master
```

2. Install the dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173/`

## 🛠️ Tech Stack
- Vanilla JavaScript (ES Modules)
- HTML5 & CSS3 (Custom properties, Flexbox, Grid)
- Vite (Build tool and dev server)
- HTML5 Canvas (For WPM graphs)

## 📝 License
This project is open-source and available under the MIT License.
