const mongoose = require('mongoose');

// Schema for Top Scorers data by league
const ScorerSchema = new mongoose.Schema({
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
  // Store the scorers array from the API
  scorers: [Object],
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

// Create index for faster lookups
ScorerSchema.index({ leagueId: 1, 'season.id': 1 });
ScorerSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Scorer', ScorerSchema);
