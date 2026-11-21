const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


const RATES = {
  USD: [90, 91, 92, 93, 94, 95, 96],
  EUR: [98, 99, 100, 101, 100, 99, 98],
  CNY: [12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0],
};


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});


app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


app.get('/api/rates/:currency', (req, res) => {

  const currency = String(req.params.currency).toUpperCase();
  const rates = RATES[currency];


  if (!rates) {
    return res.status(404).json({
      error: 'Currency not supported',
      currency,
      supported: Object.keys(RATES),
    });
  }

  const sum = rates.reduce((a, b) => a + b, 0);
  const avg = Math.round((sum / rates.length) * 100) / 100;


  res.json({ currency, rates, avg });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.listen(PORT, () => {
  console.log(`Сервер: http://localhost:${PORT}`);
});