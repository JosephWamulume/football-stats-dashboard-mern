import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const LeagueDetailsPage = () => {
  const { id } = useParams();
  const [leagueDetails, setLeagueDetails] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagueDetails = async () => {
      try {
        // In production, these would be calls to your backend API
        // const detailsResponse = await axios.get(`/api/leagues/${id}`);
        // const standingsResponse = await axios.get(`/api/leagues/${id}/standings`);
        
        // For development without the backend ready, we'll use sample data
        // This would be replaced with actual API calls
        const sampleLeagues = {
          'PL': { id: 'PL', name: 'Premier League', country: 'England', logo: 'https://crests.football-data.org/PL.png' },
          'PD': { id: 'PD', name: 'La Liga', country: 'Spain', logo: 'https://crests.football-data.org/PD.png' },
          'SA': { id: 'SA', name: 'Serie A', country: 'Italy', logo: 'https://crests.football-data.org/SA.png' },
          'BL1': { id: 'BL1', name: 'Bundesliga', country: 'Germany', logo: 'https://crests.football-data.org/BL1.png' },
          'FL1': { id: 'FL1', name: 'Ligue 1', country: 'France', logo: 'https://crests.football-data.org/FL1.png' }
        };
        
        const sampleStandings = [
          { position: 1, team: { id: 1, name: 'Team A', crestUrl: 'https://via.placeholder.com/30' }, playedGames: 10, won: 8, draw: 1, lost: 1, points: 25, goalsFor: 20, goalsAgainst: 8 },
          { position: 2, team: { id: 2, name: 'Team B', crestUrl: 'https://via.placeholder.com/30' }, playedGames: 10, won: 7, draw: 2, lost: 1, points: 23, goalsFor: 18, goalsAgainst: 10 },
          { position: 3, team: { id: 3, name: 'Team C', crestUrl: 'https://via.placeholder.com/30' }, playedGames: 10, won: 6, draw: 2, lost: 2, points: 20, goalsFor: 16, goalsAgainst: 9 },
          { position: 4, team: { id: 4, name: 'Team D', crestUrl: 'https://via.placeholder.com/30' }, playedGames: 10, won: 5, draw: 3, lost: 2, points: 18, goalsFor: 15, goalsAgainst: 10 },
          { position: 5, team: { id: 5, name: 'Team E', crestUrl: 'https://via.placeholder.com/30' }, playedGames: 10, won: 5, draw: 2, lost: 3, points: 17, goalsFor: 14, goalsAgainst: 12 },
          { position: 6, team: { id: 6, name: 'Team F', crestUrl: 'https://via.placeholder.com/30' }, playedGames: 10, won: 4, draw: 4, lost: 2, points: 16, goalsFor: 12, goalsAgainst: 10 },
          { position: 7, team: { id: 7, name: 'Team G', crestUrl: 'https://via.placeholder.com/30' }, playedGames: 10, won: 4, draw: 3, lost: 3, points: 15, goalsFor: 11, goalsAgainst: 10 },
          { position: 8, team: { id: 8, name: 'Team H', crestUrl: 'https://via.placeholder.com/30' }, playedGames: 10, won: 3, draw: 5, lost: 2, points: 14, goalsFor: 10, goalsAgainst: 9 }
        ];
        
        setTimeout(() => {
          setLeagueDetails(sampleLeagues[id] || { name: 'Unknown League', country: 'Unknown' });
          setStandings(sampleStandings);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        setError('Failed to fetch league details. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchLeagueDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading league details...</p>
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

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <Link to="/leagues" className="btn btn-outline-secondary me-3">
          <i className="fas fa-arrow-left"></i> Back to Leagues
        </Link>
        {leagueDetails?.logo && (
          <img 
            src={leagueDetails.logo} 
            alt={`${leagueDetails.name} logo`} 
            style={{ height: '50px', marginRight: '15px' }}
          />
        )}
        <div>
          <h2 className="mb-0">{leagueDetails?.name}</h2>
          <p className="text-muted mb-0">{leagueDetails?.country}</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h4 className="mb-0">League Standings</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover standings-table mb-0">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Team</th>
                  <th>Played</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {standings.map(team => (
                  <tr key={team.position}>
                    <td>{team.position}</td>
                    <td>
                      <Link to={`/teams/${team.team.id}`} className="text-decoration-none text-dark">
                        <div className="d-flex align-items-center">
                          <img 
                            src={team.team.crestUrl} 
                            alt={`${team.team.name} logo`}
                            style={{ height: '20px', width: '20px', marginRight: '10px' }}
                          />
                          {team.team.name}
                        </div>
                      </Link>
                    </td>
                    <td>{team.playedGames}</td>
                    <td>{team.won}</td>
                    <td>{team.draw}</td>
                    <td>{team.lost}</td>
                    <td>{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td>{team.goalsFor - team.goalsAgainst}</td>
                    <td><strong>{team.points}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats and Charts section would go here */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Top Scorers</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">Top scorer data would be populated here when connected to the API.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Results</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">Recent match results would be populated here when connected to the API.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueDetailsPage;
