/**
 * WPM Graph — renders a smooth line chart on HTML5 Canvas.
 * No external chart library — pure Canvas 2D API.
 */

/**
 * Render the WPM-over-time graph.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on
 * @param {Array<{time: number, wpm: number}>} wpmHistory - WPM samples
 */
export function renderWpmGraph(canvas, wpmHistory) {
  if (!canvas || !wpmHistory || wpmHistory.length < 2) {
    renderEmptyState(canvas);
    return;
  }

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // Set canvas resolution for crisp rendering
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 30, right: 20, bottom: 35, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Calculate bounds
  const maxTime = Math.max(...wpmHistory.map(p => p.time));
  const maxWpm = Math.max(...wpmHistory.map(p => p.wpm), 10); // minimum 10 WPM scale
  const avgWpm = wpmHistory.reduce((sum, p) => sum + p.wpm, 0) / wpmHistory.length;

  // ── Grid lines ──
  ctx.strokeStyle = 'rgba(85, 85, 119, 0.2)';
  ctx.lineWidth = 1;
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const y = padding.top + (chartH * i) / yTicks;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    // Y-axis labels
    const wpmLabel = Math.round(maxWpm * (1 - i / yTicks));
    ctx.fillStyle = '#555577';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(wpmLabel.toString(), padding.left - 8, y + 4);
  }

  // X-axis labels
  const xTicks = Math.min(maxTime, 6);
  for (let i = 0; i <= xTicks; i++) {
    const x = padding.left + (chartW * i) / xTicks;
    const timeLabel = Math.round((maxTime * i) / xTicks);
    ctx.fillStyle = '#555577';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${timeLabel}s`, x, height - padding.bottom + 20);
  }

  // ── Convert data points to canvas coordinates ──
  const points = wpmHistory.map(p => ({
    x: padding.left + (p.time / maxTime) * chartW,
    y: padding.top + chartH - (p.wpm / maxWpm) * chartH,
  }));

  // ── Gradient fill under the line ──
  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
  gradient.addColorStop(0, 'rgba(0, 230, 118, 0.25)');
  gradient.addColorStop(1, 'rgba(0, 230, 118, 0.02)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, padding.top + chartH); // bottom-left
  
  // Draw smooth curve using bezier
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      ctx.lineTo(points[i].x, points[i].y);
    } else {
      const prev = points[i - 1];
      const cp1x = prev.x + (points[i].x - prev.x) * 0.4;
      const cp1y = prev.y;
      const cp2x = prev.x + (points[i].x - prev.x) * 0.6;
      const cp2y = points[i].y;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i].x, points[i].y);
    }
  }
  
  ctx.lineTo(points[points.length - 1].x, padding.top + chartH); // bottom-right
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // ── Main line ──
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      ctx.moveTo(points[i].x, points[i].y);
    } else {
      const prev = points[i - 1];
      const cp1x = prev.x + (points[i].x - prev.x) * 0.4;
      const cp1y = prev.y;
      const cp2x = prev.x + (points[i].x - prev.x) * 0.6;
      const cp2y = points[i].y;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i].x, points[i].y);
    }
  }
  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // ── Data points ──
  points.forEach((p, i) => {
    const isAboveAvg = wpmHistory[i].wpm >= avgWpm;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = isAboveAvg ? '#00e676' : '#ffd740';
    ctx.fill();
  });

  // ── Average line ──
  const avgY = padding.top + chartH - (avgWpm / maxWpm) * chartH;
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(padding.left, avgY);
  ctx.lineTo(width - padding.right, avgY);
  ctx.strokeStyle = 'rgba(255, 215, 64, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  // Average label
  ctx.fillStyle = '#ffd740';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`avg: ${Math.round(avgWpm)}`, width - padding.right - 60, avgY - 6);

  // ── Title ──
  ctx.fillStyle = '#8888aa';
  ctx.font = '12px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('WPM over time', padding.left, 16);
}

/**
 * Render an empty state when there's not enough data.
 */
function renderEmptyState(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  ctx.fillStyle = '#555577';
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Not enough data for graph', rect.width / 2, rect.height / 2);
}
