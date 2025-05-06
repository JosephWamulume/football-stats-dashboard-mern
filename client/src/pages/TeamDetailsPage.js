import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TeamDetailsPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('squad');

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch team details from our API
        const teamResponse = await axios.get(`/api/teams/${id}`);
        setTeam(teamResponse.data);
        
        // If the team API response includes squad, use it
        if (teamResponse.data.squad && teamResponse.data.squad.length > 0) {
          setPlayers(teamResponse.data.squad);
        } else {
          // Otherwise make a separate request for players
          const playersResponse = await axios.get(`/api/players/team/${id}`);
          setPlayers(playersResponse.data || []);
        }
        
        // Fetch team matches (recent & upcoming)
        const matchesResponse = await axios.get(`/api/teams/${id}/matches`);
        setMatches(matchesResponse.data.matches || []);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch team details. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTeamDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading team details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        {error}
      </div>
    );
  }

  // Format date for matches
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Link to="/teams" className="btn btn-outline-secondary mb-4">
        <i className="fas fa-arrow-left"></i> Back to Teams
      </Link>
      
      {team && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 text-center">
                  <img 
                    src={team.crest || team.crestUrl} 
                    alt={`${team.name} logo`} 
                    className="img-fluid mb-3" 
                    style={{ maxHeight: '150px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                </div>
                <div className="col-md-9">
                  <h2 className="mb-3">{team.name}</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Short Name:</strong> {team.shortName || team.tla || 'N/A'}</p>
                      <p><strong>Founded:</strong> {team.founded || 'Unknown'}</p>
                      <p><strong>Stadium:</strong> {team.venue || 'Unknown'}</p>
                      <p><strong>Club Colors:</strong> {team.clubColors || 'Unknown'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Address:</strong> {team.address || 'Unknown'}</p>
                      <p><strong>Website:</strong> {team.website ? <a href={team.website} target="_blank" rel="noopener noreferrer">{team.website}</a> : 'Unknown'}</p>
                      <p><strong>Email:</strong> {team.email || 'Unknown'}</p>
                      <p><strong>Phone:</strong> {team.phone || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'squad' ? 'active' : ''}`}
                onClick={() => setActiveTab('squad')}
              >
                Squad
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`}
                onClick={() => setActiveTab('matches')}
              >
                Matches
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Team Stats
              </button>
            </li>
          </ul>

          {activeTab === 'squad' && (
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Squad</h4>
              </div>
              <div className="card-body">
                {players.length > 0 ? (
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
                            <td>{player.nationality}</td>
                            <td>{player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'Unknown'}</td>
                            <td>
                              <Link to={`/players/${player.id}`} className="btn btn-sm btn-outline-primary">
                                Profile
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No squad information available for this team.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Recent & Upcoming Matches</h4>
              </div>
              <div className="card-body">
                {matches.length > 0 ? (
                  <div className="list-group">
                    {matches.map(match => (
                      <div key={match.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className={`badge ${match.status === 'FINISHED' ? 'bg-secondary' : 'bg-primary'} me-2`}>
                              {match.status === 'FINISHED' ? 'FT' : 'SCHEDULED'}
                            </div>
                            <div>{formatDate(match.utcDate)}</div>
                          </div>
                        </div>
                        <div className="row align-items-center mt-2">
                          <div className="col-5 text-end">
                            <strong>{match.homeTeam.name}</strong>
                          </div>
                          <div className="col-2 text-center">
                            {match.status === 'FINISHED' ? (
                              <strong>
                                {match.score.fullTime?.home ?? match.score.home} - {match.score.fullTime?.away ?? match.score.away}
                              </strong>
                            ) : (
                              <span>vs</span>
                            )}
                          </div>
                          <div className="col-5 text-start">
                            <strong>{match.awayTeam.name}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No match information available for this team.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Team Statistics</h4>
              </div>
              <div className="card-body">
                <p className="text-muted">
                  This section would display team statistics like win rate, goals scored/conceded, 
                  possession percentages, etc. This would be implemented with charts when more
                  statistical data is available from the API.
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Performance Stats</h5>
                        <p className="text-muted">Charts would go here</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Results Summary</h5>
                        <p className="text-muted">Summary stats would go here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamDetailsPage;
