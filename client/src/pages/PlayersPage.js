import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getErrorDetails } from '../utils/errorHandler';

const PlayersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  // Fetch leagues first
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch leagues from our backend API
        const response = await axios.get('/api/leagues');
        
        // Set leagues from the API response
        const fetchedLeagues = response.data.competitions || [];
        setLeagues(fetchedLeagues);
        
        // If there are leagues, automatically select the first one
        if (fetchedLeagues.length > 0) {
          setSelectedLeague(fetchedLeagues[0].code || fetchedLeagues[0].id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leagues:', err.message);
        const errorDetails = getErrorDetails(err, 'Failed to fetch leagues.');
        setError(errorDetails);
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);
  
  // Fetch teams when a league is selected
  useEffect(() => {
    if (selectedLeague) {
      const fetchTeams = async () => {
        try {
          setLoadingTeams(true);
          setError(null);
          console.log(`Fetching teams for league: ${selectedLeague}`);
          
          // Call our backend API to get teams for the selected league
          const response = await axios.get(`/api/teams/league/${selectedLeague}`);
          
          // Check if teams data exists in the response
          const fetchedTeams = response.data.teams || [];
          console.log(`Fetched ${fetchedTeams.length} teams for league ${selectedLeague}`);
          
          setTeams(fetchedTeams);
          setLoadingTeams(false);
        } catch (err) {
          console.error(`Error fetching teams for league ${selectedLeague}:`, err.message);
          const errorDetails = getErrorDetails(
            err, 
            `Failed to fetch teams for league ${selectedLeague}. The API may have rate limits or the league code may not be valid.`
          );
          setError(errorDetails);
          setTeams([]);
          setLoadingTeams(false);
        }
      };
      
      fetchTeams();
    }
  }, [selectedLeague]);

  // Handle team selection
  const handleTeamChange = async (e) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);
    
    if (teamId) {
      try {
        setSearching(true);
        const response = await axios.get(`/api/players/team/${teamId}`);
        setPlayers(response.data.players || []);
        setError(null);
      } catch (err) {
        setError(getErrorDetails(err));
        setPlayers([]);
      } finally {
        setSearching(false);
      }
    } else {
      setPlayers([]);
    }
  };

  // Handle search by name - Note: This currently displays a message since the API doesn't fully support it
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setSearching(true);
      // The current API doesn't fully support direct player search by name
      // This is a fallback approach
      setError({
        message: 'Direct player search is limited with the current API',
        details: 'Please try selecting a team from the dropdown to view its players.'
      });
      setPlayers([]);
    } catch (err) {
      setError(getErrorDetails(err));
    } finally {
      setSearching(false);
    }
  };

  // Handle player click to navigate to details
  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  return (
    <div className="players-page">
      <h2 className="mb-4">Players</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Search by Team</h5>
              <div className="form-group mb-3">
                <label htmlFor="leagueSelect" className="form-label">Select a League</label>
                <select 
                  id="leagueSelect" 
                  className="form-select"
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select a league...</option>
                  {leagues.map(league => (
                    <option key={league.id} value={league.code || league.id}>
                      {league.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="teamSelect" className="form-label">Select a Team</label>
                <select 
                  id="teamSelect" 
                  className="form-select"
                  value={selectedTeam}
                  onChange={handleTeamChange}
                  disabled={loadingTeams || teams.length === 0}
                >
                  <option value="">Select a team...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {loadingTeams && <small className="text-muted d-block mt-2">Loading teams...</small>}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Search by Name</h5>
              <form onSubmit={handleSearch}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter player name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={searching}
                  />
                  <button 
                    className="btn btn-primary" 
                    type="submit"
                    disabled={searching || !searchTerm.trim()}
                  >
                    Search
                  </button>
                </div>
              </form>
              <small className="text-muted">
                Note: Player search by name has limited support with the current API.
              </small>
            </div>
          </div>
        </div>
      </div>

      {loading && leagues.length === 0 && (
        <LoadingSpinner message="Loading leagues..." fullPage={true} />
      )}

      {error && (
        <ErrorMessage
          message={error.message}
          details={error.details}
        />
      )}

      {searching ? (
        <LoadingSpinner message="Searching for players..." />
      ) : (
        <>
          {players.length > 0 ? (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Players</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Nationality</th>
                        <th>Date of Birth</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map(player => (
                        <tr key={player.id}>
                          <td>{player.shirtNumber || '-'}</td>
                          <td>{player.name}</td>
                          <td>{player.position || 'Unknown'}</td>
                          <td>{player.nationality || 'Unknown'}</td>
                          <td>{player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'Unknown'}</td>
                          <td>
                            <button 
                              onClick={() => handlePlayerClick(player.id)} 
                              className="btn btn-sm btn-outline-primary"
                            >
                              Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            selectedTeam && !error && !searching && (
              <div className="alert alert-info">
                No players found. Try selecting a different team.
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default PlayersPage;
