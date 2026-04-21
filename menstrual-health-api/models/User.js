/**
 * models/User.js - User Schema (Phase 2)
 *
 * Stores user credentials and profile info.
 * Passwords are automatically hashed with bcrypt before saving.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // User's display name
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    // Unique email used for authentication
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },

    // Hashed password (never stored in plain text)
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Exclude from queries by default for security
    },

    // Optional age field for health-related calculations
    age: {
      type: Number,
      min: [10, 'Age must be at least 10'],
      max: [60, 'Age must not exceed 60'],
    },

    // Allows anonymous usage without revealing identity
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Auto-generates createdAt & updatedAt
  }
);

// --------------- Pre-save Hook ---------------
// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
  // Only hash if the password field was modified (prevents double-hashing)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --------------- Instance Method ---------------
// Compare an entered plain-text password with the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
