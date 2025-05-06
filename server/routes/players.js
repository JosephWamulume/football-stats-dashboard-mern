const express = require('express');
const router = express.Router();
const axios = require('axios');

// Import memory cache utility
const { CACHE_DURATION, getCache, setCache } = require('../utils/memoryCache');

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching player details for ID: ${id}`);
    
    // Try to get from cache first
    const cacheKey = `player_${id}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached data for player ${id}`);
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log(`Player ${id} not in cache, fetching from API...`);
    const response = await axios.get(
      `https://api.football-data.org/v4/persons/${id}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    console.log(`Successfully fetched player details for ${id}`);
    
    // Save to cache
    setCache(cacheKey, response.data, CACHE_DURATION.PLAYERS);
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching player ${req.params.id}:`, error.message);
    
    // Try to get from cache as fallback
    const cachedData = getCache(`player_${req.params.id}`);
    if (cachedData) {
      console.log(`Using cached data for player ${req.params.id} after API error`);
      return res.json(cachedData);
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get players by team ID
router.get('/team/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    console.log(`Fetching players for team ID: ${teamId}`);
    
    // Try to get from cache first
    const cacheKey = `players_team_${teamId}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached players for team ${teamId}`);
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log(`Players for team ${teamId} not in cache, fetching from API...`);
    
    // The Football Data API doesn't have a dedicated endpoint for getting all players by team
    // So we fetch the team details which includes the squad
    const response = await axios.get(
      `https://api.football-data.org/v4/teams/${teamId}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    // Extract only the squad from the team data
    const players = response.data.squad || [];
    console.log(`Successfully fetched ${players.length} players for team ${teamId}`);
    
    // Format the response
    const result = { players };
    
    // Save to cache
    setCache(cacheKey, result, CACHE_DURATION.PLAYERS);
    
    // Also cache the team data
    setCache(`team_${teamId}`, response.data, CACHE_DURATION.TEAMS);
    
    res.json(result);
  } catch (error) {
    console.error(`Error fetching players for team ${req.params.teamId}:`, error.message);
    
    // Try to get from cache as fallback
    const cachedData = getCache(`players_team_${req.params.teamId}`);
    if (cachedData) {
      console.log(`Using cached players for team ${req.params.teamId} after API error`);
      return res.json(cachedData);
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Search players (note: this endpoint may not be fully supported by all football APIs)
router.get('/search/:name', async (req, res) => {
  try {
    const { name } = req.params;
    console.log(`Searching for player '${name}' in API...`);
    
    // This is a placeholder as football-data.org doesn't have a direct player search
    // The free tier has limitations on searching
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
