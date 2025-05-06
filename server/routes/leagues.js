const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get all leagues
router.get('/', async (req, res) => {
  try {
    // This would be replaced with your actual football API endpoint
    // For example, using football-data.org API
    const response = await axios.get(
      'https://api.football-data.org/v4/competitions',
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching leagues:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get league by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${id}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching league ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get league standings
router.get('/:id/standings', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${id}/standings`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching standings for league ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
