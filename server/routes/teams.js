const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get all teams
router.get('/', async (req, res) => {
  try {
    // Without specific parameters, we'll return an error as the football API 
    // typically requires more specific queries for teams
    res.status(400).json({ 
      message: 'Please provide a league ID or search parameter to find teams' 
    });
  } catch (error) {
    console.error('Error with teams request:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get teams by league ID
router.get('/league/:leagueId', async (req, res) => {
  try {
    const { leagueId } = req.params;
    
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${leagueId}/teams`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching teams for league ${req.params.leagueId}:`, error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(
      `https://api.football-data.org/v4/teams/${id}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching team ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get team matches
router.get('/:id/matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, dateFrom, dateTo } = req.query;
    
    let url = `https://api.football-data.org/v4/teams/${id}/matches`;
    const params = {};
    
    if (status) params.status = status;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    
    const response = await axios.get(url, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY
      },
      params
    });
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching matches for team ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
