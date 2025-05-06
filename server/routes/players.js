const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching player ${id} from API...`);
    
    const response = await axios.get(
      `https://api.football-data.org/v4/persons/${id}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    console.log(`Successfully fetched player ${id} data`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching player ${req.params.id}:`, error.message);
    
    // If API call fails, provide sample data as fallback
    const samplePlayer = {
      id: parseInt(req.params.id),
      name: `Sample Player ${req.params.id}`,
      firstName: 'Sample',
      lastName: `Player ${req.params.id}`,
      dateOfBirth: '1995-06-15',
      nationality: 'England',
      position: 'Midfielder',
      shirtNumber: 10,
      currentTeam: {
        id: 1,
        name: 'Sample Team FC',
        crest: 'https://via.placeholder.com/100?text=Team'
      },
      stats: {
        appearances: 34,
        goals: 12,
        assists: 8,
        yellowCards: 3,
        redCards: 0
      }
    };
    
    res.json(samplePlayer);
  }
});

// Get players by team ID
router.get('/team/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    console.log(`Fetching players for team ${teamId} from API...`);
    
    // We need to get the team details which include the squad
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
    console.log(`Successfully fetched ${squad.length} players for team ${teamId}`);
    
    res.json(squad);
  } catch (error) {
    console.error(`Error fetching players for team ${req.params.teamId}:`, error.message);
    
    // If API call fails, provide sample data as fallback
    const sampleSquad = [
      { id: 301, name: 'Goalkeeper One', position: 'Goalkeeper', dateOfBirth: '1990-01-15', nationality: 'Germany', shirtNumber: 1 },
      { id: 302, name: 'Defender One', position: 'Defence', dateOfBirth: '1992-03-22', nationality: 'France', shirtNumber: 2 },
      { id: 303, name: 'Defender Two', position: 'Defence', dateOfBirth: '1993-07-18', nationality: 'Brazil', shirtNumber: 3 },
      { id: 304, name: 'Midfielder One', position: 'Midfield', dateOfBirth: '1995-05-10', nationality: 'Spain', shirtNumber: 8 },
      { id: 305, name: 'Midfielder Two', position: 'Midfield', dateOfBirth: '1994-09-28', nationality: 'England', shirtNumber: 10 },
      { id: 306, name: 'Forward One', position: 'Offence', dateOfBirth: '1996-04-07', nationality: 'Portugal', shirtNumber: 9 }
    ];
    
    res.json(sampleSquad);
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
