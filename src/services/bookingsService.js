const db = require('../db');

const REQUIRED_FIELDS = ['customer_name', 'customer_phone', 'area', 'room_type', 'time_slot'];
const ALLOWED_STATUSES = ['pending', 'assigned', 'done', 'cancelled'];

const validateBookingPayload = (payload) => {
  const missing = REQUIRED_FIELDS.filter((field) => !payload[field]);
  if (missing.length) {
    const message = `Thiếu thông tin bắt buộc: ${missing.join(', ')}`;
    const error = new Error(message);
    error.status = 400;
    throw error;
  }
};

const normalizeArea = (payload) => {
  const areaMain = payload.area_main ? String(payload.area_main).trim() : '';
  const areaDetail = payload.area_detail ? String(payload.area_detail).trim() : '';
  if (payload.area && payload.area.trim()) {
    return payload.area.trim();
  }
  if (areaMain && areaDetail) {
    return `${areaMain} - ${areaDetail}`;
  }
  if (areaMain) {
    return areaMain;
  }
  if (areaDetail) {
    return areaDetail;
  }
  return '';
};

const toNullableString = (value) => {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed ? trimmed : null;
};

const createBooking = (payload) => {
  payload.area = normalizeArea(payload);
  validateBookingPayload(payload);

  const budgetMin =
    payload.budget_min !== undefined && payload.budget_min !== null && payload.budget_min !== ''
      ? Number(payload.budget_min)
      : null;
  const budgetMax =
    payload.budget_max !== undefined && payload.budget_max !== null && payload.budget_max !== ''
      ? Number(payload.budget_max)
      : null;
  const roomsToView = payload.rooms_to_view ? Number(payload.rooms_to_view) : 1;

  return new Promise((resolve, reject) => {
    const stmt = `
      INSERT INTO bookings (
        customer_name,
        customer_phone,
        customer_zalo,
        area,
        area_main,
        area_detail,
        budget_min,
        budget_max,
        room_type,
        rooms_to_view,
        time_slot,
        note,
        status,
        guide_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NULL)
    `;

    const values = [
      payload.customer_name,
      payload.customer_phone,
      payload.customer_zalo || null,
      payload.area,
      toNullableString(payload.area_main),
      toNullableString(payload.area_detail),
      budgetMin,
      budgetMax,
      payload.room_type,
      roomsToView || 1,
      payload.time_slot,
      payload.note || null
    ];

    db.run(stmt, values, function runCallback(err) {
      if (err) {
        return reject(err);
      }
      getBookingById(this.lastID)
        .then(resolve)
        .catch(reject);
    });
  });
};

const getBookings = (status) => {
  return new Promise((resolve, reject) => {
    const hasStatusFilter = status && ALLOWED_STATUSES.includes(status);
    const query = `
      SELECT * FROM bookings
      ${hasStatusFilter ? 'WHERE status = ?' : ''}
      ORDER BY created_at DESC
    `;

    db.all(query, hasStatusFilter ? [status] : [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

const getBookingById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM bookings WHERE id = ?', [id], (err, row) => {
      if (err) {
        return reject(err);
      }
      if (!row) {
        const error = new Error('Booking không tồn tại');
        error.status = 404;
        return reject(error);
      }
      resolve(row);
    });
  });
};

const ensureGuideExists = (guideId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM guides WHERE id = ?', [guideId], (err, row) => {
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

const assignGuide = async (bookingId, guideId) => {
  const parsedGuideId = Number(guideId);
  if (!Number.isInteger(parsedGuideId) || parsedGuideId <= 0) {
    const error = new Error('guide_id không hợp lệ');
    error.status = 400;
    throw error;
  }

  const [booking] = await Promise.all([
    getBookingById(bookingId),
    ensureGuideExists(parsedGuideId)
  ]);

  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE bookings SET guide_id = ?, status = ? WHERE id = ?',
      [parsedGuideId, 'assigned', booking.id],
      function updateCallback(err) {
        if (err) {
          return reject(err);
        }
        getBookingById(booking.id)
          .then(resolve)
          .catch(reject);
      }
    );
  });
};

const updateStatus = async (bookingId, status) => {
  if (!ALLOWED_STATUSES.includes(status)) {
    const error = new Error('Trạng thái không hợp lệ');
    error.status = 400;
    throw error;
  }

  await getBookingById(bookingId);

  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, bookingId],
      function updateCallback(err) {
        if (err) {
          return reject(err);
        }
        getBookingById(bookingId)
          .then(resolve)
          .catch(reject);
      }
    );
  });
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  assignGuide,
  updateStatus,
  ALLOWED_STATUSES
};
