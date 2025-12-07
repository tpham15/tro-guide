const db = require('../db');

const REQUIRED_FIELDS = ['name', 'phone', 'area'];

const createGuide = (payload) => {
  const missing = REQUIRED_FIELDS.filter((field) => !payload[field]);
  if (missing.length) {
    const error = new Error(`Thiếu thông tin: ${missing.join(', ')}`);
    error.status = 400;
    throw error;
  }

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO guides (name, phone, area, note) VALUES (?, ?, ?, ?)`,
      [payload.name, payload.phone, payload.area, payload.note ? payload.note.trim() : null],
      function runCallback(err) {
        if (err) {
          return reject(err);
        }
        getGuideById(this.lastID)
          .then(resolve)
          .catch(reject);
      }
    );
  });
};

const getGuideById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM guides WHERE id = ?', [id], (err, row) => {
      if (err) {
        return reject(err);
      }
      if (!row) {
        const error = new Error('Guide không tồn tại');
        error.status = 404;
        return reject(error);
      }
      resolve(row);
    });
  });
};

const getGuides = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM guides ORDER BY created_at DESC', [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports = {
  createGuide,
  getGuides,
  getGuideById
};
