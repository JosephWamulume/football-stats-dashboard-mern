const mongoose = require('mongoose');

// Schema for League data
const LeagueSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  code: String,
  type: String,
  emblem: String,
  currentSeason: {
    id: Number,
    startDate: String,
    endDate: String,
    currentMatchday: Number,
    winner: Object
  },
  area: {
    id: Number,
    name: String,
    code: String,
    flag: String
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

// Create an index for faster lookups
LeagueSchema.index({ id: 1 });
LeagueSchema.index({ code: 1 });
LeagueSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('League', LeagueSchema);
