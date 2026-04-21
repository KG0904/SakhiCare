/**
 * models/Quote.js - Motivational Quotes Schema (Phase 2)
 *
 * Stores motivational / health-awareness quotes.
 * Can be fetched randomly to display in the app UI.
 */

const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  // The quote text content
  text: {
    type: String,
    required: [true, 'Quote text is required'],
    trim: true,
  },

  // Auto-set creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quote', quoteSchema);
