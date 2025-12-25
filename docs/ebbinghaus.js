// SPDX-License-Identifier: MIT
// See LICENSE for details.

(() => {
  function plot(id, f) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    const padding = 70;
    canvas.width = 700;
    canvas.height = 300;
    ctx.strokeStyle = ctx.fillStyle = window.getComputedStyle(document.body).color;
    ctx.lineWidth = 1.5;
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width, canvas.height - padding);
    ctx.stroke();

    ctx.fillText('time →', canvas.width - padding / 2, canvas.height - padding / 2);

    ctx.save();
    ctx.translate(padding / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('strength of memory', 0, 0);
    ctx.restore();

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;

    const fnorm = x => canvas.height - padding - f(x) * (canvas.height - 2 * padding);
    ctx.moveTo(padding, fnorm(0));
    for (let i = 1; i < canvas.width - padding; i++) {
      ctx.lineTo(padding + i, fnorm(i));
    }
    ctx.stroke();
  }
  const slider = document.getElementById('ebbinghaus-slider');
  const plotFunc = () => plot("ebbinghaus", x => Math.exp(parseFloat(slider.value) * -x));
  slider.addEventListener('input', plotFunc);
  plotFunc();
})();
