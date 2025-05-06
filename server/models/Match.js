const mongoose = require('mongoose');

// Schema for Match data
const MatchSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  competition: {
    id: {
      type: String,
      ref: 'League'
    },
    name: String
  },
  utcDate: {
    type: String,
    required: true
  },
  status: String,
  matchday: Number,
  stage: String,
  homeTeam: {
    id: {
      type: Number,
      ref: 'Team'
    },
    name: String,
    shortName: String,
    tla: String,
    crest: String
  },
  awayTeam: {
    id: {
      type: Number,
      ref: 'Team'
    },
    name: String,
    shortName: String,
    tla: String,
    crest: String
  },
  score: {
    winner: String,
    duration: String,
    fullTime: {
      home: Number,
      away: Number
    },
    halfTime: {
      home: Number,
      away: Number
    }
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
MatchSchema.index({ id: 1 });
MatchSchema.index({ 'competition.id': 1 });
MatchSchema.index({ 'homeTeam.id': 1 });
MatchSchema.index({ 'awayTeam.id': 1 });
MatchSchema.index({ utcDate: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Match', MatchSchema);
