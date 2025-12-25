// SPDX-License-Identifier: MIT
// See LICENSE for details.

(() => {
  const canvas = document.getElementById('ebbinghaus2');
  canvas.width = 700;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('ebbinghaus2-slider');

  const padding = 70;
  const CURVE_COLOR = 'red';
  const AXIS_COLOR = window.getComputedStyle(document.body).color;
  const DECAY_RATE = 0.04;
  const TIME_SCALE = 10;
  const DOT_RADIUS = 5;

  const decayFunction = (x, k, s) => s * Math.exp(-k * x);

  const drawPlot = (recallTime) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Axes
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width, canvas.height - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = AXIS_COLOR;
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('time →', canvas.width - padding / 2, canvas.height - padding / 2);
    ctx.save();
    ctx.translate(padding - 20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('strength of memory', 0, 0);
    ctx.restore();

    const plotW = canvas.width - padding;
    const plotH = canvas.height - 2 * padding;

    const drawCurve = (start_x_norm, end_x_norm, start_strength, lineStyle, changeDecay = false) => {
      ctx.beginPath();
      ctx.strokeStyle = lineStyle;
      ctx.lineWidth = 4;

      const decayConstant = DECAY_RATE * TIME_SCALE;
      const start_x_canvas = padding + start_x_norm * plotW / TIME_SCALE;

      let memoryStrength = 0;

      for (let x_norm = start_x_norm; x_norm <= end_x_norm; x_norm += (TIME_SCALE / plotW)) {
        const time_elapsed = x_norm - start_x_norm;
        const decay = changeDecay ? decayConstant / (1 + start_x_norm * 0.7) : decayConstant;
        memoryStrength = decayFunction(time_elapsed, decay, start_strength);

        const x_canvas = padding + x_norm * plotW / TIME_SCALE;
        const y_canvas = canvas.height - padding - plotH * memoryStrength;

        if (x_norm === start_x_norm) {
          ctx.moveTo(x_canvas, y_canvas);
        } else {
          ctx.lineTo(x_canvas, y_canvas);
        }

        if (x_norm >= TIME_SCALE) break;
      }
      ctx.stroke();
      return memoryStrength;
    };

    const strengthAtRecall = drawCurve(0, recallTime, 1, CURVE_COLOR);
    drawCurve(recallTime, TIME_SCALE, 1, CURVE_COLOR, true);
    drawCurve(recallTime, TIME_SCALE, strengthAtRecall, 'rgba(128, 128, 128, 0.5)');

    // Circle
    const recall_x_canvas = padding + recallTime * plotW / TIME_SCALE;
    const recall_y_canvas = canvas.height - padding - plotH * strengthAtRecall;
    ctx.fillStyle = CURVE_COLOR;
    ctx.beginPath();
    ctx.arc(recall_x_canvas, recall_y_canvas, DOT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();

    // Connecting line
    const peak_y_canvas = canvas.height - padding - plotH * 1;
    ctx.strokeStyle = CURVE_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(recall_x_canvas, recall_y_canvas);
    ctx.lineTo(recall_x_canvas, peak_y_canvas);
    ctx.stroke();

  };

  slider.addEventListener('input', () => { drawPlot(parseFloat(slider.value)); });
  drawPlot(parseFloat(slider.value));
})();
