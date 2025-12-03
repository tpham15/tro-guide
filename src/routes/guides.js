const express = require('express');
const { createGuide, getGuides } = require('../services/guidesService');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const guide = await createGuide(req.body || {});
    res.status(201).json(guide);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const guides = await getGuides();
    res.json(guides);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
