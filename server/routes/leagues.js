const express = require('express');
const router = express.Router();
const axios = require('axios');

// Import memory cache utility
const { CACHE_DURATION, getCache, setCache } = require('../utils/memoryCache');

// Get all leagues
router.get('/', async (req, res) => {
  try {
    console.log('Fetching leagues from cache or API...');
    
    // Try to get from cache first
    const cacheKey = 'leagues';
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log('Using cached leagues data');
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log('Leagues not in cache, fetching from API...');
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
    
    console.log(`API returned ${majorLeagues.length} major leagues`);
    
    // Format the response
    const result = { competitions: majorLeagues };
    
    // Save to cache
    setCache(cacheKey, result, CACHE_DURATION.LEAGUES);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching leagues:', error.message);
    
    // If API call fails, try to use cache as fallback
    const cachedData = getCache('leagues');
    if (cachedData) {
      console.log('Using cached leagues data as fallback after API error');
      return res.json(cachedData);
    }
    
    // Last resort - use sample data
    const sampleLeagues = [
      { id: 'PL', name: 'Premier League', code: 'PL', emblem: 'https://crests.football-data.org/PL.png', country: 'England' },
      { id: 'PD', name: 'La Liga', code: 'PD', emblem: 'https://crests.football-data.org/PD.png', country: 'Spain' },
      { id: 'SA', name: 'Serie A', code: 'SA', emblem: 'https://crests.football-data.org/SA.png', country: 'Italy' },
      { id: 'BL1', name: 'Bundesliga', code: 'BL1', emblem: 'https://crests.football-data.org/BL1.png', country: 'Germany' },
      { id: 'FL1', name: 'Ligue 1', code: 'FL1', emblem: 'https://crests.football-data.org/FL1.png', country: 'France' }
    ];
    
    console.log('Using fallback sample data');
    res.json({ competitions: sampleLeagues });
  }
});

// Get league by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching league details for ID: ${id}`);
    
    // Try to get from cache first
    const cacheKey = `league_${id}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached data for league ${id}`);
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log(`League ${id} not in cache, fetching from API...`);
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${id}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    console.log(`Successfully fetched league details for ${id}`);
    
    // Save to cache
    setCache(cacheKey, response.data, CACHE_DURATION.LEAGUES);
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching league ${req.params.id}:`, error.message);
    
    // Try to get from cache as fallback
    const cachedData = getCache(`league_${req.params.id}`);
    if (cachedData) {
      console.log(`Using cached data for league ${req.params.id} after API error`);
      return res.json(cachedData);
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get league standings
router.get('/:id/standings', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching standings for league ${id}`);
    
    // Try to get from cache first
    const cacheKey = `standings_${id}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached standings for league ${id}`);
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log(`Standings for league ${id} not in cache, fetching from API...`);
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${id}/standings`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    console.log(`Successfully fetched standings for league ${id}`);
    
    // Save to cache
    setCache(cacheKey, response.data, CACHE_DURATION.STANDINGS);
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching standings for league ${req.params.id}:`, error.message);
    
    // Try to get from cache as fallback
    const cachedData = getCache(`standings_${req.params.id}`);
    if (cachedData) {
      console.log(`Using cached standings for league ${req.params.id} after API error`);
      return res.json(cachedData);
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get league top scorers
router.get('/:id/scorers', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit || 10;
    console.log(`Fetching top scorers for league ${id}`);
    
    // Try to get from cache first
    const cacheKey = `scorers_${id}_${limit}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached scorers for league ${id}`);
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log(`Scorers for league ${id} not in cache, fetching from API...`);
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${id}/scorers`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        },
        params: {
          limit
        }
      }
    );
    
    console.log(`Successfully fetched top scorers for league ${id}`);
    
    // Save to cache
    setCache(cacheKey, response.data, CACHE_DURATION.SCORERS);
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching top scorers for league ${req.params.id}:`, error.message);
    
    // Try to get from cache as fallback
    const cachedData = getCache(`scorers_${req.params.id}_${req.query.limit || 10}`);
    if (cachedData) {
      console.log(`Using cached scorers for league ${req.params.id} after API error`);
      return res.json(cachedData);
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get league matches (recent and upcoming)
router.get('/:id/matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { dateFrom, dateTo, status } = req.query;
    const limit = req.query.limit || 10;
    
    console.log(`Fetching matches for league ${id}`);
    
    // Create a cache key based on the parameters
    const cacheKey = `matches_${id}_${dateFrom || ''}_${dateTo || ''}_${status || ''}_${limit}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached matches for league ${id}`);
      return res.json(cachedData);
    }
    
    // If not in cache, fetch from API
    console.log(`Matches for league ${id} not in cache, fetching from API...`);
    
    // Build params for the API call
    const params = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    if (status) params.status = status;
    params.limit = limit;
    
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${id}/matches`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        },
        params
      }
    );
    
    console.log(`Successfully fetched matches for league ${id}`);
    
    // Save to cache
    setCache(cacheKey, response.data, CACHE_DURATION.MATCHES);
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching matches for league ${req.params.id}:`, error.message);
    
    // Try to get from cache as fallback
    const cacheKey = `matches_${req.params.id}_${req.query.dateFrom || ''}_${req.query.dateTo || ''}_${req.query.status || ''}_${req.query.limit || 10}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached matches for league ${req.params.id} after API error`);
      return res.json(cachedData);
    }
    
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
