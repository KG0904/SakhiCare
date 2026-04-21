/**
 * controllers/healthController.js - Health Profile Logic (Phase 2)
 *
 * Manages the user's health conditions.
 * Uses renamed fields: hasPCOS, hasPCOD, hasThyroid, isPregnant.
 * Each user has a single health profile (upserted on update).
 */

const Health = require('../models/Health');

// --------------- Update Health Profile ---------------
// POST /health/update
// Creates or updates (upserts) the health profile for the authenticated user
const updateHealth = async (req, res, next) => {
  try {
    const { hasPCOS, hasPCOD, hasThyroid, isPregnant } = req.body;

    // Build the update object with only provided fields
    const updateData = {};
    if (hasPCOS !== undefined) updateData.hasPCOS = hasPCOS;
    if (hasPCOD !== undefined) updateData.hasPCOD = hasPCOD;
    if (hasThyroid !== undefined) updateData.hasThyroid = hasThyroid;
    if (isPregnant !== undefined) updateData.isPregnant = isPregnant;

    // Upsert: create if not exists, update if exists
    const health = await Health.findOneAndUpdate(
      { userId: req.user.id },                     // Filter by user
      { ...updateData, userId: req.user.id },       // Data to set
      { new: true, upsert: true, runValidators: true }  // Options
    );

    res.status(200).json({
      success: true,
      message: 'Health profile updated successfully',
      data: health,
    });
  } catch (error) {
    next(error);
  }
};

// --------------- Get Health Profile ---------------
// GET /health
// Returns the health profile for the authenticated user
const getHealth = async (req, res, next) => {
  try {
    const health = await Health.findOne({ userId: req.user.id });

    if (!health) {
      return res.status(404).json({
        success: false,
        message: 'No health profile found. Please update your health information first.',
      });
    }

    res.status(200).json({
      success: true,
      data: health,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateHealth, getHealth };
