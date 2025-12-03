const express = require('express');
const {
  createBooking,
  getBookings,
  assignGuide,
  updateStatus,
  ALLOWED_STATUSES
} = require('../services/bookingsService');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const booking = await createBooking(req.body || {});
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const bookings = await getBookings(status);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/assign', async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      const error = new Error('ID booking không hợp lệ');
      error.status = 400;
      throw error;
    }
    const { guide_id } = req.body || {};
    const booking = await assignGuide(bookingId, guide_id);
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      const error = new Error('ID booking không hợp lệ');
      error.status = 400;
      throw error;
    }
    const { status } = req.body || {};
    if (!status) {
      const error = new Error('Thiếu status');
      error.status = 400;
      throw error;
    }
    if (!ALLOWED_STATUSES.includes(status)) {
      const error = new Error('Status không hợp lệ');
      error.status = 400;
      throw error;
    }
    const booking = await updateStatus(bookingId, status);
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
