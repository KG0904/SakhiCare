/**
 * controllers/predictionController.js - Prediction Logic (Bleeding Days Update)
 *
 * Predicts the next period date range and ovulation window.
 * Now returns nextPeriodStart + nextPeriodEnd using bleedingDays.
 *
 * Key formulas:
 *   Next Period Start = Last Period Date + Cycle Length (days)
 *   Next Period End   = Next Period Start + Bleeding Days
 *   Ovulation         = Next Period Start - 14 days
 */

const Cycle = require('../models/Cycle');

// --------------- Predict Next Period ---------------
// GET /prediction/next-period
const predictNextPeriod = async (req, res, next) => {
  try {
    const latestCycle = await Cycle.findOne({ userId: req.user.id }).sort({
      lastPeriodDate: -1,
    });

    if (!latestCycle) {
      return res.status(404).json({
        success: false,
        message: 'No cycle data found. Please add a cycle entry first.',
      });
    }

    const bleedingDays = latestCycle.bleedingDays || 5;

    // Next period start = lastPeriodDate + cycleLength
    const nextPeriodStart = new Date(latestCycle.lastPeriodDate);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + latestCycle.cycleLength);

    // Next period end = start + bleedingDays
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + bleedingDays);

    const today = new Date();
    const isLate = nextPeriodStart < today;

    res.status(200).json({
      success: true,
      message: isLate
        ? '⚠️ Your predicted period date has passed. Your period may be late.'
        : `Your next period is predicted from ${nextPeriodStart.toDateString()} to ${nextPeriodEnd.toDateString()}.`,
      data: {
        lastPeriodDate: latestCycle.lastPeriodDate,
        cycleLength: latestCycle.cycleLength,
        bleedingDays,
        nextPeriodStart,
        nextPeriodEnd,
        // Keep backward-compatible field
        predictedNextPeriod: nextPeriodStart,
        isLate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------- Predict Ovulation ---------------
// GET /prediction/ovulation
const predictOvulation = async (req, res, next) => {
  try {
    const latestCycle = await Cycle.findOne({ userId: req.user.id }).sort({
      lastPeriodDate: -1,
    });

    if (!latestCycle) {
      return res.status(404).json({
        success: false,
        message: 'No cycle data found. Please add a cycle entry first.',
      });
    }

    const bleedingDays = latestCycle.bleedingDays || 5;

    // Step 1: Next period start date
    const nextPeriodStart = new Date(latestCycle.lastPeriodDate);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + latestCycle.cycleLength);

    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + bleedingDays);

    // Step 2: Ovulation = Next Period Start - 14 days
    const ovulationDate = new Date(nextPeriodStart);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    // Step 3: Fertile window = ovulation ± 2 days
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 2);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 2);

    res.status(200).json({
      success: true,
      message: `Estimated ovulation date: ${ovulationDate.toDateString()}.`,
      data: {
        lastPeriodDate: latestCycle.lastPeriodDate,
        cycleLength: latestCycle.cycleLength,
        bleedingDays,
        nextPeriodStart,
        nextPeriodEnd,
        predictedNextPeriod: nextPeriodStart,
        estimatedOvulationDate: ovulationDate,
        fertileWindow: {
          start: fertileStart,
          end: fertileEnd,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { predictNextPeriod, predictOvulation };
