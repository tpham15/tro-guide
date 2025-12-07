const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { DB_PATH } = require('./config');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Không thể kết nối SQLite:', err.message);
    process.exit(1);
  }
});

const initSqlPath = path.join(__dirname, 'scripts', 'init-db.sql');

try {
  const initSql = fs.readFileSync(initSqlPath, 'utf8');
  db.exec(initSql, (err) => {
    if (err) {
      console.error('Lỗi khởi tạo bảng:', err.message);
    }
    ensureBookingAreaColumns();
    ensureGuideColumns();
  });
} catch (err) {
  console.error('Không thể đọc init-db.sql:', err.message);
}

function ensureColumnExists(table, column, definition) {
  db.all(`PRAGMA table_info(${table})`, (err, rows) => {
    if (err) {
      console.error(`Không thể kiểm tra cột ${column}:`, err.message);
      return;
    }
    const exists = rows.some((row) => row.name === column);
    if (!exists) {
      db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`, (alterErr) => {
        if (alterErr) {
          console.error(`Không thể thêm cột ${column}:`, alterErr.message);
        } else {
          console.log(`Đã thêm cột ${column} vào bảng ${table}`);
        }
      });
    }
  });
}

function ensureBookingAreaColumns() {
  ensureColumnExists('bookings', 'area_main', 'TEXT');
  ensureColumnExists('bookings', 'area_detail', 'TEXT');
}

function ensureGuideColumns() {
  ensureColumnExists('guides', 'note', 'TEXT');
}

module.exports = db;
