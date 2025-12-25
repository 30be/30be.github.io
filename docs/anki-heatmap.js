(() => {
  const css = `
#anki-heatmap {
    display: grid;
    grid-template-rows: repeat(7, 20px); /* 7 days as rows */
    grid-auto-flow: column; /* Horizontal flow */
    gap: 2px;
    padding: 0 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
}
#anki-heatmap > :last-child {
  border: 2px solid black;
}
.day-cell {
    width: 20px;
    height: 20px;
    background-color: #ebedf0;
    border-radius: 2px;
}
.level-0 { background-color: #ebedf0; }
.level-1 { background-color: #9be9a8; }
.level-2 { background-color: #40c463; }
.level-3 { background-color: #30a14e; }
.level-4 { background-color: #216e39; }
`;
  document.head.appendChild(document.createElement('style')).textContent = css;

  const HEATMAP = document.getElementById('anki-heatmap');
  const NUM_DAYS = 52 * 7; // 52 weeks
  const SECONDS_PER_DAY = 86400;

  async function loadHeatmapData() {
    try {
      const response = await fetch('heatmap.json');
      const { start_epoch, counts } = await response.json();
      renderHeatmap(start_epoch, counts);
    } catch (error) {
      HEATMAP.innerHTML = 'Error loading heatmap data:' + error;
    }
  }

  function renderHeatmap(startEpoch, data) {
    HEATMAP.innerHTML = '';

    // Alignment
    const firstDayOfWeek = (new Date()).getUTCDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const cell = document.createElement('div');
      cell.className = 'day-cell level-0';
      cell.style.visibility = 'hidden';
      HEATMAP.appendChild(cell);
    }

    const days_no_data = Math.ceil((Date.now() / 1000 - (startEpoch + data.length * SECONDS_PER_DAY)) / SECONDS_PER_DAY)
    const cells_no_data = Array(days_no_data).fill(0)
    const displayData = Array(NUM_DAYS).fill(0).concat(data, cells_no_data).slice(-NUM_DAYS);

    // It is messy and not beautiful and should be rewritten
    startEpoch = (Date.now() - (NUM_DAYS - 1) * SECONDS_PER_DAY * 1000) / 1000

    for (let i = 0; i < displayData.length; i++) {
      const date = new Date((startEpoch + i * SECONDS_PER_DAY) * 1000);
      const level = (displayData[i] == 0) ? 0 :
        (displayData[i] <= 10) ? 1 :
          (displayData[i] <= 100) ? 2 :
            (displayData[i] <= 400) ? 3 : 4;

      const cell = document.createElement('div');
      cell.title = `${date.toISOString().split('T')[0]}: ${displayData[i]} reviews`;
      cell.className = `day-cell level-${level}`;
      HEATMAP.appendChild(cell);
    }
    HEATMAP.scrollLeft = HEATMAP.scrollWidth;
  }

  loadHeatmapData();
})();
