# 💱 Курсы валют за неделю

PWA-приложение на Node.js + Express: показывает фиктивные курсы **USD / EUR / CNY** за неделю. Работает офлайн и устанавливается как приложение.

## 🚀 Запуск

```bash
npm install
npm start
```

Открыть 👉 `http://localhost:3000`

## 📁 Структура

```
├── server.js              # Express-сервер + API
└── public/
    ├── index.html         # Главная
    ├── about.html         # О проекте
    ├── styles.css
    ├── app.js             # Логика клиента + регистрация SW
    ├── manifest.json      # PWA-манифест
    ├── service-worker.js  # Офлайн-кеш
    └── icons/icon.png
```

## 🔌 Маршруты

| Метод | Путь                  | Описание                     |
|-------|-----------------------|------------------------------|
| GET   | `/`                   | Главная страница             |
| GET   | `/about`              | О проекте                    |
| GET   | `/api/status`         | Статус сервера (JSON)        |
| GET   | `/api/rates/:currency`| Курсы валюты (`USD`/`EUR`/`CNY`) |

**Пример ответа** `GET /api/rates/USD`:

```json
{
  "currency": "USD",
  "rates": [90, 91, 92, 93, 94, 95, 96],
  "avg": 93
}
```

**Ошибка** (неизвестная валюта) → `404`:

```json
{
  "error": "Currency not supported",
  "supported": ["USD", "EUR", "CNY"]
}
```

## 📱 PWA

- `manifest.json` — имя, иконки, цвета, режим `standalone`.
- `service-worker.js`:
  - **install** → кеширует статику
  - **activate** → чистит старый кеш
  - **fetch** → API: network-first, остальное: cache-first

### Проверка офлайн-режима

1. Открыть сайт и дождаться загрузки
2. DevTools → **Application → Service Workers** — SW активен ✅
3. Включить **Offline** и обновить страницу — всё работает 🎉