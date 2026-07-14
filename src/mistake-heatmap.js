/**
 * Mistake Heatmap — shows which Sindhi characters the user gets wrong most.
 * Renders a grid of character cells with color-coded error frequency.
 */

import { getKeyboardChars } from './sindhi-validator.js';

/**
 * Render the mistake heatmap into a container element.
 * @param {HTMLElement} container - The DOM element to render into
 * @param {object} mistakeMap - Map of character → error count
 * @param {string} targetText - The original target text (to know which chars appeared)
 */
export function renderMistakeHeatmap(container, mistakeMap, targetText) {
  container.innerHTML = '';

  if (!mistakeMap || Object.keys(mistakeMap).length === 0) {
    container.innerHTML = '<p class="heatmap-empty">ڪا به غلطي ناهي!</p>';
    return;
  }

  // Get all unique characters from the target text (excluding spaces)
  const charsInText = new Set();
  for (const ch of targetText) {
    if (ch !== ' ' && ch.trim()) charsInText.add(ch);
  }

  // Find max errors for color scaling
  const maxErrors = Math.max(...Object.values(mistakeMap), 1);

  // Create the title
  const title = document.createElement('div');
  title.className = 'heatmap-title';
  title.textContent = 'غلطين جو نقشو';
  container.appendChild(title);

  // Create the grid
  const grid = document.createElement('div');
  grid.className = 'heatmap-grid';

  // Show all characters that appeared in the text
  for (const char of charsInText) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.textContent = char;

    const errors = mistakeMap[char] || 0;
    
    if (errors === 0) {
      // No errors — green
      cell.style.backgroundColor = 'rgba(0, 230, 118, 0.15)';
      cell.style.borderColor = 'rgba(0, 230, 118, 0.3)';
      cell.style.color = '#00e676';
    } else {
      // Color from amber to red based on error ratio
      const ratio = errors / maxErrors;
      
      if (ratio < 0.5) {
        // Amber zone
        const intensity = 0.15 + ratio * 0.3;
        cell.style.backgroundColor = `rgba(255, 215, 64, ${intensity})`;
        cell.style.borderColor = `rgba(255, 215, 64, ${intensity + 0.15})`;
        cell.style.color = '#ffd740';
      } else {
        // Red zone
        const intensity = 0.15 + ratio * 0.35;
        cell.style.backgroundColor = `rgba(255, 82, 82, ${intensity})`;
        cell.style.borderColor = `rgba(255, 82, 82, ${intensity + 0.15})`;
        cell.style.color = '#ff5252';
      }
    }

    // Tooltip with error count
    cell.title = `${char}: ${errors} ${errors === 1 ? 'غلطي' : 'غلطيون'}`;
    
    // Add error count badge for cells with errors
    if (errors > 0) {
      const badge = document.createElement('span');
      badge.className = 'heatmap-badge';
      badge.textContent = errors;
      cell.appendChild(badge);
    }

    grid.appendChild(cell);
  }

  container.appendChild(grid);

  // Legend
  const legend = document.createElement('div');
  legend.className = 'heatmap-legend';
  legend.innerHTML = `
    <span class="legend-item">
      <span class="legend-color" style="background: rgba(0, 230, 118, 0.3)"></span>
      صحيح
    </span>
    <span class="legend-item">
      <span class="legend-color" style="background: rgba(255, 215, 64, 0.4)"></span>
      ٿوريون غلطيون
    </span>
    <span class="legend-item">
      <span class="legend-color" style="background: rgba(255, 82, 82, 0.5)"></span>
      گھڻيون غلطيون
    </span>
  `;
  container.appendChild(legend);
}
