const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data.db');
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

module.exports = {
  PORT,
  DB_PATH,
  FRONTEND_ORIGIN
};
