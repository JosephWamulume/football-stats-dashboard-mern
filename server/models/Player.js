const mongoose = require('mongoose');

// Schema for Player data
const PlayerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  nationality: String,
  position: String,
  shirtNumber: Number,
  // Reference to the player's current team
  currentTeam: {
    id: {
      type: Number,
      ref: 'Team'
    },
    name: String,
    crest: String
  },
  // Store the complete API response
  apiData: {
    type: Object
  },
  // Metadata for cache management
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster lookups
PlayerSchema.index({ id: 1 });
PlayerSchema.index({ 'currentTeam.id': 1 });
PlayerSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Player', PlayerSchema);
