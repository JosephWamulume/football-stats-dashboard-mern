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
        // In production, these would be calls to your backend API
        // const teamResponse = await axios.get(`/api/teams/${id}`);
        // const playersResponse = await axios.get(`/api/players/team/${id}`);
        // const matchesResponse = await axios.get(`/api/teams/${id}/matches`);
        
        // For development without the backend ready, we'll use sample data
        const sampleTeam = {
          id: 1,
          name: 'Arsenal FC',
          shortName: 'Arsenal',
          tla: 'ARS',
          crestUrl: 'https://crests.football-data.org/57.png',
          address: 'Highbury House, 75 Drayton Park London N5 1BU',
          phone: '+44 (020) 76195003',
          website: 'http://www.arsenal.com',
          email: 'info@arsenal.co.uk',
          founded: 1886,
          clubColors: 'Red / White',
          venue: 'Emirates Stadium',
          lastUpdated: '2020-05-14T02:41:34Z'
        };
        
        const samplePlayers = [
          { id: 101, name: 'Bukayo Saka', position: 'Attacker', dateOfBirth: '2001-09-05', nationality: 'England', shirtNumber: 7 },
          { id: 102, name: 'Martin Ødegaard', position: 'Midfielder', dateOfBirth: '1998-12-17', nationality: 'Norway', shirtNumber: 8 },
          { id: 103, name: 'Gabriel Jesus', position: 'Attacker', dateOfBirth: '1997-04-03', nationality: 'Brazil', shirtNumber: 9 },
          { id: 104, name: 'William Saliba', position: 'Defender', dateOfBirth: '2001-03-24', nationality: 'France', shirtNumber: 2 },
          { id: 105, name: 'Aaron Ramsdale', position: 'Goalkeeper', dateOfBirth: '1998-05-14', nationality: 'England', shirtNumber: 1 },
          { id: 106, name: 'Gabriel Martinelli', position: 'Attacker', dateOfBirth: '2001-06-18', nationality: 'Brazil', shirtNumber: 11 }
        ];
        
        const sampleMatches = [
          { id: 201, homeTeam: { id: 1, name: 'Arsenal FC' }, awayTeam: { id: 2, name: 'Manchester United FC' }, score: { home: 3, away: 1 }, status: 'FINISHED', utcDate: '2025-01-15T15:00:00Z' },
          { id: 202, homeTeam: { id: 3, name: 'Liverpool FC' }, awayTeam: { id: 1, name: 'Arsenal FC' }, score: { home: 2, away: 2 }, status: 'FINISHED', utcDate: '2025-01-08T15:00:00Z' },
          { id: 203, homeTeam: { id: 1, name: 'Arsenal FC' }, awayTeam: { id: 4, name: 'Chelsea FC' }, score: { home: 2, away: 0 }, status: 'FINISHED', utcDate: '2025-01-01T15:00:00Z' },
          { id: 204, homeTeam: { id: 1, name: 'Arsenal FC' }, awayTeam: { id: 5, name: 'Manchester City FC' }, score: { }, status: 'SCHEDULED', utcDate: '2025-01-22T15:00:00Z' }
        ];
        
        setTimeout(() => {
          setTeam(sampleTeam);
          setPlayers(samplePlayers);
          setMatches(sampleMatches);
          setLoading(false);
        }, 500);
        
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
                    src={team.crestUrl} 
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
                      <p><strong>Short Name:</strong> {team.shortName}</p>
                      <p><strong>Founded:</strong> {team.founded}</p>
                      <p><strong>Stadium:</strong> {team.venue}</p>
                      <p><strong>Club Colors:</strong> {team.clubColors}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Address:</strong> {team.address}</p>
                      <p><strong>Website:</strong> <a href={team.website} target="_blank" rel="noopener noreferrer">{team.website}</a></p>
                      <p><strong>Email:</strong> {team.email}</p>
                      <p><strong>Phone:</strong> {team.phone}</p>
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
                          <td>{player.shirtNumber}</td>
                          <td>{player.name}</td>
                          <td>{player.position}</td>
                          <td>{player.nationality}</td>
                          <td>{new Date(player.dateOfBirth).toLocaleDateString()}</td>
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
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Recent & Upcoming Matches</h4>
              </div>
              <div className="card-body">
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
                            <strong>{match.score.home} - {match.score.away}</strong>
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
                  possession percentages, etc. This would be implemented with charts when connected
                  to the API with real data.
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
