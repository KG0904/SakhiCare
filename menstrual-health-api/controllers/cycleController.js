/**
 * controllers/cycleController.js - Cycle Tracking Logic (Phase 2)
 *
 * Handles adding, retrieving, and updating cycle records.
 * Now uses userId field and supports cycleHistory array.
 * Includes irregularity detection across cycle history.
 */

const Cycle = require('../models/Cycle');

// --------------- Add Cycle ---------------
// POST /cycle/add
// Records a new cycle entry for the authenticated user.
// Automatically appends lastPeriodDate to cycleHistory.
const addCycle = async (req, res, next) => {
  try {
    const { lastPeriodDate, cycleLength, bleedingDays, cycleHistory } = req.body;

    // Validate required fields
    if (!lastPeriodDate) {
      return res.status(400).json({
        success: false,
        message: 'Last period date is required',
      });
    }

    // Build cycleHistory: include provided history + the current date
    const history = cycleHistory || [];
    if (!history.includes(lastPeriodDate)) {
      history.push(lastPeriodDate);
    }

    // Create cycle record linked to the authenticated user
    const cycle = await Cycle.create({
      userId: req.user.id,
      lastPeriodDate,
      cycleLength: cycleLength || 30, // Default to 30 days
      bleedingDays: bleedingDays || 5, // Default to 5 days
      cycleHistory: history,
    });

    res.status(201).json({
      success: true,
      message: 'Cycle entry added successfully',
      data: cycle,
    });
  } catch (error) {
    next(error);
  }
};

// --------------- Get Cycle History ---------------
// GET /cycle/history
// Returns all cycle records for the authenticated user,
// sorted by lastPeriodDate descending (most recent first)
const getCycleHistory = async (req, res, next) => {
  try {
    const cycles = await Cycle.find({ userId: req.user.id }).sort({
      lastPeriodDate: -1,
    });

    res.status(200).json({
      success: true,
      count: cycles.length,
      data: cycles,
    });
  } catch (error) {
    next(error);
  }
};

// --------------- Update Cycle ---------------
// PUT /cycle/update/:id
// Updates a specific cycle entry (must belong to the authenticated user)
const updateCycle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lastPeriodDate, cycleLength, bleedingDays, cycleHistory } = req.body;

    // Find the cycle and ensure it belongs to the current user
    let cycle = await Cycle.findById(id);

    if (!cycle) {
      return res.status(404).json({
        success: false,
        message: 'Cycle entry not found',
      });
    }

    // Authorization check — users can only update their own records
    if (cycle.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this cycle entry',
      });
    }

    // Update fields if provided
    if (lastPeriodDate) {
      cycle.lastPeriodDate = lastPeriodDate;
      if (!cycle.cycleHistory.some((d) => new Date(d).getTime() === new Date(lastPeriodDate).getTime())) {
        cycle.cycleHistory.push(lastPeriodDate);
      }
    }
    if (cycleLength) cycle.cycleLength = cycleLength;
    if (bleedingDays) cycle.bleedingDays = bleedingDays;
    if (cycleHistory) cycle.cycleHistory = cycleHistory;

    cycle = await cycle.save();

    res.status(200).json({
      success: true,
      message: 'Cycle entry updated successfully',
      data: cycle,
    });
  } catch (error) {
    next(error);
  }
};

// --------------- Detect Irregularities ---------------
// GET /cycle/irregularities
// Analyzes cycle history and flags inconsistent cycle lengths.
// A cycle is "irregular" if it deviates more than 7 days from the user's average.
const detectIrregularities = async (req, res, next) => {
  try {
    const cycles = await Cycle.find({ userId: req.user.id }).sort({
      lastPeriodDate: 1,
    });

    // Need at least 2 cycles to detect irregularities
    if (cycles.length < 2) {
      return res.status(200).json({
        success: true,
        message: 'Not enough cycle data to detect irregularities (need at least 2 entries)',
        data: {
          isIrregular: false,
          irregularCycles: [],
        },
      });
    }

    // Calculate average cycle length
    const totalLength = cycles.reduce((sum, c) => sum + c.cycleLength, 0);
    const avgLength = totalLength / cycles.length;

    // Find cycles that deviate more than 7 days from the average
    const DEVIATION_THRESHOLD = 7;
    const irregularCycles = cycles.filter(
      (c) => Math.abs(c.cycleLength - avgLength) > DEVIATION_THRESHOLD
    );

    const isIrregular = irregularCycles.length > 0;

    res.status(200).json({
      success: true,
      message: isIrregular
        ? `⚠️ Warning: ${irregularCycles.length} irregular cycle(s) detected. Your cycle lengths vary significantly from your average of ${avgLength.toFixed(1)} days. Consider consulting a healthcare provider.`
        : '✅ Your cycles appear regular.',
      data: {
        isIrregular,
        averageCycleLength: parseFloat(avgLength.toFixed(1)),
        totalCyclesAnalyzed: cycles.length,
        irregularCycles: irregularCycles.map((c) => ({
          id: c._id,
          lastPeriodDate: c.lastPeriodDate,
          cycleLength: c.cycleLength,
          deviationFromAvg: parseFloat(
            (c.cycleLength - avgLength).toFixed(1)
          ),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addCycle, getCycleHistory, updateCycle, detectIrregularities };
