const express = require('express');
const router = express.Router();
const axios = require('axios');

// Import memory cache utility
const { CACHE_DURATION, getCache, setCache } = require('../utils/memoryCache');

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
    console.log(`Fetching teams for league ${leagueId}`);
    
    // Try to get from cache first
    const cacheKey = `teams_league_${leagueId}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached teams for league ${leagueId}`);
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log(`Teams for league ${leagueId} not in cache, fetching from API...`);
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${leagueId}/teams`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    console.log(`Successfully fetched teams for league ${leagueId}`);
    console.log(`Teams count: ${response.data.teams ? response.data.teams.length : 0}`);
    
    // Save to cache
    setCache(cacheKey, response.data, CACHE_DURATION.TEAMS);
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching teams for league ${req.params.leagueId}:`, error.message);
    
    // Try to get from cache as fallback
    const cachedData = getCache(`teams_league_${req.params.leagueId}`);
    if (cachedData) {
      console.log(`Using cached teams for league ${req.params.leagueId} after API error`);
      return res.json(cachedData);
    }
    
    // Return error instead of fallback data to make issues more visible
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching team details for ID: ${id}`);
    
    // Try to get from cache first
    const cacheKey = `team_${id}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached data for team ${id}`);
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log(`Team ${id} not in cache, fetching from API...`);
    const response = await axios.get(
      `https://api.football-data.org/v4/teams/${id}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    console.log(`Successfully fetched team details for ${id}`);
    
    // Save to cache
    setCache(cacheKey, response.data, CACHE_DURATION.TEAMS);
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching team ${req.params.id}:`, error.message);
    
    // Try to get from cache as fallback
    const cachedData = getCache(`team_${req.params.id}`);
    if (cachedData) {
      console.log(`Using cached data for team ${req.params.id} after API error`);
      return res.json(cachedData);
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get team matches
router.get('/:id/matches', async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.query.status || 'SCHEDULED';
    const limit = parseInt(req.query.limit || 10);
    
    console.log(`Fetching matches for team ${id}`);
    
    // Create a cache key based on the parameters
    const cacheKey = `team_matches_${id}_${status}_${limit}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached matches for team ${id}`);
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log(`Matches for team ${id} not in cache, fetching from API...`);
    
    // Status can be SCHEDULED, LIVE, IN_PLAY, PAUSED, FINISHED, POSTPONED, SUSPENDED, CANCELLED
    const response = await axios.get(
      `https://api.football-data.org/v4/teams/${id}/matches`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        },
        params: {
          status,
          limit
        }
      }
    );
    
    console.log(`Successfully fetched ${response.data.matches ? response.data.matches.length : 0} matches for team ${id}`);
    
    // Save to cache
    setCache(cacheKey, response.data, CACHE_DURATION.MATCHES);
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching matches for team ${req.params.id}:`, error.message);
    
    // Try to get from cache as fallback
    const cacheKey = `team_matches_${req.params.id}_${req.query.status || 'SCHEDULED'}_${parseInt(req.query.limit || 10)}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached matches for team ${req.params.id} after API error`);
      return res.json(cachedData);
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
