/**
 * Backend-only Express API server for Tro Guide.
 * Set FRONTEND_ORIGIN env to the deployed static frontend domain so CORS stays locked down.
 */
const express = require('express');
const cors = require('cors');
const { PORT, FRONTEND_ORIGIN } = require('./config');
require('./db');

const bookingsRouter = require('./routes/bookings');
const guidesRouter = require('./routes/guides');

const app = express();

const corsOptions = {
  origin: FRONTEND_ORIGIN === '*' ? '*' : FRONTEND_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};
// Use origin: '*' while developing locally, tighten via FRONTEND_ORIGIN when deploying.
app.use(cors(corsOptions));
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
