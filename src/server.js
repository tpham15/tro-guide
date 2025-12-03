const path = require('path');
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');
require('./db');

const bookingsRouter = require('./routes/bookings');
const guidesRouter = require('./routes/guides');

const app = express();

app.use(cors());
app.use(express.json());

const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.use('/api/bookings', bookingsRouter);
app.use('/api/guides', guidesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Lỗi không xác định' });
});

app.listen(PORT, () => {
  console.log(`Tro Guide server đang chạy tại http://localhost:${PORT}`);
});
