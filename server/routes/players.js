const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(
      `https://api.football-data.org/v4/persons/${id}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching player ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get players by team ID
router.get('/team/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // First we need to get the team details which include the squad
    const response = await axios.get(
      `https://api.football-data.org/v4/teams/${teamId}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    // Extract just the squad information
    const squad = response.data.squad || [];
    
    res.json(squad);
  } catch (error) {
    console.error(`Error fetching players for team ${req.params.teamId}:`, error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Search players (note: this endpoint may not be fully supported by all football APIs)
router.get('/search/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    // This is a placeholder as football-data.org doesn't have a direct player search
    // You might need to implement a different approach or use another API
    res.status(501).json({ 
      message: 'Player search not directly supported by the current API',
      suggestion: 'Try searching for a team and then viewing its squad'
    });
  } catch (error) {
    console.error(`Error searching for player ${req.params.name}:`, error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
