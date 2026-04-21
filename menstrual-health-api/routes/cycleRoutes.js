/**
 * routes/cycleRoutes.js - Cycle Tracking Routes
 *
 * POST /cycle/add              — Add a new cycle entry
 * GET  /cycle/history           — Get all cycle records
 * PUT  /cycle/update/:id        — Update a cycle entry
 * GET  /cycle/irregularities    — Detect irregular cycles
 *
 * All routes are protected — JWT required.
 */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  addCycle,
  getCycleHistory,
  updateCycle,
  detectIrregularities,
} = require('../controllers/cycleController');

// All cycle routes require authentication
router.post('/add', protect, addCycle);
router.get('/history', protect, getCycleHistory);
router.put('/update/:id', protect, updateCycle);
router.get('/irregularities', protect, detectIrregularities);

module.exports = router;
