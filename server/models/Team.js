const mongoose = require('mongoose');

// Schema for Team data
const TeamSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  shortName: String,
  tla: String,
  crest: String,
  address: String,
  website: String,
  founded: Number,
  clubColors: String,
  venue: String,
  // We'll store the complete squad as received from the API
  squad: [Object],
  // Reference to the leagues this team belongs to
  leagues: [{
    type: String,
    ref: 'League'
  }],
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
TeamSchema.index({ id: 1 });
TeamSchema.index({ 'leagues': 1 });
TeamSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Team', TeamSchema);
