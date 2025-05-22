import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getErrorDetails } from '../utils/errorHandler';

const TeamsPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchTeams = async (leagueId = selectedLeague) => {
    if (!leagueId) return;
    
    try {
      setLoadingTeams(true);
      setError(null);
      console.log(`Fetching teams for league: ${leagueId}`);
      
      // Call our backend API to get teams for the selected league
      const response = await axios.get(`/api/teams/league/${leagueId}`);
      
      // Check if teams data exists in the response
      const fetchedTeams = response.data.teams || [];
      console.log(`Fetched ${fetchedTeams.length} teams for league ${leagueId}`);
      
      setTeams(fetchedTeams);
      setLoadingTeams(false);
    } catch (err) {
      console.error(`Error fetching teams for league ${leagueId}:`, err.message);
      const errorDetails = getErrorDetails(
        err, 
        `Failed to fetch teams for league ${leagueId}. The API may have rate limits or the league code may not be valid.`
      );
      setError(errorDetails);
      setTeams([]);
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    if (selectedLeague) {
      fetchTeams(selectedLeague);
    }
  }, [selectedLeague]);

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value);
  };

  if (loading && leagues.length === 0) {
    return <LoadingSpinner message="Loading leagues..." fullPage={true} />;
  }

  if (error && leagues.length === 0) {
    return (
      <ErrorMessage 
        message={error.message} 
        errorCode={error.code} 
        onRetry={error.canRetry ? fetchLeagues : undefined} 
      />
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Teams</h2>
        <div className="d-flex align-items-center">
          <label htmlFor="leagueSelect" className="form-label me-2 mb-0">
            Select League:
          </label>
          <select
            id="leagueSelect"
            className="form-select"
            value={selectedLeague}
            onChange={handleLeagueChange}
            style={{ width: 'auto' }}
          >
            {leagues.map((league) => (
              <option key={league.id} value={league.code || league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <ErrorMessage 
          message={error.message} 
          errorCode={error.code} 
          onRetry={error.canRetry ? () => fetchTeams(selectedLeague) : undefined}
          small={true} 
        />
      )}

      {loadingTeams ? (
        <LoadingSpinner message="Loading teams..." />
      ) : (
        <>
          {teams.length === 0 && !loadingTeams ? (
            <div className="alert alert-info">
              No teams found for this league. The API may have rate limits or the league may not have active teams.
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {teams.map((team) => (
                <div key={team.id} className="col">
                  <div 
                    className="card h-100 team-card" 
                    onClick={() => handleTeamClick(team.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="text-center pt-3">
                      <img
                        src={team.crest}
                        alt={`${team.name} logo`}
                        className="card-img-top"
                        style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100?text=Team';
                        }}
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-center">{team.name}</h5>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <strong>Founded:</strong> {team.founded || 'Unknown'}
                        </li>
                        <li className="list-group-item">
                          <strong>Stadium:</strong> {team.venue || 'Unknown'}
                        </li>
                      </ul>
                    </div>
                    <div className="card-footer bg-transparent border-top-0 text-center">
                      <Link 
                        to={`/teams/${team.id}`} 
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamsPage;
