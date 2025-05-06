/**
 * Simple in-memory cache implementation for API responses
 * This helps reduce API calls and handle rate limiting without requiring MongoDB
 */

// Cache storage
const cache = {};

// Cache duration (in milliseconds)
const CACHE_DURATION = {
  LEAGUES: 24 * 60 * 60 * 1000,    // Leagues don't change often, cache for 24 hours
  TEAMS: 24 * 60 * 60 * 1000,      // Teams don't change often
  PLAYERS: 24 * 60 * 60 * 1000,    // Player info doesn't change often
  STANDINGS: 3 * 60 * 60 * 1000,   // Standings can change after matches, cache for 3 hours
  MATCHES: 1 * 60 * 60 * 1000,     // Matches status can change frequently, cache for 1 hour
  SCORERS: 3 * 60 * 60 * 1000      // Scorer stats change after matches, cache for 3 hours
};

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Object|null} - Cached data or null if not found or expired
 */
const getCache = (key) => {
  const item = cache[key];
  
  // If item doesn't exist or is expired, return null
  if (!item || Date.now() > item.expiry) {
    return null;
  }
  
  console.log(`Cache hit for: ${key}`);
  return item.data;
};

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 * @param {number} duration - Cache duration in milliseconds
 */
const setCache = (key, data, duration) => {
  console.log(`Setting cache for: ${key}`);
  
  cache[key] = {
    data,
    expiry: Date.now() + duration
  };
};

/**
 * Clear a specific item from cache
 * @param {string} key - Cache key to clear
 */
const clearCache = (key) => {
  if (cache[key]) {
    delete cache[key];
    console.log(`Cleared cache for: ${key}`);
  }
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
  console.log('Cleared all cache');
};

/**
 * Get cache stats
 * @returns {Object} - Cache statistics
 */
const getCacheStats = () => {
  const stats = {
    totalItems: Object.keys(cache).length,
    items: {}
  };
  
  Object.keys(cache).forEach(key => {
    stats.items[key] = {
      expired: Date.now() > cache[key].expiry,
      expiresIn: Math.round((cache[key].expiry - Date.now()) / 1000) + ' seconds'
    };
  });
  
  return stats;
};

module.exports = {
  CACHE_DURATION,
  getCache,
  setCache,
  clearCache,
  clearAllCache,
  getCacheStats
};
