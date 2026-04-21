/**
 * routes/predictionRoutes.js - Prediction Routes
 *
 * GET /prediction/next-period  — Predict next period date
 * GET /prediction/ovulation    — Predict ovulation date & fertile window
 *
 * All routes are protected — JWT required.
 */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  predictNextPeriod,
  predictOvulation,
} = require('../controllers/predictionController');

router.get('/next-period', protect, predictNextPeriod);
router.get('/ovulation', protect, predictOvulation);

module.exports = router;
