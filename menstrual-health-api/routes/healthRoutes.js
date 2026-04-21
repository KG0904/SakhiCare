/**
 * routes/healthRoutes.js - Health Profile Routes
 *
 * POST /health/update  — Create or update health conditions
 * GET  /health         — Get health profile
 *
 * All routes are protected — JWT required.
 */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { updateHealth, getHealth } = require('../controllers/healthController');

router.post('/update', protect, updateHealth);
router.get('/', protect, getHealth);

module.exports = router;
