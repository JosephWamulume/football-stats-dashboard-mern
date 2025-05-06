const mongoose = require('mongoose');

// Schema for League Standings data
const StandingSchema = new mongoose.Schema({
  leagueId: {
    type: String,
    required: true,
    ref: 'League'
  },
  season: {
    id: Number,
    startDate: String,
    endDate: String,
    currentMatchday: Number
  },
  // Store all standing tables (there might be multiple for group-based competitions)
  standings: [Object],
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

// Create composite index for faster lookups
StandingSchema.index({ leagueId: 1, 'season.id': 1 });
StandingSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Standing', StandingSchema);
