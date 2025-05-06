const axios = require('axios');

// Cache duration (in hours)
const CACHE_DURATION = {
  LEAGUES: 24, // Leagues don't change often, cache for 24 hours
  TEAMS: 24,  // Teams don't change often
  PLAYERS: 24, // Player info doesn't change often
  STANDINGS: 3, // Standings can change after matches, cache for 3 hours
  MATCHES: 1,  // Matches status can change frequently, cache for 1 hour
  SCORERS: 3   // Scorer stats change after matches, cache for 3 hours
};

/**
 * Check if data needs to be refreshed based on lastUpdated timestamp
 * @param {Date} lastUpdated - Timestamp of the last data update
 * @param {number} cacheHours - Cache duration in hours
 * @returns {boolean} - True if cache is expired, false otherwise
 */
const isCacheExpired = (lastUpdated, cacheHours) => {
  if (!lastUpdated) return true;
  
  const cacheExpiryTime = new Date(lastUpdated.getTime() + (cacheHours * 60 * 60 * 1000));
  return new Date() > cacheExpiryTime;
};

/**
 * Generic function to get data with caching
 * @param {Object} Model - Mongoose model
 * @param {Object} query - Query to find the document
 * @param {Function} fetchFunction - Function to fetch data from API if cache miss
 * @param {number} cacheDuration - Cache duration in hours
 * @returns {Promise<Object>} - The data, either from cache or from API
 */
const getDataWithCache = async (Model, query, fetchFunction, cacheDuration) => {
  try {
    // Try to find the data in the cache
    const cachedData = await Model.findOne(query);
    
    // If data exists in cache and is not expired, return it
    if (cachedData && !isCacheExpired(cachedData.lastUpdated, cacheDuration)) {
      console.log(`Using cached data for ${Model.modelName}`);
      return cachedData;
    }
    
    // If cache miss or expired, fetch from API
    console.log(`Cache miss or expired for ${Model.modelName}. Fetching from API...`);
    const freshData = await fetchFunction();
    
    // Update or create the document in the database
    if (cachedData) {
      // Update existing document
      Object.assign(cachedData, freshData, { lastUpdated: new Date() });
      await cachedData.save();
      return cachedData;
    } else {
      // Create new document
      const newCachedData = new Model({
        ...freshData,
        lastUpdated: new Date()
      });
      await newCachedData.save();
      return newCachedData;
    }
  } catch (error) {
    console.error(`Error in getDataWithCache for ${Model.modelName}:`, error.message);
    // If there's cached data, return it even if expired (better than nothing)
    const cachedData = await Model.findOne(query);
    if (cachedData) {
      console.log(`Returning expired cache for ${Model.modelName} due to API error`);
      return cachedData;
    }
    throw error;
  }
};

/**
 * Create the API request function with proper headers
 * @param {string} url - API endpoint URL
 * @param {Object} params - Query parameters for the API call
 * @returns {Function} - Function that performs the API call
 */
const createApiFetchFunction = (url, params = {}) => {
  return async () => {
    const response = await axios.get(url, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY
      },
      params
    });
    return response.data;
  };
};

module.exports = {
  CACHE_DURATION,
  isCacheExpired,
  getDataWithCache,
  createApiFetchFunction
};
