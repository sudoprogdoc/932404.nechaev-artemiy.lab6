const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.controls button');

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    loadRates(btn.dataset.cur);
  });
});

async function loadRates(currency) {
  resultEl.className = 'card';
  resultEl.textContent = 'Загрузка…';
  try {
    const resp = await fetch(`/api/rates/${encodeURIComponent(currency)}`);
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      resultEl.className = 'card error';
      resultEl.textContent = `Ошибка ${resp.status}: ${err.error || 'не удалось загрузить'}`;
      return;
    }
    const data = await resp.json();
    renderRates(data);
  } catch (e) {
    resultEl.className = 'card error';
    resultEl.textContent = 'Сеть недоступна, а кеша нет.';
  }
}

function renderRates({ currency, rates, avg }) {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const max = Math.max(...rates);
  const min = Math.min(...rates);
  const span = max - min || 1;

  let bars = '';
  rates.forEach((r, i) => {
    const h = 30 + ((r - min) / span) * 70; 
    bars += `<div class="bar" style="height:${h}%">
      <span class="val">${r}</span>
      <span class="day">${days[i]}</span>
    </div>`;
  });

  resultEl.innerHTML = `
    <h2 style="margin:0 0 8px">${currency}</h2>
    <div class="chart">${bars}</div>
    <p class="avg">Средний курс за неделю: <strong>${avg}</strong></p>
  `;
}


loadRates('USD');


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log('SW зарегистрирован, scope:', reg.scope))
      .catch((err) => console.warn('SW не зарегистрирован:', err));
  });
}