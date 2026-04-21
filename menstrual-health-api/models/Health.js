/**
 * models/Health.js - Health Profile Schema (Phase 2)
 *
 * Stores health condition flags for each user.
 * One health profile per user (enforced via unique constraint).
 */

const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this health record
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // One health profile per user
    },

    // Polycystic Ovary Syndrome flag
    hasPCOS: {
      type: Boolean,
      default: false,
    },

    // Polycystic Ovary Disease flag
    hasPCOD: {
      type: Boolean,
      default: false,
    },

    // Thyroid condition flag
    hasThyroid: {
      type: Boolean,
      default: false,
    },

    // Pregnancy flag
    isPregnant: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Auto-generates createdAt & updatedAt
  }
);

module.exports = mongoose.model('Health', healthSchema);
