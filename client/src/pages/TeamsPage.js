import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch available leagues for the dropdown
    const fetchLeagues = async () => {
      try {
        // Get leagues from our backend API
        const response = await axios.get('/api/leagues');
        setLeagues(response.data.competitions || []);
      } catch (err) {
        console.error('Error fetching leagues:', err);
      }
    };

    fetchLeagues();
  }, []);

  const fetchTeams = async (leagueId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get teams for the selected league from our backend API
      const response = await axios.get(`/api/teams/league/${leagueId}`);
      setTeams(response.data.teams || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch teams. Please try again later.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleLeagueChange = (e) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    
    if (leagueId) {
      fetchTeams(leagueId);
    } else {
      setTeams([]);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Football Teams</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Select a League</h5>
          <p className="card-text">Choose a league to view its teams</p>
          
          <div className="row align-items-end">
            <div className="col-md-6">
              <label htmlFor="leagueSelect" className="form-label">League</label>
              <select
                id="leagueSelect"
                className="form-select"
                value={selectedLeague}
                onChange={handleLeagueChange}
              >
                <option value="">-- Select a league --</option>
                {leagues.map(league => (
                  <option key={league.id || league.code} value={league.code || league.id}>
                    {league.name} ({league.country || league.area?.name || 'Unknown'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading teams...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger my-4" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && teams.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {teams.map(team => (
            <div className="col" key={team.id}>
              <div className="card h-100 team-card">
                <div className="text-center pt-3">
                  <img 
                    src={team.crest || team.crestUrl} 
                    alt={`${team.name} logo`} 
                    className="card-img-top" 
                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                    }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text mb-1">
                    <small><i className="fas fa-calendar me-2"></i>Founded: {team.founded || 'Unknown'}</small>
                  </p>
                  <p className="card-text mb-3">
                    <small><i className="fas fa-map-marker-alt me-2"></i>{team.venue || team.address || 'Unknown'}</small>
                  </p>
                  <Link to={`/teams/${team.id}`} className="btn btn-primary">
                    Team Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && selectedLeague && teams.length === 0 && (
        <div className="alert alert-info">
          No teams found for the selected league.
        </div>
      )}

      {!loading && !error && !selectedLeague && (
        <div className="text-center my-5">
          <i className="fas fa-hand-point-up fa-3x mb-3 text-muted"></i>
          <p className="text-muted">Please select a league from the dropdown above to view teams.</p>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
