/**
 * Backend-only Express API server for Tro Guide.
 */
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');
require('./db');

const bookingsRouter = require('./routes/bookings');
const guidesRouter = require('./routes/guides');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8888',
  'https://tro-guide.netlify.app',
  'https://troguide.vn',
  'https://www.troguide.vn'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
  })
);
app.use(express.json());

app.use('/api/bookings', bookingsRouter);
app.use('/api/guides', guidesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Tro Guide API is running', docs: 'Use /api/bookings or /api/guides' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Lỗi không xác định' });
});

app.listen(PORT, () => {
  console.log(`Tro Guide server đang chạy tại http://localhost:${PORT}`);
});
