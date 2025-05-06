const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get all leagues
router.get('/', async (req, res) => {
  try {
    console.log('Fetching leagues from API...');
    // This is the actual football-data.org API endpoint
    const response = await axios.get(
      'https://api.football-data.org/v4/competitions',
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    // Filter to include only major leagues for the free tier
    const majorLeagues = response.data.competitions.filter(comp => 
      ['PL', 'BL1', 'SA', 'PD', 'FL1'].includes(comp.code)
    );
    
    res.json({ competitions: majorLeagues });
  } catch (error) {
    console.error('Error fetching leagues:', error.message);
    // If API call fails, provide sample data as fallback
    const sampleLeagues = [
      { id: 'PL', name: 'Premier League', code: 'PL', emblem: 'https://crests.football-data.org/PL.png', country: 'England' },
      { id: 'PD', name: 'La Liga', code: 'PD', emblem: 'https://crests.football-data.org/PD.png', country: 'Spain' },
      { id: 'SA', name: 'Serie A', code: 'SA', emblem: 'https://crests.football-data.org/SA.png', country: 'Italy' },
      { id: 'BL1', name: 'Bundesliga', code: 'BL1', emblem: 'https://crests.football-data.org/BL1.png', country: 'Germany' },
      { id: 'FL1', name: 'Ligue 1', code: 'FL1', emblem: 'https://crests.football-data.org/FL1.png', country: 'France' }
    ];
    
    res.json({ competitions: sampleLeagues });
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
