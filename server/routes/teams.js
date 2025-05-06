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
    console.log(`Fetching teams for league ${leagueId} from API...`);
    
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${leagueId}/teams`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    const teams = response.data.teams || [];
    console.log(`Successfully fetched ${teams.length} teams for league ${leagueId}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching teams for league ${req.params.leagueId}:`, error.message);
    
    // If API call fails, provide sample data as fallback
    const sampleTeams = {
      teams: [
        { id: 1, name: 'Arsenal', crest: 'https://crests.football-data.org/57.png', founded: 1886, venue: 'Emirates Stadium' },
        { id: 2, name: 'Manchester United', crest: 'https://crests.football-data.org/66.png', founded: 1878, venue: 'Old Trafford' },
        { id: 3, name: 'Chelsea', crest: 'https://crests.football-data.org/61.png', founded: 1905, venue: 'Stamford Bridge' },
        { id: 4, name: 'Liverpool', crest: 'https://crests.football-data.org/64.png', founded: 1892, venue: 'Anfield' },
        { id: 5, name: 'Manchester City', crest: 'https://crests.football-data.org/65.png', founded: 1880, venue: 'Etihad Stadium' },
        { id: 6, name: 'Tottenham Hotspur', crest: 'https://crests.football-data.org/73.png', founded: 1882, venue: 'Tottenham Hotspur Stadium' },
        { id: 7, name: 'Newcastle United', crest: 'https://crests.football-data.org/67.png', founded: 1892, venue: 'St. James Park' },
        { id: 8, name: 'Aston Villa', crest: 'https://crests.football-data.org/58.png', founded: 1874, venue: 'Villa Park' }
      ]
    };
    
    res.json(sampleTeams);
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching team ${id} from API...`);
    
    const response = await axios.get(
      `https://api.football-data.org/v4/teams/${id}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    console.log(`Successfully fetched team ${id} data`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching team ${req.params.id}:`, error.message);
    
    // If API call fails, provide sample data as fallback
    const sampleTeam = {
      id: parseInt(req.params.id),
      name: 'Sample Team FC',
      shortName: 'STFC',
      tla: 'STF',
      crest: 'https://via.placeholder.com/100?text=Team',
      address: '123 Football St, Football City',
      phone: '+44 1234 567890',
      website: 'https://example.com',
      email: 'info@sampleteam.com',
      founded: 1950,
      clubColors: 'Red / Blue',
      venue: 'Sample Stadium',
      squad: [
        { id: 101, name: 'Player One', position: 'Goalkeeper', dateOfBirth: '1990-01-01', nationality: 'England', shirtNumber: 1 },
        { id: 102, name: 'Player Two', position: 'Defender', dateOfBirth: '1992-02-02', nationality: 'Brazil', shirtNumber: 2 },
        { id: 103, name: 'Player Three', position: 'Midfielder', dateOfBirth: '1994-03-03', nationality: 'France', shirtNumber: 8 },
        { id: 104, name: 'Player Four', position: 'Attacker', dateOfBirth: '1996-04-04', nationality: 'Spain', shirtNumber: 9 }
      ]
    };
    
    res.json(sampleTeam);
  }
});

// Get team matches
router.get('/:id/matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, dateFrom, dateTo } = req.query;
    console.log(`Fetching matches for team ${id} from API...`);
    
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
    
    console.log(`Successfully fetched ${response.data.matches?.length || 0} matches for team ${id}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching matches for team ${req.params.id}:`, error.message);
    
    // If API call fails, provide sample data as fallback
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const sampleMatches = {
      matches: [
        { 
          id: 301, 
          utcDate: lastWeek.toISOString(), 
          status: 'FINISHED', 
          homeTeam: { id: parseInt(req.params.id), name: 'Sample Team FC' }, 
          awayTeam: { id: 201, name: 'Opponent FC' },
          score: { fullTime: { home: 2, away: 1 } }
        },
        { 
          id: 302, 
          utcDate: today.toISOString(), 
          status: 'SCHEDULED', 
          homeTeam: { id: 202, name: 'Another Team FC' }, 
          awayTeam: { id: parseInt(req.params.id), name: 'Sample Team FC' },
          score: { fullTime: { home: null, away: null } }
        },
        { 
          id: 303, 
          utcDate: nextWeek.toISOString(), 
          status: 'SCHEDULED', 
          homeTeam: { id: parseInt(req.params.id), name: 'Sample Team FC' }, 
          awayTeam: { id: 203, name: 'Future Opponent FC' },
          score: { fullTime: { home: null, away: null } }
        }
      ]
    };
    
    res.json(sampleMatches);
  }
});

module.exports = router;
