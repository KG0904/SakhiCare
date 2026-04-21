/**
 * models/Cycle.js - Cycle Tracking Schema (Phase 2)
 *
 * Stores menstrual cycle data for each user.
 * Each user can have multiple cycle records.
 * Includes a cycleHistory array to track past period start dates.
 */

const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this cycle record
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Index for faster queries by user
    },

    // Date when the last/current period started
    lastPeriodDate: {
      type: Date,
      required: [true, 'Last period date is required'],
    },

    // Length of the menstrual cycle in days (typically 21–35)
    cycleLength: {
      type: Number,
      default: 30,
      min: [7, 'Cycle length must be at least 7 days'],
      max: [60, 'Cycle length must not exceed 60 days'],
    },

    // Number of bleeding/period days (typically 3–7)
    bleedingDays: {
      type: Number,
      default: 5,
      min: [1, 'Bleeding days must be at least 1'],
      max: [10, 'Bleeding days must not exceed 10'],
    },

    // Historical record of past period start dates for this user
    // Useful for trend analysis and irregularity detection
    cycleHistory: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true, // Auto-generates createdAt & updatedAt
  }
);

module.exports = mongoose.model('Cycle', cycleSchema);
